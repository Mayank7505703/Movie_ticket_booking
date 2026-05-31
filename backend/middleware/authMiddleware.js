// middleware/authMiddleware.js
// Protects routes — only logged-in users with valid JWT can access them

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token part

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify it

      // Attach user info to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Only admin users can access certain routes (like adding movies)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, adminOnly };
