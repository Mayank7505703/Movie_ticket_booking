// routes/bookingRoutes.js

const express = require('express');
const router  = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require the user to be logged in
router.post('/',              protect, createBooking);
router.get('/my',             protect, getMyBookings);
router.put('/:id/cancel',     protect, cancelBooking);

module.exports = router;
