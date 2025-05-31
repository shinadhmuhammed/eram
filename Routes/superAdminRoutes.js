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
superadminroute.get("/admin/:adminId", getAdminById);

superadminroute.post("/branch", createBranch);
superadminroute.post("/admin", addAdmin);

superadminroute.patch("/admin/:adminId", disableAdmin);

superadminroute.put("/admin/:adminId", editAdmin);

module.exports = superadminroute;
