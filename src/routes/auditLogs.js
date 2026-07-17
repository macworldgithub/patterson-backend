const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auditLogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('super_admin', 'admin'), ctrl.getAuditLogs);

module.exports = router;