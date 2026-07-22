const mongoose = require('mongoose');

const transform = function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
};

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['booking', 'upgrade_alert', 'campaign_complete', 'error', 'info', 'warning', 'failure'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    actionUrl: { type: String },
    relatedId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform }
});

module.exports = mongoose.model('Notification', notificationSchema);