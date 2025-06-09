const express = require("express");
const {
  loginUser,
  getDashboardData,
  register,
  login,
  verifyOtp,
  resendOtp,
  verifyAdminLoginOtp,
} = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const { getBranch } = require("../controllers/Branch/branchController");
const router = express.Router();


router.get("/branch", getBranch);
router.post("/Register", register);
router.post("/verifyOtp", verifyOtp);
router.post("/Login", login);

router.post("/resend-otp", resendOtp);

module.exports = router;
