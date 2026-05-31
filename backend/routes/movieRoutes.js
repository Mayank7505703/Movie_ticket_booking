// routes/movieRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getAllMovies, getMovieById, createMovie,
  updateMovie, deleteMovie, seedMovies,
} = require('../controllers/movieController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',          getAllMovies);                         // Public
router.get('/:id',       getMovieById);                        // Public
router.post('/seed',     seedMovies);                          // Public (demo only)
router.post('/',         protect, adminOnly, createMovie);     // Admin only
router.put('/:id',       protect, adminOnly, updateMovie);     // Admin only
router.delete('/:id',    protect, adminOnly, deleteMovie);     // Admin only

module.exports = router;
