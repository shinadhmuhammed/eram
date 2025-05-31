const Pipeline = require("../../models/pipelineModel");
const User = require("../../models/userModel");
const Workorder = require("../../models/workorderModel");
const bcrypt = require("bcrypt");

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
      workPlace,
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
    } = req.body;

    const newWorkorder = await Workorder.create({
      title,
      jobCode,
      workplace: workPlace,
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
    });

    res.status(201).json({
      message: "Work order created successfully",
      data: newWorkorder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error while creating work order" });
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

    return res
      .status(200)
      .json({ message: "Pipeline added succesfully..!", data: newPipeLine });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editAdmin = async (req, res) => {
  const { adminId } = req.params;
  const {
    firstName,
    lastName,
    fullName,
    email,
    phone,
    password,
    accountStatus,
  } = req.body;

  try {
    const adminUser = await User.findOne({ _id: adminId });

    if (firstName) adminUser.firstName = firstName;
    if (lastName) adminUser.lastName = lastName;
    if (fullName) adminUser.fullName = fullName;
    if (email) adminUser.email = email;
    if (phone) adminUser.phone = phone;
    if (password) adminUser.password = password;
    if (accountStatus) adminUser.accountStatus = accountStatus;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      adminUser.passwordHash = hashed;
    }
    await adminUser.save();

    return res.status(200).json({ message: "Admin updated successfully" ,data:adminUser});
  } catch (error) {
    console.error(error);
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

    adminUser.accountStatus = "inActive";
    await adminUser.save();

    return res.status(200).json({ message: "Admin marked as deleted",data:adminUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;

    const adminUser = await User.findOne({ _id: adminId});

    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ admin: adminUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  addAdmin,
  getAllAdmin,
  createWorkOrder,
  addPipeline,
  editAdmin,
  disableAdmin,
  getAdminById
};
