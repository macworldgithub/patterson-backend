const mongoose = require('mongoose');

const transform = function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
};

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
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform }
});

module.exports = mongoose.model('Integration', integrationSchema);