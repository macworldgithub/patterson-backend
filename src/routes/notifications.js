const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: In-app notification bell — bookings, alerts, errors
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notifications (max 50, newest first)
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *     responses:
 *       200:
 *         description: Notification list with unread count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 unreadCount:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/', protect, ctrl.getNotifications);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a notification (typically called internally by campaign/call processors)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created
 */
router.post('/', protect, ctrl.createNotification);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all unread notifications as read
 *     responses:
 *       200:
 *         description: All marked read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.patch('/mark-all-read', protect, ctrl.markAllRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a single notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked read
 *       404:
 *         description: Notification not found
 */
router.patch('/:id/read', protect, ctrl.markRead);

module.exports = router;