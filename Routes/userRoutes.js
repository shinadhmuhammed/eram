const express = require("express");
const {
  loginUser,
  getDashboardData,
  register,
  login,
  verifyOtp,
  resendOtp,
  verifyAdminLoginOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const { getBranch } = require("../controllers/Branch/branchController");
const router = express.Router();

router.get("/branch", getBranch);



router.post("/Register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/Login", login);
router.post("/resend-otp", resendOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyForgotOtp", verifyForgotPasswordOtp);
router.post("/resetPassword", resetPassword);


module.exports = router;
