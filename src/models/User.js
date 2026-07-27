const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
    avatar: { type: String },
    branch: { type: String },
    lastLogin: { type: Date },
    activityCount: { type: Number, default: 0 },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform },
    toObject: { virtuals: true, transform },
  },
);

userSchema.pre("save", async function () {
  this.fullName = `${this.firstName} ${this.lastName}`;
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
