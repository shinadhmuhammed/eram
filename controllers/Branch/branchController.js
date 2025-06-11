const Branch = require("../../models/branchModel");
const User = require("../../models/userModel");
const Workorder = require("../../models/workorderModel");
const { upload } = require("../../utils/multer");
const mongoose = require("mongoose");

const createBranch = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const {
        name,
        branchCode,
        isActive = true,
        location,
        description,
        // home,
        // about,
        // services,
        // contact,
      } = req.body;

      const brand_logo = req.file ? req.file.filename : null;
      const existingBranches = await Branch.find({});
      const branchLength = existingBranches.length;
      console.log(branchLength, "branch");

      if (
        !name ||
        !location ||
        !description 
        // !home ||
        // !about ||
        // !services ||
        // !contact
      ) {
        return res.status(400).json({
          message:
            "Missing required fields: name, location, description, home, about, services, or contact",
        });
      }

      const newBranch = new Branch({
        name,
        branchCode,
        location,
        isActive,
        description,
        brand_logo,
        // home: {
        //   title: home.title || "",
        //   bannerImage: home.bannerImage || "",
        //   herosectionOne: home.herosectionOne || "",
        // },
        // about: {
        //   title: about.title || "",
        //   description: about.description || "",
        // },
        // services: services || [],
        // contact: {
        //   email: contact.email || "",
        //   phone: contact.phone || "",
        // },
        branchOrder: branchLength + 1,
      });

      await newBranch.save();

      return res.status(201).json(newBranch);
    } catch (error) {
      console.error("Error creating branch:", error.message);
      return res.status(500).json({
        message: "Server error while creating branch",
        error: error.message,
      });
    }
  });
};

const getBranch = async (req, res) => {
  try {
    const branch = await Branch.find({});
    return res.status(200).json({ branch });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getjobByBranchID = async (req, res) => {
  const userEmail = req.user.email;
  try {
    const candidate = await User.findOne({
      email: userEmail,
      role: "candidate",
    });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const adminId = candidate.createdBy;
    const admin = await User.findOne({ _id: adminId, role: "admin" });

    if (!admin || !admin.branch) {
      return res.status(404).json({ message: "Admin or branch not found" });
    }

    const branchId = admin.branch;
    const workorders = await Workorder.aggregate([
      {
        $match: {
          branch: branchId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!workorders || workorders.length === 0) {
      return res
        .status(404)
        .json({ message: "No workorders found for this branch" });
    }

    return res.status(200).json({
      message: "Workorders fetched successfully",
      workorders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error. cant get the job posts" });
  }
};

const editBranch = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid branch ID" });
    }

    try {
      const branch = await Branch.findById(id);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      const updatableFields = [
        "name",
        "branchCode",
        "isActive",
        "location",
        "description",
        "home",
        "about",
        "services",
        "contact",
      ];

      updatableFields.forEach((field) => {
        if (typeof req.body[field] !== "undefined") {
          branch[field] = req.body[field];
        }
      });

      if (req.file) {
        branch.brand_logo = req.file.filename;
      }

      await branch.save();

      return res
        .status(200)
        .json({ message: "Branch updated successfully", data: branch });
    } catch (error) {
      console.error("Error editing branch:", error.message);
      return res.status(500).json({
        message: "Server error while editing branch",
        error: error.message,
      });
    }
  });
};

const deleteBranch = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    await Branch.findByIdAndDelete(branchId);

    const remainingBranches = await Branch.find().sort({ branchOrder: 1 });

    const bulkDelete = remainingBranches.map((branch, index) => ({
      updateOne: {
        filter: { _id: branch._id },
        update: { branchOrder: index + 1 },
      },
    }));

    if (bulkDelete.length > 0) {
      await Branch.bulkWrite(bulkDelete);
    }

    return res.status(200).json({
      message: "Branch deleted and branch order updated efficiently.",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error while deleting branch",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { branchId } = req.params;
    const newBranch = await Branch.findOne({ _id: branchId });
    if (!newBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    return res.status(200).json({ branch: newBranch });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while getting the  branch",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getBranch,
  getjobByBranchID,
  editBranch,
  deleteBranch,
  getBranchById,
};
