import React from 'react';
import '../styles/index.css';

const StationSelector = ({ stations, currentStation, onSelect }) => {
  return (
    <div className="station-selector">
      <label htmlFor="station-select" className="sr-only">Select MRT Station</label>
      <select
        id="station-select"
        value={currentStation}
        onChange={(e) => onSelect(e.target.value)}
        className="station-select-input"
      >
        <option value="">請選擇捷運站...</option>
        {stations.map((line) => (
          <optgroup key={line.id} label={line.name} style={{ color: line.color }}>
            {line.stations.map((station) => (
              <option key={station.id} value={station.id} style={{ color: '#000' }}>
                {station.id} - {station.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default StationSelector;

// Add specific styles for this component to index.css later or inline for now
const styles = `
.station-selector {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.station-select-input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 1.1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  color: var(--color-text-main);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.station-select-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
`;
