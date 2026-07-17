const Integration = require('../models/Integration');

exports.getIntegrations = async (req, res) => {
    try {
        const integrations = await Integration.find().sort({ name: 1 });
        res.json({ success: true, data: integrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateIntegration = async (req, res) => {
    try {
        const integration = await Integration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!integration) return res.status(404).json({ success: false, message: 'Integration not found' });
        res.json({ success: true, data: integration });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};