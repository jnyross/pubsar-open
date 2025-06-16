# Pubsar Open — Group Golf Availability App

Welcome to the Pubsar Open! England 🏴 vs Ireland 🇮🇪 — The world's most social golf tournament 🍻⛳️

## Features
- Calendar grid for all days from June 20, 2025 to September 30, 2025
- Each user enters their name and selects their team (🏴 England or 🇮🇪 Ireland)
- Click any date to set your status: 🟩 Free, 🟦 Not free, but could move things, ❌ Not skippable
- Instantly see who is available on each date (with team flags)
- "Best golf days" highlighted with 🍺🏴🇮🇪
- Mobile and desktop friendly
- All data stored in a Google Sheet via Sheet.best API

## Setup
1. Clone or copy this folder to your computer.
2. In the folder, run:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the project with this line:
   ```
   REACT_APP_SHEETBEST_URL=https://api.sheetbest.com/sheets/f9100087-bd3f-4f03-b5f0-a8191dbdfcb0
   ```
4. Start the app locally:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
- Deploy to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) for free.
- Set the environment variable `REACT_APP_SHEETBEST_URL` in your deployment settings.

## How to Use
1. Enter your name and pick your team (🏴 or 🇮🇪).
2. See the calendar grid.
3. Click any date to set your status.
4. See who is available on each date (with team flags).
5. "Best golf days" are highlighted at the top.

## Privacy
- Only your name, team, and availability are stored.
- No passwords or sensitive info.
- No one can delete or change another person's answers.

## Improvements
- Add notifications, more status options, or admin features as needed.

---

Pubsar Open — Where golf meets the pub, and England meets Ireland! 🍻🏴🇮🇪 