const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
    try {
        const { action, severity, userId, resource, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (action) filter.action = action;
        if (severity) filter.severity = severity;
        if (userId) filter.userId = userId;
        if (resource) filter.resource = resource;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            AuditLog.countDocuments(filter)
        ]);
        res.json({ success: true, data: logs, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};