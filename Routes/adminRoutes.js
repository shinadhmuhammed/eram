const express = require("express");
const { createBranch,getBranch } = require('../controllers/Branch/branchController')
const { getAllAdmin,addAdmin, createWorkOrder, addPipeline, editAdmin, disableAdmin } = require('../controllers/Admin/adminController')

const adminroute = express.Router();


adminroute.get('/branch',getBranch)
adminroute.get('/admin',getAllAdmin)

adminroute.post('/branch',createBranch)
adminroute.post('/admin',addAdmin)
adminroute.post('/WorkFlow',createWorkOrder )
adminroute.post('/addPipeline',addPipeline )





module.exports = adminroute;