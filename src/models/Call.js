const mongoose = require('mongoose');

const transcriptSegmentSchema = new mongoose.Schema({
    speaker: { type: String, enum: ['agent', 'customer'] },
    speakerName: { type: String },
    text: { type: String },
    timestamp: { type: Number },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    confidence: { type: Number }
}, { _id: true });

const callSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String },
    customerPhone: { type: String },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    campaignName: { type: String },
    direction: { type: String, enum: ['outbound', 'inbound'], default: 'outbound' },
    outcome: {
        type: String,
        enum: ['booked', 'not_interested', 'callback_requested', 'no_answer', 'voicemail', 'wrong_number', 'busy', 'converted'],
    },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    duration: { type: Number, default: 0 }, // seconds
    startTime: { type: Date },
    endTime: { type: Date },
    recording: {
        url: { type: String },
        duration: { type: Number },
        fileSize: { type: Number }
    },
    transcript: [transcriptSegmentSchema],
    aiSummary: { type: String },
    keyExtractions: {
        bookingDate: { type: String },
        bookingTime: { type: String },
        vehicleInterest: { type: String },
        objections: [{ type: String }],
        nextSteps: [{ type: String }],
        dealValue: { type: Number }
    },
    confidenceScore: { type: Number, default: 0 },
    agentName: { type: String },
    dealershipLocation: { type: String },
    brand: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Call', callSchema);