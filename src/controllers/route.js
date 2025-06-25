const express = require('express');
const router = express.Router();

const userRoute = require('./user/_routes');
const roleAccessRoute = require('./roleAccess/_routes');

//Api`s
router.use('/users', userRoute);
router.use('/role-access', roleAccessRoute);

module.exports = router;
