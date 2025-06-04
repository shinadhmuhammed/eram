const express = require("express");
const {  createWorkOrder, addPipeline, editWorkOrder, editPipeline, deletePipeline, getPipeline, getPipelineById} = require('../controllers/Admin/adminController');
const { login } = require("../controllers/Users/userController");
const authenticateToken = require("../middleware/jwtMiddleware");
const authorizeRoles = require("../middleware/authorizedRoles");

const adminroute = express.Router();


adminroute.get('/Pipeline',authenticateToken, authorizeRoles("admin"), getPipeline )
adminroute.get('/Pipeline/:piplineId',authenticateToken, authorizeRoles("admin"), getPipelineById )



adminroute.post('/WorkOrder',authenticateToken, authorizeRoles("admin"), createWorkOrder )
adminroute.post('/addPipeline',authenticateToken,authorizeRoles("admin"), addPipeline )


adminroute.put("/editPipeline/:pipelineId",authenticateToken,authorizeRoles("admin"), editPipeline)
adminroute.put("/editWorkOrder",authenticateToken,authorizeRoles("admin"), editWorkOrder)

adminroute.delete('/deletePipeline/:Id',authenticateToken,authorizeRoles("admin"), deletePipeline)

module.exports = adminroute;