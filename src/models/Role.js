const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    resource: { type: String },
    actions: [{ type: String }]
}, { _id: false });

const transform = function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
};

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    userCount: { type: Number, default: 0 },
    permissions: [permissionSchema],
    isSystemRole: { type: Boolean, default: false }
}, { 
    timestamps: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform }
});

module.exports = mongoose.model('Role', roleSchema);