const express = require("express");
const recruiterroute = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const authorizeRoles = require("../middleware/authorizedRoles");
const { editJobpost, getAllRecruiterJobs } = require("../controllers/Recruiters/recruiterController");


recruiterroute.post('/recruiter/:Id',authenticateToken,authorizeRoles("recruiter"),getAllRecruiterJobs)

recruiterroute.put('/recruiter/:Id',authenticateToken,authorizeRoles("recruiter"),editJobpost)






module.exports = recruiterroute;