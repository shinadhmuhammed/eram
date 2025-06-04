const Pipeline = require("../../models/pipelineModel");
const User = require("../../models/userModel");
const Workorder = require("../../models/workorderModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const redisClient = require("../../utils/redisClient");
const { clearUserPipelineCache } = require("../../utils/cache");
const addAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      fullName,
      role,
      email,
      branchId,
      phone,
      cPassword,
    } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cPassword, salt);

    const newAdmin = new User({
      firstName,
      lastName,
      fullName,
      role,
      email,
      phone,
      hashedPassword,
      branch: branchId,
    });

    await newAdmin.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const allAdmins = await User.find({ role: "admin" });
    if(!allAdmins){
         return res.status(404).json({ message: "Not find any admin" });
    }
    return res.status(200).json({ allAdmins });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const createWorkOrder = async (req, res) => {
  try {
    const {
      title,
      jobCode,
      workplace,
      officeLocation,
      description,
      jobFunction,
      companyIndustry,
      EmploymentType,
      Experience,
      priority,
      Education,
      annualSalary,
      pipeline,
      startDate,
      endDate,
      deadlineDate,
      assignedId,
      branchId,
      requiredSkills,
      jobRequirements,
      numberOfCandidate,
      isArchived,
      isCommon,
      benefits,
      languagesRequired,
    } = req.body;

    const newWorkorder = await Workorder.create({
      title,
      jobCode,
      workplace,
      officeLocation,
      description,
      jobFunction,
      companyIndustry,
      EmploymentType,
      Experience,
      priority,
      Education,
      annualSalary,
      pipeline,
      startDate,
      endDate,
      deadlineDate,
      assignedRecruiters: assignedId,
      branch: branchId,
      requiredSkills,
      jobRequirements,
      numberOfCandidate,
      isArchived,
      isCommon,
      benefits,
      languagesRequired,
    });

    res.status(201).json({
      message: "Work order created successfully",
      data: newWorkorder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating work order" });
  }
};

const editWorkOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid work order ID" });
  }

  try {
    const updatedWorkorder = await Workorder.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedWorkorder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    res.status(200).json({
      message: "Work order updated successfully",
      data: updatedWorkorder,
    });
  } catch (error) {
    console.error("Error updating work order:", error);
    res.status(500).json({ message: "Server error while updating work order" });
  }
};

const editStage = async (req, res) => {
  const { Id: stageId } = req.params;
  const { name, order, description, requiredDocuments } = req.body;

  try {
    const pipeline = await Pipeline.findOne({ "stages._id": stageId });

    if (!pipeline) {
      return res
        .status(404)
        .json({ message: "Stage not found in any pipeline" });
    }
    const stage = pipeline.stages.id(stageId);
    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    if (name) stage.name = name;
    if (order) stage.order = order;
    if (description) stage.description = description;
    if (requiredDocuments) stage.requiredDocuments = requiredDocuments;

    await pipeline.save();
    await clearUserPipelineCache(pipeline.createdBy);

    return res
      .status(200)
      .json({ message: "Stage updated successfully", pipeline });
  } catch (error) {
    console.error("Error updating pipeline stage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPipeline = async (req, res) => {
  const userId = req.user.id;

  try {
    const cacheKey = `all_pipelines:${userId}`;
    const cachedPipelines = await redisClient.get(cacheKey);
    if (cachedPipelines) {
      return res
        .status(200)
        .json({ allPipelines: JSON.parse(cachedPipelines) });
    }

    const allPipelines = await Pipeline.find({ createdBy: userId });
    await redisClient.set(cacheKey, JSON.stringify(allPipelines), {
      EX: 60 * 5,
    });

    return res.status(200).json({ allPipelines });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getPipelineById = async (req, res) => {
  const { piplineId } = req.params;
  try {
    const getPipelineByIds = await Pipeline.findById(piplineId);
    if (!getPipelineByIds) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    return res.status(200).json({ getPipelineByIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const addPipeline = async (req, res) => {
  const { name, stages } = req.body;

  const createdBy = req.user.id;

  try {
    if (!name || !Array.isArray(stages) || stages.length === 0) {
      return res
        .status(400)
        .json({ message: "Pipeline name and at least one stage are required" });
    }

    const newPipeLine = new Pipeline({
      name,
      stages,
      createdBy,
    });

    await newPipeLine.save();
    await clearUserPipelineCache(createdBy);

    return res
      .status(200)
      .json({ message: "Pipeline added succesfully..!", data: newPipeLine });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editPipeline = async (req, res) => {
  const { pipelineId } = req.params;
  const { name, stages } = req.body;

  try {
    const existingPipeline = await Pipeline.findById(pipelineId);

    if (!existingPipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    if (name) existingPipeline.name = name;
    if (Array.isArray(stages) && stages.length > 0) {
      existingPipeline.stages = stages;
    }

    await existingPipeline.save();
    await clearUserPipelineCache(existingPipeline.createdBy);

    return res.status(200).json({
      message: "Pipeline updated successfully",
      data: existingPipeline,
    });
  } catch (error) {
    console.error("Edit pipeline error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePipeline = async (req, res) => {
  const { Id } = req.params;
  try {
    const pipelineDelete = await Pipeline.findByIdAndDelete({ _id: Id });
     await clearUserPipelineCache(pipelineDelete.createdBy);
    return res.status(200).json({ message: "Deleted Successfully..!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteStage = async (req, res) => {
  const { Id: stageId } = req.params;

  try {
    const pipeline = await Pipeline.findOne({ "stages._id": stageId });

    if (!pipeline) {
      return res
        .status(404)
        .json({ message: "Stage not found in any pipeline" });
    }

    pipeline.stages.id(stageId).remove();

    await pipeline.save();
    await clearUserPipelineCache(pipeline.createdBy);

    return res
      .status(200)
      .json({ message: "Stage deleted successfully", pipeline });
  } catch (error) {
    console.error("Error deleting pipeline stage:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editAdmin = async (req, res) => {
  const { adminId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid admin ID" });
  }

  try {
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (req.body.branchId) {
      adminUser.branch = req.body.branchId;
    }

    if (req.body.password || req.body.cPassword) {
      const plainPassword = req.body.password || req.body.cPassword;
      const salt = await bcrypt.genSalt(10);
      adminUser.passwordHash = await bcrypt.hash(plainPassword, salt);
    }

    const allowedFields = Object.keys(User.schema.paths).filter(
      (field) => !["_id", "__v", "passwordHash", "branch"].includes(field)
    );

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        adminUser[key] = req.body[key];
      }
    }

    await adminUser.save();
    return res.status(200).json({
      message: "Admin updated successfully",
      data: adminUser,
    });
  } catch (error) {
    console.error("Error updating admin:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const disableAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    const adminUser = await User.findOne({ _id: adminId, role: "admin" });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    adminUser.accountStatus =
      adminUser.accountStatus === "active" ? "inActive" : "active";
    await adminUser.save();

    return res
      .status(200)
      .json({ message: "Admin marked as deleted", data: adminUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;

    const adminUser = await User.findOne({ _id: adminId }).populate("branch");

    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin: adminUser });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addAdmin,
  getAllAdmin,
  createWorkOrder,
  getPipeline,
  getPipelineById,
  addPipeline,
  editAdmin,
  disableAdmin,
  getAdminById,
  editWorkOrder,
  editPipeline,
  deletePipeline,
  editStage,
  deleteStage,
};
