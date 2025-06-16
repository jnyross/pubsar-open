import React, { useEffect, useState } from 'react';
import { fetchAvailability, submitAvailability } from './api';
import './App.css';

const TEAMS = [
  { name: 'England', emoji: '🏴' },
  { name: 'Ireland', emoji: '🇮🇪' },
];
const STATUSES = [
  { label: '✅ Yes', value: 'Yes', color: '#43a047' },
  { label: '🟦 Yes, but not ideal', value: 'Yes, but not ideal', color: '#fbc02d' },
  { label: '❌ No', value: 'No', color: '#e53935' },
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
  const [team, setTeam] = useState('');
  const [availability, setAvailability] = useState([]);
  const [myStatus, setMyStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

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
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
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

  // Calculate potential golf dates
  const allPeople = Array.from(new Set(availability.map(e => e.Name)));
  const potentialDatesYes = dates.filter(date => {
    const dateStr = formatDate(date);
    const entries = groupByDate[dateStr] || [];
    if (entries.length === 0) return false;
    // Only show if everyone is 'Yes'
    return allPeople.length > 0 && entries.length === allPeople.length && entries.every(e => e.Status === 'Yes');
  });
  const potentialDatesYesOrIdeal = dates.filter(date => {
    const dateStr = formatDate(date);
    const entries = groupByDate[dateStr] || [];
    if (entries.length === 0) return false;
    // Only show if everyone is 'Yes' or 'Yes, but not ideal' (no 'No')
    return allPeople.length > 0 && entries.length === allPeople.length && entries.every(e => e.Status === 'Yes' || e.Status === 'Yes, but not ideal');
  });
  const showYesOnly = potentialDatesYes.length > 0;
  const potentialDates = showYesOnly ? potentialDatesYes : potentialDatesYesOrIdeal;

  // Onboarding step
  if (!name || !team) {
    return (
      <div className="augusta-bg">
        <div className="augusta-card">
          <header className="augusta-header">
            <div className="augusta-laurel">🏆</div>
            <h1>Pubsar Open 2025</h1>
            <h2 className="augusta-sub">Welcome to the Entry Form</h2>
            <p className="augusta-tagline">An Invitational in the Spirit of Augusta National</p>
          </header>
          <div className="onboarding-form">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
      <div className="onboarding">
        <header className="header">
          <h1>🍻 Pubsar Open 2025 ⛳️</h1>
          <p className="tagline">Plan your group golf days!<br/>Enter your name and pick your team to get started.</p>
        </header>
        <div className="onboarding-form">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <div className="team-select">
            {TEAMS.map(t => (
              <button
                key={t.name}
                className={team === t.name ? 'selected' : ''}
                onClick={() => setTeam(t.name)}
                type="button"
              >
                <span className="team-emoji">{t.emoji}</span> {t.name}
              </button>
            ))}
          </div>
          <button
            className="continue-btn"
            disabled={!name || !team}
            onClick={() => {}}
            style={{marginTop: '1.5rem'}}
          >
            Continue
          </button>
        </div>
        <div className="legend">
          <strong>Legend:</strong>
          <span><span className="legend-dot yes"></span> Yes</span>
          <span><span className="legend-dot maybe"></span> Yes, but not ideal</span>
          <span><span className="legend-dot no"></span> No</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>🍻 Pubsar Open 2025 ⛳️</h1>
        <div className="user-summary">
          <span><b>{name}</b> ({team})</span>
          <button className="edit-user" onClick={() => { setName(''); setTeam(''); }}>Change</button>
        </div>
        <div className="instructions">
          <b>Instructions:</b> Click a date and select your availability. Your status will be saved instantly.
        </div>
      </header>
      {showToast && <div className="toast">Availability saved!</div>}
      {error && <div className="error">{error}</div>}
      <div className="potential-dates-summary">
        <h2>📅 Potential Dates</h2>
        {potentialDates.length === 0 ? (
          <div>No potential dates found.</div>
        ) : (
          <ul>
            {potentialDates.map(date => {
              const dateStr = formatDate(date);
              const entries = groupByDate[dateStr] || [];
              return (
                <li key={dateStr}><b>{getDayLabel(date)}</b>: {entries.map(e => `${e.Name} (${e.Status})`).join(', ')}</li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="legend">
        <strong>Legend:</strong>
        <span><span className="legend-dot yes"></span> Yes</span>
        <span><span className="legend-dot maybe"></span> Yes, but not ideal</span>
        <span><span className="legend-dot no"></span> No</span>
      </div>
      <div className="calendar-grid">
        {dates.map(date => {
          const dateStr = formatDate(date);
          const entries = groupByDate[dateStr] || [];
          return (
            <div key={dateStr} className={`cal-cell`}>
              <div className="cal-date">{getDayLabel(date)}</div>
              <div className="status-btns">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    className={`status-btn${myStatus[dateStr] === s.value ? ' selected' : ''}`}
                    style={{ background: myStatus[dateStr] === s.value ? s.color : '#f7f7f7', borderColor: s.color, color: myStatus[dateStr] === s.value ? '#fff' : '#222' }}
                    onClick={() => handleStatus(date, s.value)}
                    disabled={submitting}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="group-list">
                {entries.length > 0 ? (
                  <div className="group-names">
                    {entries.map((e, i) => (
                      <span key={i} className={`person ${e.Team}`}>{e.Name} <span className="team-emoji">{TEAMS.find(t => t.name === e.Team)?.emoji}</span> <span className="status">{e.Status === 'Yes' ? '✅' : e.Status === 'Yes, but not ideal' ? '🟦' : '❌'}</span></span>
                    ))}
                  </div>
                ) : <span className="no-entries">No responses yet</span>}
              </div>
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
