const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: [
        "service_reminder",
        "upgrade_offer",
        "reengagement",
        "finance_renewal",
        "parts_upsell",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "scheduled", "draft", "failed"],
      default: "draft",
    },
    brand: { type: String, required: true },
    location: { type: String, required: true },
    totalContacts: { type: Number, default: 0 },
    contactsAttempted: { type: Number, default: 0 },
    contactsReached: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    answerRate: { type: Number, default: 0 },
    startDate: { type: String },
    endDate: { type: String },
    scheduledTime: { type: String },
    maxAttempts: { type: Number, default: 3 },
    attemptsCompleted: { type: Number, default: 0 },
    revenueImpact: { type: Number, default: 0 },
    aiAgentName: { type: String, default: "Aria" },
    script: { type: String, default: "" },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id?.toString();
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id?.toString();
      },
    },
  },
);

module.exports = mongoose.model("Campaign", campaignSchema);
