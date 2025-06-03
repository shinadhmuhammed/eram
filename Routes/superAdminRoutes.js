const express = require("express");
const {
  createBranch,
  getBranch,
  editBranch,
  deleteBranch,
  getBranchById,
} = require("../controllers/Branch/branchController");
const {
  getAllAdmin,
  addAdmin,
  editAdmin,
  disableAdmin,
  getAdminById,
} = require("../controllers/Admin/adminController");
const authenticateToken = require("../middleware/jwtMiddleware");
const { login, verifyAdminLoginOtp, requestUpdateProfile, verifyUpdateProfile } = require("../controllers/Users/userController");

const superadminroute = express.Router();

superadminroute.get("/branch", authenticateToken,getBranch);
superadminroute.get("/admin",authenticateToken, getAllAdmin);
superadminroute.get("/adminId/:adminId", authenticateToken,getAdminById);
superadminroute.get("/branch/:branchId", authenticateToken,getBranchById);

superadminroute.post("/branch",authenticateToken, createBranch);
superadminroute.post("/admin",authenticateToken, addAdmin);
superadminroute.post("/Login", login);
superadminroute.post("/adminLoginverify", verifyAdminLoginOtp);
superadminroute.post("/editProfile",authenticateToken, requestUpdateProfile);
superadminroute.post("/verifyEditProfile",authenticateToken, verifyUpdateProfile);


superadminroute.patch("/admin",authenticateToken, disableAdmin);

superadminroute.put("/admin/:adminId",authenticateToken, editAdmin);
superadminroute.put("/branch/:adminId",authenticateToken, editBranch);

superadminroute.delete("/branch/:branchId",authenticateToken, deleteBranch);

module.exports = superadminroute;
