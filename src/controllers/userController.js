const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AuditLog = require("../models/AuditLog");
const { sendPasswordResetEmail } = require("../services/emailService");

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

// POST /api/users  (self-service registration)
exports.createUser = async (req, res) => {
  try {
    // Always assign admin role and active status regardless of what client sends
    delete req.body.role;
    delete req.body.status;

    if (!req.body.password) {
      req.body.password = "Patterson123!";
    }

    const user = await User.create({
      ...req.body,
      role: "admin",
      status: "active",
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

    // Always respond with 200 to prevent user enumeration
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.json({
        success: true,
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    // Generate a secure random token and hash it before storing
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Derive the frontend base URL dynamically from the request origin so this
    // works for both local dev (localhost:3000) and the Vercel deployment,
    // with the env var as a fallback for non-browser clients (e.g. curl).
    const frontendOrigin =
      req.headers.origin ||
      req.headers.referer?.replace(/\/(api\/.+)?$/, "") ||
      process.env.FRONTEND_URL ||
      "http://localhost:3000";

    // Send the email (plain token — not the hash)
    try {
      await sendPasswordResetEmail(user.email, resetToken, frontendOrigin);
    } catch (emailErr) {
      // Roll back token so the user can try again
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error("[Email] Failed to send reset email:", emailErr.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
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

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword)
      return res.status(400).json({
        success: false,
        message: "Token, email, and new password are required",
      });

    // Hash the incoming plain token to compare against stored hash
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new one.",
      });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
