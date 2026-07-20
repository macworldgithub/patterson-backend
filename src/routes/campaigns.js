const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Campaign management — create, read, update, delete, and status changes
 */

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     tags: [Campaigns]
 *     summary: List all campaigns
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, paused, completed, scheduled, draft, failed]
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *           example: Toyota
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: Keysborough
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [service_reminder, upgrade_offer, reengagement, finance_renewal, parts_upsell]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by campaign name
 *     responses:
 *       200:
 *         description: Array of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 6
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campaign'
 */
router.get('/', protect, ctrl.getCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get a single campaign by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campaign not found
 */
router.get('/:id', protect, ctrl.getCampaignById);

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     tags: [Campaigns]
 *     summary: Create a new campaign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CampaignCreate'
 *     responses:
 *       201:
 *         description: Campaign created. Also writes an audit log entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Validation error
 */
router.post('/', protect, ctrl.createCampaign);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     tags: [Campaigns]
 *     summary: Update all campaign fields
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
 *             $ref: '#/components/schemas/CampaignCreate'
 *     responses:
 *       200:
 *         description: Campaign updated
 *       404:
 *         description: Campaign not found
 */
router.put('/:id', protect, ctrl.updateCampaign);

/**
 * @swagger
 * /api/campaigns/{id}/status:
 *   patch:
 *     tags: [Campaigns]
 *     summary: Change campaign status only (e.g. pause, resume, complete)
 *     description: Use this instead of PUT when you only need to toggle the status. Writes the correct audit log action (campaign_started / campaign_paused).
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
 *             $ref: '#/components/schemas/CampaignStatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Campaign not found
 */
router.patch('/:id/status', protect, ctrl.updateCampaignStatus);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   delete:
 *     tags: [Campaigns]
 *     summary: Delete a campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Campaign not found
 */
router.delete('/:id', protect, ctrl.deleteCampaign);

module.exports = router;