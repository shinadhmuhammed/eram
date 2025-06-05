const express = require("express");
const {  createWorkOrder, addPipeline, editWorkOrder, editPipeline, deletePipeline, getPipeline, getPipelineById, editStage, deleteStage, adminBranches, getWorkorder} = require('../controllers/Admin/adminController');
const { login } = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const authorizeRoles = require("../middleware/authorizedRoles");
const { addRecruiter, getRecruiter, editRecruiter, disableRecruiter, deleteRecruiter, getRecruiterById } = require("../controllers/Recruiters/recruiterController");

const adminroute = express.Router();


adminroute.get('/Pipeline',authenticateToken, authorizeRoles("admin"), getPipeline )
adminroute.get('/recruiters',authenticateToken, authorizeRoles("admin"), getRecruiter )
adminroute.get('/recruiters/:id',authenticateToken, authorizeRoles("admin"), getRecruiterById )
adminroute.get('/Pipeline/:piplineId',authenticateToken, authorizeRoles("admin"), getPipelineById )
adminroute.get('/branches',authenticateToken, authorizeRoles("admin"), adminBranches )
adminroute.get('/workOrder',authenticateToken, authorizeRoles("admin"), getWorkorder )



adminroute.post('/WorkOrder',authenticateToken, authorizeRoles("admin"), createWorkOrder )
adminroute.post('/addPipeline',authenticateToken,authorizeRoles("admin"), addPipeline )
adminroute.post('/recruiters',authenticateToken,authorizeRoles("admin"), addRecruiter )


adminroute.put("/editPipeline/:pipelineId",authenticateToken,authorizeRoles("admin"), editPipeline)
adminroute.put("/editWorkOrder/:id",authenticateToken,authorizeRoles("admin"), editWorkOrder)
adminroute.put("/stagesEdit/:Id",authenticateToken,authorizeRoles("admin"), editStage)
adminroute.put("/recruiters/:Id",authenticateToken,authorizeRoles("admin"), editRecruiter)

adminroute.patch("/recruiters/:recruiterId",authenticateToken,authorizeRoles("admin"), disableRecruiter);


adminroute.delete('/deletePipeline/:Id',authenticateToken,authorizeRoles("admin"), deletePipeline)
adminroute.delete('/deleteStage/:Id',authenticateToken,authorizeRoles("admin"), deleteStage)
adminroute.delete('/recruiters/:Id',authenticateToken,authorizeRoles("admin"), deleteRecruiter)

module.exports = adminroute;