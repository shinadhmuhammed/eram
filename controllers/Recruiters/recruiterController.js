const User = require("../../models/userModel");
const Workorder = require("../../models/workorderModel");

const addRecruiter = async (req, res) => {
  try {
    const { fullName, email, phoneno,specialization,experience ,password, role } =
      req.body;

      const adminId = req.user.id
    if (
      !fullName ||
      !email ||
      !phoneno ||
      !password ||
      !adminId
    ) {
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
      phone:phoneno,
      specialization,
      experienceYears:experience,
      role,
      hashedPassword,
      createdBy: adminId,
    });

    await newRecruiter.save();

    res
      .status(201)
      .json({ message: "User registered successfully", newRecruiter });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
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
  getRecruiter,
  editJobpost,
};
