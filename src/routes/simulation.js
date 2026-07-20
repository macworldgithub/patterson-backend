const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/simulationController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Simulation
 *   description: Simulation & Vetting Mode — test AI voice flows before live calls (Retell/Vapi integration point)
 */

/**
 * @swagger
 * /api/simulation/run:
 *   post:
 *     tags: [Simulation]
 *     summary: Run a simulated AI call scenario
 *     description: |
 *       Triggers a full end-to-end simulation using the script and customer context provided.
 *       Currently returns a mock result. Will be wired to Retell AI / Vapi.ai webhook in Phase 2.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SimulationRequest'
 *     responses:
 *       200:
 *         description: Simulation result with transcript and outcome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     simulationId:
 *                       type: string
 *                       example: sim-1719550800000
 *                     scenario:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: completed
 *                     transcript:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TranscriptSegment'
 *                     aiSummary:
 *                       type: string
 *                     outcome:
 *                       type: string
 *                     confidenceScore:
 *                       type: number
 */
router.post('/run', protect, ctrl.runSimulation);

/**
 * @swagger
 * /api/simulation/history:
 *   get:
 *     tags: [Simulation]
 *     summary: Get past simulation runs
 *     responses:
 *       200:
 *         description: Simulation history (empty until Retell/Vapi is connected)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items: {}
 *                 message:
 *                   type: string
 */
router.get('/history', protect, ctrl.getSimulationHistory);

module.exports = router;