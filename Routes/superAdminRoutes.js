const express = require("express");
const { createBranch,getBranch } = require('../controllers/Branch/branchController')
const { getAllAdmin,addAdmin } = require('../controllers/Admin/adminController')

const superadminroute = express.Router();

superadminroute.get('/branch',getBranch)
superadminroute.get('/admin',getAllAdmin)

superadminroute.post('/branch',createBranch)
superadminroute.post('/admin',addAdmin)

module.exports = superadminroute;