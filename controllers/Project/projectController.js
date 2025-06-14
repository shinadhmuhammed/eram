const Project = require("../../models/projectModel");
const mongoose = require("mongoose");
const Workorder = require("../../models/workorderModel");
const User = require("../../models/userModel");
const redisClient = require("../../utils/redisClient");

const addProject = async (req, res) => {
  const { name, prefix, description } = req.body;
  const adminId = req.user.id;
  try {
    if (!name || !prefix || !description)
      return res.status(400).json({ message: "missing required fields!" });

    const samePrefix = await Project.findOne({
      prefix: prefix,
      createdBy: adminId,
    });
    if (samePrefix)
      return res.status(500).json({
        message: "prefix already exists with the same variable name!",
      });

    const newProject = new Project({
      name,
      prefix,
      description,
      createdBy: adminId,
    });
    await newProject.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const editProject = async (req, res) => {
  const { Id } = req.params;
  const { name, prefix, description } = req.body;
  const adminId = req.user.id;

  try {
    if (!name || !prefix || !description)
      return res.status(400).json({ message: "Missing required fields!" });

    const existingProjectWithPrefix = await Project.findOne({
      _id: { $ne: Id },
      prefix: prefix,
      createdBy: adminId,
    });
    if (existingProjectWithPrefix) {
      return res
        .status(400)
        .json({ message: "Prefix already exists under your account!" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: Id, createdBy: adminId },
      { name, prefix, description },
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProject = async (req, res) => {
  try {
    const adminId = req.user.id;
    const allProjects = await Project.find({
      createdBy: adminId,
    });
    return res.status(200).json({ allProjects });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const findProject = await Project.findById({ _id: id, createdBy: adminId });

    if (!findProject) {
      return res.status(404).json({ message: "project not found!!" });
    }

    return res.status(200).json({ findProject });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getCandidate = async (req, res) => {
  const adminId = req.user.id;
  // const redisKey = `candidates:${adminId}`;
  try {
    // const cachedCandidates = await redisClient.get(redisKey);

    // if (cachedCandidates) {
    //   return res.status(200).json({
    //     message: "candidates fetched successfully (from cache)",
    //     getCandidates: JSON.parse(cachedCandidates),
    //   });
    // }

    const getCandidates = await User.find({
      createdBy: adminId,
      role: "candidate",
    });
    if (getCandidates.length === 0) {
      return res.status(404).json({ message: "candidates not found" });
    }
    // await redisClient.set(redisKey, JSON.stringify(getCandidates), {
    //   EX: 3600,
    // });
    return res
      .status(200)
      .json({ message: "candidates fetched successfully", getCandidates });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCandidateById = async (req, res) => {
  const { Id } = req.params;
  try {
    const candidate = await User.findById(Id);
    if (!candidate) {
      return res.status(404).json({ message: "canididate not found" });
    }
    return res
      .status(200)
      .json({ message: "candidate fetch successfully", candidate });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const adminId = req.user.id;

    const findProject = await Project.findById({
      _id: id,
      createdBy: adminId,
    });

    if (!findProject) {
      return res.status(404).json({ message: "project not found" });
    }

    await Project.deleteOne({ _id: id, createdBy: adminId });
    return res.status(200).json({ message: "project deleted" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteWorkorder = async (req, res) => {
  const { Id } = req.params;

  try {
    const result = await Workorder.findByIdAndDelete(Id);

    if (!result) {
      return res.status(404).json({ message: "Workorder not found" });
    }

    return res.status(200).json({ message: "Workorder deleted successfully" });
  } catch (error) {
    console.error("Error deleting workorder:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const disableProject = async (req, res) => {
  const adminId = req.user.id;
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid branch ID" });
    }

    const existingProject = await Project.findOne({
      _id: projectId,
      createdBy: adminId,
    });
    if (!existingProject) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newStatus =
      existingProject.status === "active" ? "inActive" : "active";

    existingProject.status = newStatus;
    await existingProject.save();

    return res
      .status(200)
      .json({ message: "Admin marked as disabled", data: existingProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addProject,
  editProject,
  getProject,
  getProjectById,
  deleteProject,
  deleteWorkorder,
  disableProject,
  getCandidate,
  getCandidateById,
};
