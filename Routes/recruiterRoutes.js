const express = require("express");
const recruiterroute = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const authorizeRoles = require("../middleware/authorizedRoles");
const { editJobpost } = require("../controllers/Recruiters/recruiterController");


recruiterroute.put('/recruiter/:Id',authenticateToken,authorizeRoles("recruiter"),editJobpost)





module.exports = recruiterroute;