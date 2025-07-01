const express = require('express');
const router = express.Router();

const userRoute = require('./user/_routes');
const tenantRoute = require('./tenant/_routes');
const datasetRoute = require('./dataset/_routes');
const roleAccessRoute = require('./roleAccess/_routes');

//Api`s
router.use('/users', userRoute);
router.use('/tenants', tenantRoute);
router.use('/datasets', datasetRoute);
router.use('/role-access', roleAccessRoute);

module.exports = router;
