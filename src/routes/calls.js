const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/callController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, ctrl.getCallStats);
router.get('/', protect, ctrl.getCalls);
router.get('/:id', protect, ctrl.getCallById);
router.post('/', protect, ctrl.createCall);
router.put('/:id', protect, ctrl.updateCall);

module.exports = router;