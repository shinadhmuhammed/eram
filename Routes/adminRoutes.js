const express = require("express");
const {  createWorkOrder, addPipeline, editWorkOrder} = require('../controllers/Admin/adminController')

const adminroute = express.Router();


adminroute.post('/WorkOrder',createWorkOrder )
adminroute.post('/addPipeline',addPipeline )

adminroute.put("/editWorkOrder",editWorkOrder)



module.exports = adminroute;