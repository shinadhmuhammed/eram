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
const { login, verifyAdminLoginOtp, requestUpdateProfile, verifyUpdateProfile, logout } = require("../controllers/Users/userController");
const authorizeRoles = require("../middleware/authorizedRoles");

const superadminroute = express.Router();

superadminroute.get("/branch", authenticateToken,authorizeRoles("super_admin"), getBranch);
superadminroute.get("/admin",authenticateToken,authorizeRoles("super_admin"), getAllAdmin);
superadminroute.get("/adminId/:adminId", authenticateToken,authorizeRoles("super_admin","admin"),getAdminById);
superadminroute.get("/branch/:branchId", authenticateToken,authorizeRoles("super_admin","admin"),getBranchById);

superadminroute.post("/branch",authenticateToken,authorizeRoles("super_admin"), createBranch);
superadminroute.post("/admin",authenticateToken, authorizeRoles("super_admin"),addAdmin);
superadminroute.post("/Login", login);
superadminroute.post("/Logout",authenticateToken, logout);
superadminroute.post("/adminLoginverify", verifyAdminLoginOtp);
superadminroute.post("/editProfile",authenticateToken,authorizeRoles("super_admin"), requestUpdateProfile);
superadminroute.post("/verifyEditProfile",authenticateToken, authorizeRoles("super_admin"),verifyUpdateProfile);


superadminroute.patch("/admin",authenticateToken,authorizeRoles("super_admin"), disableAdmin);

superadminroute.put("/admin/:adminId",authenticateToken, authorizeRoles("super_admin"),editAdmin);
superadminroute.put("/branch/:id",authenticateToken, authorizeRoles("super_admin"),editBranch);

superadminroute.delete("/branch/:branchId",authenticateToken,authorizeRoles("super_admin"), deleteBranch);

module.exports = superadminroute;
