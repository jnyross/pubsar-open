// src/utils.js

// Generate all dates between start and end (inclusive)
export function getDateRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export const STATUS_EMOJI = {
  'Free': '🟩',
  'Not free, but could move things': '🟦',
  'Not skippable': '❌',
};

export const TEAM_EMOJI = {
  'England': '🏴',
  'Ireland': '🇮🇪',
}; 