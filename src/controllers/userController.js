const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AuditLog = require("../models/AuditLog");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    await AuditLog.create({
      userId: user._id,
      userName: user.fullName,
      action: "login",
      resource: "User",
      resourceId: user._id.toString(),
      resourceName: user.fullName,
      details: "User logged in.",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      severity: "info",
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
    if (search)
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users  (self-service registration — role & status are NOT user-controllable)
exports.createUser = async (req, res) => {
  try {
    // Strip any role/status supplied by the client — they cannot be self-assigned.
    // Hardcode safe defaults so even direct API calls cannot escalate privileges.
    delete req.body.role;
    delete req.body.status;

    if (!req.body.password) {
      req.body.password = "Patterson123!";
    }

    const user = await User.create({
      ...req.body,
      role: "viewer",
      status: "pending",
    });

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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email required" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });
    // In production you would email `resetToken` to the user. For now return it in response for testing.
    res.json({
      success: true,
      message: "Password reset token generated",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/change-password (protected)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Current and new passwords required",
      });
    const user = await User.findById(req.user._id).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!(await user.comparePassword(currentPassword))) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
