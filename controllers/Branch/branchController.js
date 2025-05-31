const Branch = require("../../models/branchModel");
const { upload } = require('../../utils/multer')

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
        home,
        about,
        services,
        contact,
      } = req.body;

      const brand_logo = req.file ? req.file.filename : null;

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


const editBranch = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { branchId } = req.params; 
      const {
        name,
        branchCode,
        isActive,
        location,
        description,
        home,
        about,
        services,
        contact,
      } = req.body;

      const branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      if (name) branch.name = name;
      if (branchCode) branch.branchCode = branchCode;
      if (typeof isActive !== "undefined") branch.isActive = isActive;
      if (location) branch.location = location;
      if (description) branch.description = description;

      if (req.file) {
        branch.brand_logo = req.file.filename; 
      }

      if (home) branch.home = home;
      if (about) branch.about = about;
      if (services) branch.services = services;
      if (contact) branch.contact = contact;

      await branch.save();

      return res.status(200).json({ message: "Branch updated successfully", data: branch });
    } catch (error) {
      console.error("Error editing branch:", error.message);
      return res.status(500).json({ message: "Server error while editing branch", error: error.message });
    }
  });
};


module.exports = {
  createBranch,
  getBranch,
  editBranch
};
