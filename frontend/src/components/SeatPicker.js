// components/SeatPicker.js
// Interactive grid where users click to select/deselect seats

import React from 'react';
import './SeatPicker.css';

// Generates seat labels: A1-A10, B1-B10 ... E1-E10 (5 rows × 10 = 50 seats)
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  return rows.map((row) => ({
    row,
    seats: Array.from({ length: 10 }, (_, i) => `${row}${i + 1}`),
  }));
};

const SeatPicker = ({ bookedSeats = [], selectedSeats = [], onSeatClick }) => {
  const rows = generateSeats();

  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat))   return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <div className="seat-picker">
      {/* Screen indicator */}
      <div className="screen">
        <div className="screen-line"></div>
        <span>SCREEN</span>
      </div>

      {/* Seat grid */}
      <div className="seat-grid">
        {rows.map(({ row, seats }) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {seats.map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <button
                    key={seat}
                    className={`seat seat-${status}`}
                    onClick={() => status !== 'booked' && onSeatClick(seat)}
                    disabled={status === 'booked'}
                    title={seat}
                  >
                    {/* Show seat number only on hover via CSS */}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat seat-available legend-box"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-selected legend-box"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat seat-booked legend-box"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
