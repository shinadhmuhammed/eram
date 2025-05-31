const express = require("express");
const {
  createBranch,
  getBranch,
} = require("../controllers/Branch/branchController");
const {
  getAllAdmin,
  addAdmin,
  editAdmin,
  disableAdmin,
  getAdminById,
} = require("../controllers/Admin/adminController");

const superadminroute = express.Router();

superadminroute.get("/branch", getBranch);
superadminroute.get("/admin", getAllAdmin);
superadminroute.get("/admin", getAdminById);

superadminroute.post("/branch", createBranch);
superadminroute.post("/admin", addAdmin);

superadminroute.patch("/admin", disableAdmin);

superadminroute.put("/admin", editAdmin);

module.exports = superadminroute;
