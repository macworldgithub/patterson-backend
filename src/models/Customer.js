const mongoose = require('mongoose');

const transform = function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
};

const vehicleSchema = new mongoose.Schema({
    make: { type: String },
    model: { type: String },
    year: { type: Number },
    variant: { type: String },
    color: { type: String },
    vin: { type: String },
    regPlate: { type: String },
    odometer: { type: Number, default: 0 },
    purchaseDate: { type: String },
    lastServiceDate: { type: String },
    nextServiceDue: { type: String },
    financeEndDate: { type: String },
    warrantyExpiry: { type: String }
}, { 
    _id: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform }
});

const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
    mobilePhone: { type: String },
    address: { type: String },
    suburb: { type: String },
    state: { type: String, default: 'VIC' },
    postcode: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive', 'prospect', 'churned'],
        default: 'active'
    },
    upgradeScore: { type: Number, min: 1, max: 5, default: 3 },
    vehicle: { type: vehicleSchema },
    previousVehicles: [vehicleSchema],
    assignedDealership: { type: String },
    brand: { type: String },
    totalSpend: { type: Number, default: 0 },
    lifetimeValue: { type: Number, default: 0 },
    campaignHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
    lastContactDate: { type: String },
    preferredContactTime: { type: String },
    notes: { type: String },
    doNotCall: { type: Boolean, default: false },
    tags: [{ type: String }],
    branch: { type: String }
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform }
});

// Auto-compute fullName before save
customerSchema.pre('save', function () {
    this.fullName = `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Customer', customerSchema);