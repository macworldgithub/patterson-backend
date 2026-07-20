const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auditLogController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Immutable audit trail — admin and super_admin only
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     tags: [Audit Logs]
 *     summary: List audit log entries (paginated, admin+ only)
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [created, updated, deleted, viewed, exported, login, logout, permission_changed, campaign_started, campaign_paused]
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [info, warning, critical]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: resource
 *         schema:
 *           type: string
 *           example: Campaign
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Paginated audit log list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       403:
 *         description: Insufficient permissions
 */
router.get('/', protect, authorize('super_admin', 'admin'), ctrl.getAuditLogs);

module.exports = router;