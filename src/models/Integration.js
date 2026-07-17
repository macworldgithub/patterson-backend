const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    status: {
        type: String,
        enum: ['connected', 'disconnected', 'error', 'pending'],
        default: 'disconnected'
    },
    lastSync: { type: Date },
    config: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Integration', integrationSchema);