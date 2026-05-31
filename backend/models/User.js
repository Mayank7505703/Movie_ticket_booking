// models/User.js - Defines the User schema for MongoDB

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',         // Regular users by default
    },
  },
  { timestamps: true }          // Adds createdAt & updatedAt automatically
);

// ─── Hash password before saving ─────────────────────────────────────────────
// This middleware runs before every .save() call
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password unchanged
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method to compare entered password with hashed one ──────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
