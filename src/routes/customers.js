const express = require('express');
const router = express.Router();
const multer = require('multer');
const ctrl = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management, CSV import/export
 */

/**
 * @swagger
 * /api/customers/export:
 *   get:
 *     tags: [Customers]
 *     summary: Export all customers as a CSV file
 *     description: Downloads a CSV with fields — id, fullName, email, mobilePhone, suburb, make, model, year, nextServiceDue, status, upgradeScore, doNotCall
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/export', protect, ctrl.exportCustomers);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: List customers (paginated)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive, prospect, churned]
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *           example: Toyota
 *       - in: query
 *         name: doNotCall
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Searches fullName, email, mobilePhone, suburb
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated customer list
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
 *                     $ref: '#/components/schemas/Customer'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
router.get('/', protect, ctrl.getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a customer by ID (includes populated campaignHistory)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.get('/:id', protect, ctrl.getCustomerById);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     tags: [Customers]
 *     summary: Create a single customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerCreate'
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Validation error
 */
router.post('/', protect, ctrl.createCustomer);

/**
 * @swagger
 * /api/customers/import:
 *   post:
 *     tags: [Customers]
 *     summary: Bulk import customers from a CSV file
 *     description: |
 *       Upload a CSV file with the following headers (order matters):
 *       `firstName, lastName, fullName, email, phone, mobilePhone, suburb, state, postcode, brand, assignedDealership, upgradeScore, doNotCall, make, model, year, variant, vin, regPlate, odometer, lastServiceDate, nextServiceDue, financeEndDate, warrantyExpiry`
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: 48 customers imported
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       400:
 *         description: No file uploaded
 */
router.post('/import', protect, upload.single('file'), ctrl.importCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update a customer
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
 *             $ref: '#/components/schemas/CustomerCreate'
 *     responses:
 *       200:
 *         description: Updated customer
 *       404:
 *         description: Customer not found
 */
router.put('/:id', protect, ctrl.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete a customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', protect, ctrl.deleteCustomer);

module.exports = router;