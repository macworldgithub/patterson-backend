const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Aggregated metrics for dashboards and reports
 */

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Top-level KPI totals for the main dashboard
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 */
router.get('/dashboard', protect, ctrl.getDashboardStats);

/**
 * @swagger
 * /api/analytics/daily:
 *   get:
 *     tags: [Analytics]
 *     summary: Daily call metrics grouped by date (for the line/bar chart)
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: How many days back to include
 *     responses:
 *       200:
 *         description: Array of daily metric objects
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Date string YYYY-MM-DD
 *                         example: '2026-06-22'
 *                       calls:
 *                         type: integer
 *                       answered:
 *                         type: integer
 *                       booked:
 *                         type: integer
 *                       converted:
 *                         type: integer
 */
router.get('/daily', protect, ctrl.getDailyMetrics);

/**
 * @swagger
 * /api/analytics/by-location:
 *   get:
 *     tags: [Analytics]
 *     summary: Call and conversion counts grouped by dealership location
 *     responses:
 *       200:
 *         description: Location metrics
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
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         example: Keysborough
 *                       calls:
 *                         type: integer
 *                       conversions:
 *                         type: integer
 */
router.get('/by-location', protect, ctrl.getLocationMetrics);

/**
 * @swagger
 * /api/analytics/by-brand:
 *   get:
 *     tags: [Analytics]
 *     summary: Campaign and revenue metrics grouped by brand
 *     responses:
 *       200:
 *         description: Brand metrics
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
 *                     type: object
 *                     properties:
 *                       brand:
 *                         type: string
 *                         example: Toyota
 *                       campaigns:
 *                         type: integer
 *                       totalContacts:
 *                         type: integer
 *                       conversions:
 *                         type: integer
 *                       revenue:
 *                         type: number
 */
router.get('/by-brand', protect, ctrl.getBrandMetrics);

/**
 * @swagger
 * /api/analytics/funnel:
 *   get:
 *     tags: [Analytics]
 *     summary: Conversion funnel — Total Contacts → Attempted → Answered → Booked → Converted
 *     responses:
 *       200:
 *         description: Funnel stages
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
 *                     $ref: '#/components/schemas/FunnelStage'
 */
router.get('/funnel', protect, ctrl.getFunnelData);

module.exports = router;