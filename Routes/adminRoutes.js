const express = require("express");
const {  createWorkOrder, addPipeline, editWorkOrder, editPipeline, deletePipeline, getPipeline, getPipelineById, editStage, deleteStage, adminBranches, getWorkorder, workorderPublish, getWorkorderById, disableWorkorder, addCandidate, bulkCandidate, deleteCandidate, disablePipeline, editCandidate} = require('../controllers/Admin/adminController');
const { login } = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const authorizeRoles = require("../middleware/authorizedRoles");
const { addRecruiter, getRecruiter, editRecruiter, disableRecruiter, deleteRecruiter, getRecruiterById } = require("../controllers/Recruiters/recruiterController");
const { addProject, editProject,deleteProject, getProject, getProjectById,disableProject, deleteWorkorder, getCandidate, getCandidateById } = require("../controllers/Project/projectController");

const adminroute = express.Router();


adminroute.get('/Pipeline',authenticateToken, authorizeRoles("admin"), getPipeline )
adminroute.get('/recruiters',authenticateToken, authorizeRoles("admin"), getRecruiter )
adminroute.get('/recruiters/:Id',authenticateToken, authorizeRoles("admin"), getRecruiterById )
adminroute.get('/Pipeline/:piplineId',authenticateToken, authorizeRoles("admin"), getPipelineById )
adminroute.get('/branches',authenticateToken, authorizeRoles("admin"), adminBranches )
adminroute.get('/workOrder',authenticateToken, authorizeRoles("admin"), getWorkorder )
adminroute.get('/workOrder/:Id',authenticateToken, authorizeRoles("admin"), getWorkorderById)
adminroute.get('/projects',authenticateToken,authorizeRoles("admin"), getProject)
adminroute.get('/project/:id',authenticateToken,authorizeRoles("admin"),getProjectById)
adminroute.get('/candidate',authenticateToken,authorizeRoles("admin"),getCandidate)
adminroute.get('/candidate/:Id',authenticateToken,authorizeRoles("admin"),getCandidateById)




adminroute.post('/WorkOrder',authenticateToken, authorizeRoles("admin"), createWorkOrder )
adminroute.post('/addPipeline',authenticateToken,authorizeRoles("admin"), addPipeline )
adminroute.post('/recruiters',authenticateToken,authorizeRoles("admin"), addRecruiter )
adminroute.post('/projects',authenticateToken,authorizeRoles("admin"), addProject )
adminroute.post('/candidate',authenticateToken,authorizeRoles("admin"), addCandidate )
adminroute.post('/Candidate/bulk',authenticateToken,authorizeRoles("admin"),  bulkCandidate )


adminroute.put("/editPipeline/:pipelineId",authenticateToken,authorizeRoles("admin"), editPipeline)
adminroute.put("/editWorkOrder/:id",authenticateToken,authorizeRoles("admin"), editWorkOrder)
adminroute.put("/stagesEdit/:Id",authenticateToken,authorizeRoles("admin"), editStage)
adminroute.put("/recruiters/:Id",authenticateToken,authorizeRoles("admin"), editRecruiter)
adminroute.put("/projects/:Id",authenticateToken,authorizeRoles("admin"), editProject)
adminroute.put("/candidate/:Id",authenticateToken,authorizeRoles("admin","recruiter"), editCandidate)

adminroute.patch("/recruiters/:recruiterId",authenticateToken,authorizeRoles("admin"), disableRecruiter);
adminroute.patch('/pipeline/:Id',authenticateToken,authorizeRoles("admin"), disablePipeline)
adminroute.patch("/project/:projectId",authenticateToken,authorizeRoles("admin"),disableProject)
adminroute.patch('/publish/:Id',authenticateToken,authorizeRoles("admin"), workorderPublish)
adminroute.patch('/workOrder/:Id',authenticateToken,authorizeRoles("admin"), disableWorkorder)



adminroute.delete('/deletePipeline/:Id',authenticateToken,authorizeRoles("admin"), deletePipeline)
adminroute.delete('/deleteStage/:Id',authenticateToken,authorizeRoles("admin"), deleteStage)
adminroute.delete('/recruiters/:Id',authenticateToken,authorizeRoles("admin"), deleteRecruiter)
adminroute.delete('/project/:id',authenticateToken,authorizeRoles("admin"),deleteProject)
adminroute.delete('/workOrder/:Id',authenticateToken,authorizeRoles("admin"),deleteWorkorder)
adminroute.delete('/candidate/:Id',authenticateToken,authorizeRoles("admin"),deleteCandidate)

module.exports = adminroute;