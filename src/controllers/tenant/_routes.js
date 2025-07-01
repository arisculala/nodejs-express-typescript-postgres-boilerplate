const express = require('express');
const tenant = require('./tenant');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/', auth, tenant.newTenant);
router.get('/', auth, tenant.getTenants);
router.get('/:id', auth, tenant.getTenant);
router.put('/:id', auth, tenant.updateTenant);
router.put('/:id/active', auth, tenant.setTenantActiveStatus);
router.get('/:id/users', auth, tenant.getTenantUsers);
router.post('/:id/users/add', auth, tenant.addTenantToUsers);
router.post('/:id/users/remove', auth, tenant.removeTenantFromUsers);
router.get('/:id/users/exclude', auth, tenant.getTenantExcludeUsers);

module.exports = router;
