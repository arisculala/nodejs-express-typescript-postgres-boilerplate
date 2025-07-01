const express = require('express');
const user = require('./user');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.post('/login', user.login);
router.post('/admin-register', user.adminRegister);
router.post('/register', user.register);

router.post('/', auth, user.newUser);

router.get('/', auth, user.getUsers);
router.get('/:id', auth, user.getUser);

router.delete('/:id', auth, user.deleteUser);
router.post('/delete-many', auth, user.deleteUsers);

router.put('/:id/active', auth, user.setUserActiveStatus);

router.put('/edit/:id/general', auth, user.editUserGeneral);
router.put('/edit/:id/email', auth, user.editUserEmail);
router.put('/edit/:id/phone-number', auth, user.editUserPhoneNumber);

router.put('/:id/update-password', auth, user.updatePassword);

router.put('/:id/change-roles', auth, user.changeRoles);

module.exports = router;
