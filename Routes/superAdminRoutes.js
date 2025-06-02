const express = require("express");
const {
  createBranch,
  getBranch,
  editBranch,
  deleteBranch,
} = require("../controllers/Branch/branchController");
const {
  getAllAdmin,
  addAdmin,
  editAdmin,
  disableAdmin,
  getAdminById,
} = require("../controllers/Admin/adminController");
const authenticateToken = require("../middleware/jwtMiddleware");
const { login, verifyAdminLoginOtp } = require("../controllers/Users/userController");

const superadminroute = express.Router();

superadminroute.get("/branch", getBranch);
superadminroute.get("/admin", getAllAdmin);
superadminroute.get("/adminId/:adminId", getAdminById);

superadminroute.post("/branch", createBranch);
superadminroute.post("/admin", addAdmin);
superadminroute.post("/Login", login);
superadminroute.post("/adminLoginverify", verifyAdminLoginOtp);

superadminroute.patch("/admin", disableAdmin);

superadminroute.put("/admin/:adminId", editAdmin);
superadminroute.put("/branch", editBranch);

superadminroute.delete("/branch/:branchId", deleteBranch);

module.exports = superadminroute;
