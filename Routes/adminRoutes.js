const express = require("express");
const {  createWorkOrder, addPipeline, editWorkOrder} = require('../controllers/Admin/adminController');
const { login } = require("../controllers/Users/userController");

const adminroute = express.Router();

adminroute.post("/Login", login);
adminroute.post('/WorkOrder',createWorkOrder )
adminroute.post('/addPipeline',addPipeline )

adminroute.put("/editWorkOrder",editWorkOrder)



module.exports = adminroute;