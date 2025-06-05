const User = require("../../models/userModel");
const Workorder = require("../../models/workorderModel");
const { clearRecruiterCache } = require("../../utils/cache");
const bcrypt = require("bcrypt");
const redisClient = require("../../utils/redisClient");

const addRecruiter = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneno,
      specialization,
      experience,
      password,
      role,
    } = req.body;

    const adminId = req.user.id;
    if (!fullName || !email || !phoneno || !password || !adminId) {
      return res.status(400).json({ message: "missing required fields!" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(500)
        .json({ message: "user already exists with the same email!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRecruiter = new User({
      fullName,
      email,
      phone: phoneno,
      specialization,
      experienceYears: experience,
      role,
      hashedPassword,
      createdBy: adminId,
    });

    await newRecruiter.save();
    await clearRecruiterCache(adminId);

    res
      .status(201)
      .json({ message: "User registered successfully", newRecruiter });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const editRecruiter = async (req, res) => {
  try {
    const { Id } = req.params;
    const {
      fullName,
      email,
      phoneno,
      specialization,
      experience,
      password,
      role,
    } = req.body;

    const adminId = req.user.id;

    if (!rId || !adminId) {
      return res.status(400).json({ message: "Missing required identifiers!" });
    }

    const recruiter = await User.findById(Id);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found!" });
    }

    if (fullName) recruiter.fullName = fullName;
    if (email) recruiter.email = email;
    if (phoneno) recruiter.phone = phoneno;
    if (specialization) recruiter.specialization = specialization;
    if (experience) recruiter.experienceYears = experience;
    if (role) recruiter.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      recruiter.hashedPassword = await bcrypt.hash(password, salt);
    }

    await recruiter.save();
    await clearRecruiterCache(adminId);

    return res
      .status(200)
      .json({ message: "Recruiter updated successfully", recruiter });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const disableRecruiter = async (req, res) => {
  const adminId=req.user.id
  try {
    const { recruiterId } = req.params;

    const recruiterUser = await User.findOne({
      _id: recruiterId,
      role: "recruiter",
    });
    if (!recruiterUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newStatus =
      recruiterUser.accountStatus === "active" ? "inActive" : "active";

    recruiterUser.accountStatus = newStatus;
    await recruiterUser.save();
    await clearRecruiterCache(adminId);

    return res
      .status(200)
      .json({ message: "Admin marked as disabled", data: recruiterUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteRecruiter = async (req, res) => {
  const { Id } = req.params;
  const adminId = req.user.id;

  try {
    const recruiter = await User.findOne({ _id: Id, role: "recruiter" });

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found!" });
    }

    await User.findByIdAndDelete(Id);
    await clearRecruiterCache(adminId);

    return res.status(200).json({ message: "Recruiter deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getRecruiter = async (req, res) => {
  const userId = req.user.id;

  try {
    const recruiterCacheKey = `recruiters:${userId}`;

    const cachedRecruiters = await redisClient.get(recruiterCacheKey);
    if (cachedRecruiters) {
      return res.status(200).json({ recruiters: JSON.parse(cachedRecruiters) });
    }

    const recruiters = await User.find({
      role: "recruiter",
      createdBy: userId,
    });

    await redisClient.set(recruiterCacheKey, JSON.stringify(recruiters), {
      EX: 60 * 5,
    });

    return res.status(200).json({ recruiters });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};


const getRecruiterById = async (req,res) => {
  const {Id} = req.params
try {
  const recruiter = await User.findOne({_id:Id,role:"recruiter"})
  return res.status(200).json({ recruiter });
} catch (error) {
  console.log(error.message);
    return res.status(500).json({ message: "server error"});
}
}

const editJobpost = async (req, res) => {
  const { Id } = req.params;
  const { pipeline, customFields } = req.body;
  try {
    const workorder = Workorder.findById(Id);
    if (!workorder) {
      return res.status(404).json({ message: "Workorder not found" });
    }

    if (pipeline) {
      workorder.pipeline = pipeline;
    }
    if (customFields && typeof customFields === "object") {
      for (const key in customFields) {
        workorder.customFields.set(key, customFields[key]);
      }
    }

    await workorder.save();

    res.status(200).json({
      message: "Workorder updated successfully",
      data: workorder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  addRecruiter,
  editRecruiter,
  deleteRecruiter,
  getRecruiter,
  getRecruiterById,
  disableRecruiter,
  editJobpost,
};
