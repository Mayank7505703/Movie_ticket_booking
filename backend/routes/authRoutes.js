// routes/authRoutes.js

const express = require('express');
const router  = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);           // Public
router.post('/login',    login);              // Public
router.get('/profile',   protect, getProfile); // Private (needs JWT)

module.exports = router;
