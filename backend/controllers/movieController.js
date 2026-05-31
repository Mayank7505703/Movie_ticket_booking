// controllers/movieController.js
// All movie-related operations (CRUD)

const Movie = require('../models/Movie');

// ─── GET all active movies ────────────────────────────────────────────────────
// GET /api/movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
};

// ─── GET a single movie by ID ─────────────────────────────────────────────────
// GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error: error.message });
  }
};

// ─── CREATE a new movie (Admin only) ─────────────────────────────────────────
// POST /api/movies
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ message: 'Movie added successfully!', movie });
  } catch (error) {
    res.status(400).json({ message: 'Error creating movie', error: error.message });
  }
};

// ─── UPDATE a movie (Admin only) ─────────────────────────────────────────────
// PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie updated!', movie });
  } catch (error) {
    res.status(400).json({ message: 'Error updating movie', error: error.message });
  }
};

// ─── DELETE a movie (Admin only) ─────────────────────────────────────────────
// DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
};

// ─── Seed sample movies ───────────────────────────────────────────────────────
// POST /api/movies/seed  (for demo purposes)
const seedMovies = async (req, res) => {
  try {
    await Movie.deleteMany({});
    const sampleMovies = [
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genre: 'Sci-Fi',
        duration: '2h 49m',
        language: 'English',
        rating: 8.6,
        posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        releaseDate: new Date('2014-11-07'),
        showtimes: [
          { time: '10:00 AM', totalSeats: 50, bookedSeats: [] },
          { time: '2:00 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '7:00 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc on Gotham City, Batman must accept one of the greatest tests.',
        genre: 'Action',
        duration: '2h 32m',
        language: 'English',
        rating: 9.0,
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        releaseDate: new Date('2008-07-18'),
        showtimes: [
          { time: '11:00 AM', totalSeats: 50, bookedSeats: [] },
          { time: '3:30 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '8:00 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
        genre: 'Thriller',
        duration: '2h 28m',
        language: 'English',
        rating: 8.8,
        posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        releaseDate: new Date('2010-07-16'),
        showtimes: [
          { time: '12:00 PM', totalSeats: 50, bookedSeats: [] },
          { time: '4:00 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '9:00 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the planet of Pandora.',
        genre: 'Adventure',
        duration: '3h 12m',
        language: 'English',
        rating: 7.6,
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        releaseDate: new Date('2022-12-16'),
        showtimes: [
          { time: '10:30 AM', totalSeats: 50, bookedSeats: [] },
          { time: '2:30 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '7:30 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        genre: 'Drama',
        duration: '3h 0m',
        language: 'English',
        rating: 8.9,
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        releaseDate: new Date('2023-07-21'),
        showtimes: [
          { time: '11:30 AM', totalSeats: 50, bookedSeats: [] },
          { time: '3:00 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '8:30 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
      {
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes arrive.',
        genre: 'Action',
        duration: '2h 28m',
        language: 'English',
        rating: 8.2,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        releaseDate: new Date('2021-12-17'),
        showtimes: [
          { time: '9:30 AM',  totalSeats: 50, bookedSeats: [] },
          { time: '1:00 PM',  totalSeats: 50, bookedSeats: [] },
          { time: '6:00 PM',  totalSeats: 50, bookedSeats: [] },
        ],
      },
    ];

    await Movie.insertMany(sampleMovies);
    res.json({ message: '✅ Sample movies seeded successfully!', count: sampleMovies.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding movies', error: error.message });
  }
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie, seedMovies };
