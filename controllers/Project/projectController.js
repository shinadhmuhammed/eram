const Project = require("../../models/projectModel");

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
      return res
        .status(500)
        .json({ message: "prefix already exists with the same variable name!" });

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
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    return res
      .status(200)
      .json({ message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProject = async (req, res) => {
  try {
    const adminId = req.user.id
    const allProjects = await Project.find({
      createdBy: adminId
    })
    return res.status(200).json({ allProjects })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id

    const findProject = await Project.findById({ _id: id, createdBy: adminId })

    if (!findProject) {
      return res.status(404).json({ message: "project not found!!" })
    }

    return res.status(200).json({ findProject })

  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const adminId = req.user.id;

    const findProject = await Project.findById({
      _id: id,
      createdBy: adminId
    })

    if (!findProject) {
      return res.status(404).json({ message: "project not found" })
    }

    await Project.deleteOne({ _id: id, createdBy: adminId })
    return res.status(200).json({ message: 'project deleted' })
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const disableProject = async (req, res) => {
  const adminId = req.user.id
  try {
    const { projectId } = req.params;

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


module.exports = { addProject, editProject, getProject, getProjectById, deleteProject, disableProject };
