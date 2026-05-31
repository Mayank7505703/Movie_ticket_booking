// components/MovieCard.js
// Displays a single movie in the listing grid

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card card" onClick={() => navigate(`/movies/${movie._id}`)}>
      {/* Poster Image */}
      <div className="movie-poster">
        <img
          src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
        />
        {/* Rating Badge on top of poster */}
        <div className="movie-rating">
          ⭐ {movie.rating.toFixed(1)}
        </div>
      </div>

      {/* Movie Info */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="badge">{movie.genre}</span>
          <span className="movie-duration">🕐 {movie.duration}</span>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
