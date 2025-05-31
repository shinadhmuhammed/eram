const express = require("express");
const {
  createBranch,
  getBranch,
  editBranch,
} = require("../controllers/Branch/branchController");
const {
  getAllAdmin,
  addAdmin,
  editAdmin,
  disableAdmin,
  getAdminById,
} = require("../controllers/Admin/adminController");
const authenticateToken = require("../middleware/jwtMiddleware");

const superadminroute = express.Router();

superadminroute.get("/branch", getBranch);
superadminroute.get("/admin", getAllAdmin);
superadminroute.get("/adminId/:adminId", getAdminById);

superadminroute.post("/branch", createBranch);
superadminroute.post("/admin", addAdmin);

superadminroute.patch("/admin", disableAdmin);

superadminroute.put("/admin/:adminId", editAdmin);
superadminroute.put("/branch", editBranch );

module.exports = superadminroute;
