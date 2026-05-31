// controllers/authController.js
// Handles user registration and login

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: Generate JWT Token ──────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }       // Token valid for 7 days
  );
};

// ─── Register a new user ─────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (password gets hashed via pre-save hook in model)
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: 'Registration successful!',
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Login existing user ─────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get logged-in user's profile ────────────────────────────────────────────
// GET /api/auth/profile
const getProfile = async (req, res) => {
  res.json(req.user); // req.user is set by the protect middleware
};

module.exports = { register, login, getProfile };
