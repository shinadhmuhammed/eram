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
        !description ||
        !home ||
        !about ||
        !services ||
        !contact
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
        home: {
          title: home.title || "",
          bannerImage: home.bannerImage || "",
          herosectionOne: home.herosectionOne || "",
        },
        about: {
          title: about.title || "",
          description: about.description || "",
        },
        services: services || [],
        contact: {
          email: contact.email || "",
          phone: contact.phone || "",
        },
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

module.exports = {
  createBranch,
  getBranch,
};
