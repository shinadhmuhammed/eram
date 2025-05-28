const express = require("express");
const {
  loginUser,
  getDashboardData,
  register,
  login,
} = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const router = express.Router();

router.get("/getDashboardData", authenticateToken, getDashboardData);


router.post("/Register", register);
router.post("/Login", login);

module.exports = router;
