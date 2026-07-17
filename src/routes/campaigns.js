const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

router.get('/', protect, ctrl.getCampaigns);
router.get('/:id', protect, ctrl.getCampaignById);
router.post('/', protect, ctrl.createCampaign);
router.put('/:id', protect, ctrl.updateCampaign);
router.patch('/:id/status', protect, ctrl.updateCampaignStatus);
router.delete('/:id', protect, ctrl.deleteCampaign);

module.exports = router;