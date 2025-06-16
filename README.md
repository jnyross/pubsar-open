# Pubsar Open — Group Golf Availability App

Welcome to the Pubsar Open! This is a fun, friendly web app for planning your England 🏴 vs Ireland 🇮🇪 golf tournament.

## Features
- Calendar grid for June 20 – September 30, 2025
- Enter your name and pick your team (England 🏴 or Ireland 🇮🇪)
- Mark your availability for each day (🟩 Free, 🟦 Not free, but could move things, ❌ Not skippable)
- See who is available on each date (with team flags)
- "Best golf days" highlighted (where everyone is free)
- All data is live and shared via Google Sheets (Sheet.best API)
- Mobile and desktop friendly

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app locally:
   ```bash
   npm start
   ```
3. The app will open at http://localhost:3000

## Deployment
- Deploy to Vercel, Netlify, or your favorite static hosting provider.
- No backend/server needed — just your Sheet.best API.

## Configuration
- The Sheet.best API endpoint is set in the code (see `src/api.js`).
- To change the date range, update the calendar logic in `src/utils.js`.

## Have fun and may the best team win! 🍻⛳️🏴🇮🇪 