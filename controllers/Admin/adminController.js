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
    if (!allAdmins) {
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
    const adminId = req.user.id;
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
      Education,
      salaryType,
      annualSalary,
      pipeline,
      pipelineStageTimeline,
      startDate,
      endDate,
      deadlineDate,
      alertDate,
      assignedId,
      project,
      branchId,
      requiredSkills,
      jobRequirements,
      numberOfCandidate,
      isArchived,
      isCommon,
      benefits,
      WorkorderStatus,
      languagesRequired,
      customFields,
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
      Education,
      salaryType,
      annualSalary,
      startDate,
      endDate,
      deadlineDate,
      alertDate,
      assignedRecruiters: assignedId,
      pipeline,
      pipelineStageTimeline,
      project,
      branch: branchId,
      requiredSkills,
      jobRequirements,
      numberOfCandidate,
      isCommon,
      benefits,
      languagesRequired,
      workOrderStatus: WorkorderStatus,
      customFields,
      createdBy: adminId,
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

  console.log(req.body, "hi body");

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

const getWorkorder = async (req, res) => {
  const adminId = req.user.id;

  try {
    const workorders = await Workorder.find({ createdBy: adminId })
      .populate("project", "name")
      .populate("pipeline")
      .populate("assignedRecruiters", "fullName");

    if (!workorders || workorders.length === 0) {
      return res.status(404).json({ message: "No workorders found" });
    }

    return res.status(200).json({ workorders });
  } catch (error) {
    console.error("Error fetching workorders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkorderById = async (req, res) => {
  const { Id } = req.params;
  try {
    const workOrder = await Workorder.findById(Id);
    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }
    return res
      .status(200)
      .json({ message: "work order by id done", workOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error..!" });
  }
};

const workorderPublish = async (req, res) => {
  const { Id } = req.params;

  try {
    const workOrder = await Workorder.findByIdAndUpdate(
      Id,
      { workOrderStatus: "published", isActive: "active" },
      { new: true }
    );

    if (!workOrder) {
      return res.status(404).json({ message: "Workorder not found" });
    }

    return res
      .status(200)
      .json({ message: "Published successfully", order: workOrder });
  } catch (error) {
    console.error("Error publishing workorder:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const disableWorkorder = async (req, res) => {
  const { Id } = req.params;

  try {
    const workorder = await Workorder.findById(Id);

    if (!workorder) {
      return res.status(404).json({ message: "Workorder not found" });
    }

    const newStatus = workorder.isActive === "active" ? "inactive" : "active";

    workorder.isActive = newStatus;
    await workorder.save();

    return res.status(200).json({
      message: `Workorder is now ${newStatus}`,
      workorder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const disableCandidate = async (req, res) => {
  try {

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const disablePipeline = async (req, res) => {
  const { Id } = req.params;
  try {
    const pipeline = await Pipeline.findById(Id);
    if (!pipeline) {
      return res.status(404).json({ message: "Pipeline not found" });
    }
    const newStatus = pipeline.pipelineStatus === "active" ? "inActive" : "active";
    pipeline.pipelineStatus = newStatus;
    await pipeline.save();
    return res.status(200).json({
      message: `pipeline is now ${newStatus}`,
      pipeline,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
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
    return res.status(500).json({ message: "Internal server error" });
  }
};

const adminBranches = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const result = await User.aggregate([
      {
        $match: {
          email: userEmail,
          role: "admin",
          branch: { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchInfo",
        },
      },
      {
        $project: {
          branchInfo: 1,
          _id: 0,
        },
      },
    ]);

    if (result.length === 0 || result[0].branchInfo.length === 0) {
      return res.status(404).json({ message: "Branch not found for admin" });
    }

    return res.status(200).json({ branch: result[0].branchInfo[0] });
  } catch (error) {
    console.error("Error fetching branch info:", error);
    return res.status(500).json({ message: "Internal server error" });
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

    pipeline.stages = pipeline.stages.filter(
      (stage) => stage._id.toString() !== stageId
    );
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
      .json({ message: "Admin marked as disabled", data: adminUser });
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

const addCandidate = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    role,
    companyName,
    specialization,
    qualifications,
    experience,
  } = req.body;
  const adminId = req.user.id;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const candidate = await User.create({
      fullName,
      email,
      phone,
      passwordHash: hashedPassword,
      role,
      companyName,
      specialization,
      qualifications,
      experience,
      createdBy: adminId,
    });

    return res
      .status(201)
      .json({ message: "Added successfully..!", candidate });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const editCandidate = async (req, res) => {
  const Id = req.params.id;
  const adminId = req.user.id;

  const {
    fullName,
    email,
    phone,
    password,
    role,
    companyName,
    specialization,
    qualifications,
    experience,
  } = req.body;

  try {
    const candidate = await User.findOne({
      _id: Id,
      role: "candidate",
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (email && email !== candidate.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already registered by another user" });
      }
    }

    candidate.fullName = fullName || candidate.fullName;
    candidate.email = email || candidate.email;
    candidate.phone = phone || candidate.phone;
    candidate.role = role || candidate.role;
    candidate.companyName = companyName || candidate.companyName;
    candidate.specialization = specialization || candidate.specialization;
    candidate.qualifications = qualifications || candidate.qualifications;
    candidate.experience = experience || candidate.experience;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      candidate.passwordHash = await bcrypt.hash(password, salt);
    }

    candidate.updatedBy = adminId;

    await candidate.save();

    return res
      .status(200)
      .json({ message: "Candidate updated successfully", candidate });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ message: "Server error while updating candidate" });
  }
};

const bulkCandidate = async (req, res) => {
  const adminId = req.user.id;
  const candidates = req.body.candidates;
  const role = req.body.role;

  try {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ message: "No candidates provided" });
    }

    const candidatesToInsert = await Promise.all(
      candidates.map(async (candidate) => {
        const existingUser = await User.findOne({ email: candidate.email });
        if (existingUser) return null;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(candidate.password, salt);

        return {
          fullName: candidate.fullName,
          email: candidate.email,
          phone: candidate.phone,
          passwordHash: hashedPassword,
          companyName: candidate?.companyName,
          specialization: candidate?.specialization,
          qualifications: candidate?.qualifications,
          role,
          createdBy: adminId,
        };
      })
    );

    const filteredCandidates = candidatesToInsert.filter(Boolean);

    if (filteredCandidates.length === 0) {
      return res.status(400).json({ message: "All emails already registered" });
    }

    const result = await User.insertMany(filteredCandidates);

    return res.status(201).json({
      message: `Bulk ${role} added successfully`,
      count: result.length,
      candidates: result,
    });
  } catch (error) {
    console.error("Bulk adding Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCandidate = async (req, res) => {
  const { Id } = req.params;
  try {
    const del = await User.findByIdAndDelete(Id);
    if (!del) {
      return res.status(404).json({ message: "candidate not found" });
    }

    return res
      .status(200)
      .json({ message: "Candidate deleted successfully...!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addAdmin,
  getAllAdmin,
  createWorkOrder,
  getPipeline,
  getPipelineById,
  adminBranches,
  getWorkorder,
  getWorkorderById,
  workorderPublish,
  disableWorkorder,
  disableCandidate,
  addPipeline,
  editAdmin,
  disableAdmin,
  getAdminById,
  editWorkOrder,
  editPipeline,
  deletePipeline,
  disablePipeline,
  editStage,
  deleteStage,
  addCandidate,
  editCandidate,
  bulkCandidate,
  deleteCandidate,
};
