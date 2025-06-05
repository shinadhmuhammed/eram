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
  const { id } = req.params; 
  const { name, prefix, description } = req.body;
  const adminId = req.user.id;

  try {
    if (!name || !prefix || !description)
      return res.status(400).json({ message: "Missing required fields!" });

    const existingProjectWithPrefix = await Project.findOne({
      _id: { $ne: id },
      prefix: prefix,
      createdBy: adminId,
    });

    if (existingProjectWithPrefix) {
      return res
        .status(400)
        .json({ message: "Prefix already exists under your account!" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, createdBy: adminId },
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


module.exports = { addProject ,editProject};
