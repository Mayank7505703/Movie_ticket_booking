// pages/HomePage.js
// Shows all available movies in a grid + hero banner + seed button

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage = () => {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  // Fetch all movies when page loads
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await api.get('/movies');
      setMovies(data);
    } catch (error) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  // Seed sample data (for demo)
  const handleSeed = async () => {
    try {
      toast.loading('Adding sample movies...');
      await api.post('/movies/seed');
      toast.dismiss();
      toast.success('Sample movies added!');
      fetchMovies();
    } catch {
      toast.dismiss();
      toast.error('Seeding failed');
    }
  };

  // Filter movies by search query
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page fade-in">
      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <p className="hero-eyebrow">NOW SHOWING</p>
          <h1 className="hero-title">Book Your<br /><span>Cinema Experience</span></h1>
          <p className="hero-sub">Choose from the latest blockbusters. Select your seats. Enjoy the show.</p>
        </div>
      </section>

      {/* ── Movies Section ── */}
      <section className="container movies-section">
        <div className="section-header">
          <h2>All Movies</h2>

          {/* Search input */}
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search by title or genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Seed button — only shown when no movies */}
        {movies.length === 0 && !loading && (
          <div className="empty-state">
            <p>No movies found in database.</p>
            <button className="btn btn-primary" onClick={handleSeed}>
              + Add Sample Movies
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {loading && <div className="spinner"></div>}

        {/* Movies Grid */}
        {!loading && (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {/* No results after search */}
        {!loading && filteredMovies.length === 0 && movies.length > 0 && (
          <p className="no-results">No movies match your search.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
