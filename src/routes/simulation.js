const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

router.post('/run', protect, ctrl.runSimulation);
router.get('/history', protect, ctrl.getSimulationHistory);

module.exports = router;