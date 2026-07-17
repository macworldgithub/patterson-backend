const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, ctrl.getDashboardStats);
router.get('/daily', protect, ctrl.getDailyMetrics);
router.get('/by-location', protect, ctrl.getLocationMetrics);
router.get('/by-brand', protect, ctrl.getBrandMetrics);
router.get('/funnel', protect, ctrl.getFunnelData);

module.exports = router;