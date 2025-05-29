const express = require("express");
const { createBranch,getBranch } = require('../controllers/Branch/branchController')
const { getAllAdmin,addAdmin } = require('../controllers/Admin/adminController')

const adminroute = express.Router();


adminroute.get('/branch',getBranch)
adminroute.get('/admin',getAllAdmin)

adminroute.post('/branch',createBranch)
adminroute.post('/admin',addAdmin)




module.exports = router;