// routes/adminRoutes.js
// All routes here require: logged in + admin role

const express = require('express');
const router  = express.Router();
const { getDashboardStats, getAllBookings, makeAdmin } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Apply both middlewares to every admin route
router.use(protect, adminOnly);

router.get('/stats',       getDashboardStats);
router.get('/bookings',    getAllBookings);
router.put('/make-admin',  makeAdmin);

module.exports = router;
