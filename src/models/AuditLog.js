const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    userAvatar: { type: String },
    action: {
        type: String,
        enum: ['created', 'updated', 'deleted', 'viewed', 'exported', 'login', 'logout', 'permission_changed', 'campaign_started', 'campaign_paused'],
        required: true
    },
    resource: { type: String },
    resourceId: { type: String },
    resourceName: { type: String },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);