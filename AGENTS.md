This is a Vitejs app in TypeScript that creates an Investor Simulator game for the web.

## Current State (v0.4.0)
The app features a fully interactive market simulation with persistent state recovery, historical and random walk modes, global market progression, and an expanded list of 30+ mock stocks.

### Key Features
- **Session Persistence:** Browser refreshes no longer reset progress. The game automatically saves and restores state, including active trades and market date.
- **Expanded Asset List:** 30+ stocks across NASDAQ, NYSE, LSE, and CRYPTO, featuring major S&P 500 companies.
- **Visuals:** Highly polished Retro/CRT aesthetic with custom grid backgrounds and interactive 3D-style buttons.
- **Multi-Exchange:** Trade across NASDAQ, NYSE, LSE, and CRYPTO (unlocked via licenses).
- **Dividend System:** Passive income from blue-chip stocks.
- **Simulation:** Real historical price lookups for major tickers (MSFT, AAPL, etc.).
- **Interactive Shop:** Buy Insider Tips ($1k) or Trading Licenses to expand your empire.
- **Persistence:** LocalStorage-based Hall of Fame (High Scores).
- **News Engine:** Historical headlines triggered on specific dates.
- **Retro UI:** CRT effects, terminal-style Message Log, and ASCII-inspired layouts.

### Technical Stack
- **Framework:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom CRT Effects
- **Icons:** Lucide-React
- **Charts:** Recharts
- **State:** Custom `useGame` hook for simulation and trade management.