// pages/AdminDashboard.js
// Only visible to users with role === 'admin'
// Shows: stats cards + full bookings table

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all'); // all | confirmed | cancelled

  // Redirect non-admins away immediately
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Admin access only');
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings by search (user name / movie title) and status
  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      b.movie?.title.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || b.status === filter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="admin-page container fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-sub">All bookings across all users</p>
        </div>
        <span className="admin-badge">👑 Admin</span>
      </div>

      {/* ── Stats Cards ── */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🎟️</span>
            <div>
              <div className="stat-value">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card revenue">
            <span className="stat-icon">💰</span>
            <div>
              <div className="stat-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Registered Users</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎬</span>
            <div>
              <div className="stat-value">{stats.totalMovies}</div>
              <div className="stat-label">Active Movies</div>
            </div>
          </div>
          <div className="stat-card confirmed">
            <span className="stat-icon">✅</span>
            <div>
              <div className="stat-value">{stats.confirmed}</div>
              <div className="stat-label">Confirmed</div>
            </div>
          </div>
          <div className="stat-card cancelled">
            <span className="stat-icon">❌</span>
            <div>
              <div className="stat-value">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="admin-filters">
        <input
          className="search-input"
          placeholder="🔍 Search by user name, email or movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bookings Table ── */}
      <div className="table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Movie</th>
              <th>Show Time</th>
              <th>Seats</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">No bookings found</td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b._id} className={b.status === 'cancelled' ? 'row-cancelled' : ''}>
                  {/* User info */}
                  <td>
                    <div className="user-cell">
                      <span className="user-name">{b.user?.name || '—'}</span>
                      <span className="user-email">{b.user?.email || '—'}</span>
                    </div>
                  </td>

                  {/* Movie */}
                  <td>
                    <div className="movie-cell">
                      <img
                        src={b.movie?.posterUrl}
                        alt={b.movie?.title}
                        className="table-poster"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span>{b.movie?.title || '—'}</span>
                    </div>
                  </td>

                  <td>{b.showtime}</td>

                  {/* Seats */}
                  <td>
                    <div className="seats-cell">
                      {b.seats.map((s) => (
                        <span key={s} className="seat-chip">{s}</span>
                      ))}
                    </div>
                  </td>

                  <td className="center">{b.seats.length}</td>
                  <td className="amount">₹{b.totalAmount}</td>

                  {/* Date */}
                  <td>
                    {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>

                  {/* Status badge */}
                  <td>
                    <span className={`status-pill ${b.status}`}>
                      {b.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="results-count">
        Showing {filtered.length} of {bookings.length} bookings
      </p>
    </div>
  );
};

export default AdminDashboard;
