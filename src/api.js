const SHEETBEST_URL = 'https://api.sheetbest.com/sheets/f9100087-bd3f-4f03-b5f0-a8191dbdfcb0';

// Fetch all availability data from the Sheet.best API
export async function fetchAvailability() {
  const res = await fetch(SHEETBEST_URL);
  if (!res.ok) throw new Error('Failed to fetch availability');
  return res.json();
}

// Submit (add) a new availability entry to the Sheet.best API
export async function submitAvailability({ date, name, team, status }) {
  const res = await fetch(SHEETBEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Date: date,
      Name: name,
      Team: team,
      Status: status,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit availability');
  return res.json();
}