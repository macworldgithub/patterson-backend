const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/callController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Calls
 *   description: Call records — transcripts, outcomes, AI summaries
 */

/**
 * @swagger
 * /api/calls/stats:
 *   get:
 *     tags: [Calls]
 *     summary: Aggregate call statistics for the dashboard summary bar
 *     responses:
 *       200:
 *         description: Call stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CallStats'
 */
router.get('/stats', protect, ctrl.getCallStats);

/**
 * @swagger
 * /api/calls:
 *   get:
 *     tags: [Calls]
 *     summary: List call records (paginated)
 *     parameters:
 *       - in: query
 *         name: outcome
 *         schema:
 *           type: string
 *           enum: [all, booked, not_interested, callback_requested, no_answer, voicemail, wrong_number, busy, converted]
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: campaignId
 *         schema:
 *           type: string
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by customerName or campaignName
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated call list
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
 *                     $ref: '#/components/schemas/Call'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', protect, ctrl.getCalls);

/**
 * @swagger
 * /api/calls/{id}:
 *   get:
 *     tags: [Calls]
 *     summary: Get a single call with full transcript and populated customer/campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full call detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Call'
 *       404:
 *         description: Call not found
 */
router.get('/:id', protect, ctrl.getCallById);

/**
 * @swagger
 * /api/calls:
 *   post:
 *     tags: [Calls]
 *     summary: Create a call record (typically called by the voice AI webhook after a call completes)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Call'
 *     responses:
 *       201:
 *         description: Call record created
 *       400:
 *         description: Validation error
 */
router.post('/', protect, ctrl.createCall);

/**
 * @swagger
 * /api/calls/{id}:
 *   put:
 *     tags: [Calls]
 *     summary: Update a call record (e.g. add AI summary after post-processing)
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
 *             $ref: '#/components/schemas/Call'
 *     responses:
 *       200:
 *         description: Call updated
 *       404:
 *         description: Call not found
 */
router.put('/:id', protect, ctrl.updateCall);

module.exports = router;