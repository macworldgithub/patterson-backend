const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.getMe);
router.get('/', protect, authorize('super_admin', 'admin'), ctrl.getUsers);
router.post('/', protect, authorize('super_admin', 'admin'), ctrl.createUser);
router.put('/:id', protect, ctrl.updateUser);
router.delete('/:id', protect, authorize('super_admin'), ctrl.deleteUser);

module.exports = router;