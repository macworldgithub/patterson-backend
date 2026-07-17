const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/integrationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getIntegrations);
router.put('/:id', protect, ctrl.updateIntegration);

module.exports = router;