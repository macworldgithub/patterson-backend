const express = require('express');
const router = express.Router();
const multer = require('multer');
const ctrl = require('../controllers/customerController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/export', protect, ctrl.exportCustomers);
router.get('/', protect, ctrl.getCustomers);
router.get('/:id', protect, ctrl.getCustomerById);
router.post('/', protect, ctrl.createCustomer);
router.post('/import', protect, upload.single('file'), ctrl.importCustomers);
router.put('/:id', protect, ctrl.updateCustomer);
router.delete('/:id', protect, ctrl.deleteCustomer);

module.exports = router;