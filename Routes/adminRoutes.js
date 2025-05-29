const express = require("express");
const { createBranch,getBranch } = require('../controllers/Branch/branchController')

const adminroute = express.Router();


adminroute.get('/branch',getBranch)

adminroute.post('/branch',createBranch)



module.exports = router;