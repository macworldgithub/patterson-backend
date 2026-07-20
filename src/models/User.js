const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const permissionSchema = new mongoose.Schema({
    resource: {
        type: String,
        enum: ['campaigns', 'customers', 'calls', 'analytics', 'users', 'roles', 'audit_logs', 'settings', 'integrations', 'simulation']
    },
    actions: [{
        type: String,
        enum: ['view', 'create', 'edit', 'delete', 'export']
    }]
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'manager', 'agent', 'viewer', 'finance'],
        default: 'viewer'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'suspended'],
        default: 'active'
    },
    avatar: { type: String },
    dealership: { type: String },
    brand: { type: String },
    lastLogin: { type: Date },
    permissions: [permissionSchema],
    activityCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function () {
    this.fullName = `${this.firstName} ${this.lastName}`;
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);