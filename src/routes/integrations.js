const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/integrationController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Integrations
 *   description: Third-party integration status and config — Google Sheets, Retell AI, Slack, etc.
 */

/**
 * @swagger
 * /api/integrations:
 *   get:
 *     tags: [Integrations]
 *     summary: List all integrations and their current status
 *     responses:
 *       200:
 *         description: Integration list
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
 *                     $ref: '#/components/schemas/Integration'
 */
router.get('/', protect, ctrl.getIntegrations);

/**
 * @swagger
 * /api/integrations/{id}:
 *   put:
 *     tags: [Integrations]
 *     summary: Update integration status or config (e.g. reconnect Google Sheets, add Slack webhook URL)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [connected, disconnected, error, pending]
 *               config:
 *                 type: object
 *                 description: Provider-specific config (e.g. webhook URL, API key reference)
 *               lastSync:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Integration updated
 *       404:
 *         description: Integration not found
 */
router.put('/:id', protect, ctrl.updateIntegration);

module.exports = router;