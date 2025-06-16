import React, { useEffect, useState } from 'react';
import { fetchAvailability, submitAvailability } from './api';
import './App.css';

const TEAMS = [
  { name: 'England', emoji: '🏴' },
  { name: 'Ireland', emoji: '🇮🇪' },
];
const STATUSES = [
  { label: '✅ Yes', value: 'Yes' },
  { label: '❓ Maybe', value: 'Maybe' },
  { label: '❌ No', value: 'No' },
];

// Generate dates for the summer (June 1 to September 30)
function getGolfDates() {
  const start = new Date(new Date().getFullYear(), 5, 1); // June 1
  const end = new Date(new Date().getFullYear(), 8, 30); // Sept 30
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getDayLabel(date) {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function App() {
  const [name, setName] = useState('');
  const [team, setTeam] = useState(TEAMS[0].name);
  const [availability, setAvailability] = useState([]);
  const [myStatus, setMyStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const dates = getGolfDates();

  useEffect(() => {
    setLoading(true);
    fetchAvailability()
      .then(setAvailability)
      .catch(() => setError('Failed to load group availability'))
      .finally(() => setLoading(false));
  }, [submitting]);

  const handleStatus = async (date, status) => {
    if (!name) {
      setError('Please enter your name first!');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitAvailability({ date: formatDate(date), name, team, status });
      setMyStatus((prev) => ({ ...prev, [formatDate(date)]: status }));
    } catch {
      setError('Failed to submit availability');
    } finally {
      setSubmitting(false);
    }
  };

  // Group availability by date
  const groupByDate = {};
  for (const entry of availability) {
    if (!groupByDate[entry.Date]) groupByDate[entry.Date] = [];
    groupByDate[entry.Date].push(entry);
  }

  // Calculate best golf days (most Yes, least No)
  const bestGolfDays = Object.entries(groupByDate)
    .map(([date, entries]) => ({
      date,
      yes: entries.filter(e => e.Status === 'Yes').length,
      maybe: entries.filter(e => e.Status === 'Maybe').length,
      no: entries.filter(e => e.Status === 'No').length,
      people: entries,
    }))
    .sort((a, b) => b.yes - a.yes || b.maybe - a.maybe);
  const bestDates = new Set(bestGolfDays.slice(0, 5).map(d => d.date));

  return (
    <div className="App">
      <header className="header">
        <h1>🍻 Pubsar Open 2024 ⛳️</h1>
        <p>Group Golf Planner – mark your availability!</p>
      </header>
      <div className="user-bar">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />
        <select value={team} onChange={e => setTeam(e.target.value)}>
          {TEAMS.map(t => (
            <option key={t.name} value={t.name}>{t.emoji} {t.name}</option>
          ))}
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="calendar-grid">
        {dates.map(date => {
          const dateStr = formatDate(date);
          const entries = groupByDate[dateStr] || [];
          const isBest = bestDates.has(dateStr);
          return (
            <div key={dateStr} className={`date-cell${isBest ? ' best' : ''}`}>
              <div className="date-label">{getDayLabel(date)}</div>
              <div className="status-bar">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    className={`status-btn${myStatus[dateStr] === s.value ? ' selected' : ''}`}
                    onClick={() => handleStatus(date, s.value)}
                    disabled={submitting}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="people-list">
                {entries.map((e, i) => (
                  <span key={i} className={`person ${e.Team}`}>{e.Name} <span className="team-emoji">{TEAMS.find(t => t.name === e.Team)?.emoji}</span> <span className="status">{e.Status === 'Yes' ? '✅' : e.Status === 'Maybe' ? '❓' : '❌'}</span></span>
                ))}
              </div>
              {isBest && <div className="best-badge">🌟 Best Day!</div>}
            </div>
          );
        })}
      </div>
      <footer className="footer">
        <p>Made for the Pubsar Open. Cheers! 🍻</p>
      </footer>
    </div>
  );
}
