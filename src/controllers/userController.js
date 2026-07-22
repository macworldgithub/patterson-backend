const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        await AuditLog.create({
            userId: user._id,
            userName: user.fullName,
            action: 'login',
            resource: 'User',
            resourceId: user._id.toString(),
            resourceName: user.fullName,
            details: 'User logged in.',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            severity: 'info'
        });
        const token = signToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ success: true, token, data: userObj });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const { role, status, search } = req.query;
        const filter = {};
        if (role) filter.role = role;
        if (status) filter.status = status;
        if (search) filter.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
        const users = await User.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/users
exports.createUser = async (req, res) => {
    try {
        if (!req.body.password) {
            req.body.password = 'Patterson123!';
        }
        const user = await User.create(req.body);
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ success: true, data: userObj });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        // Never update password via this route
        delete req.body.password;
        if (req.body.firstName || req.body.lastName) {
            const current = await User.findById(req.params.id);
            req.body.fullName = `${req.body.firstName || current.firstName} ${req.body.lastName || current.lastName}`;
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    res.json({ success: true, data: req.user });
};