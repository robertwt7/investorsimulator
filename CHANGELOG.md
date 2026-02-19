# Changelog

All notable changes to the Investor Simulator project will be documented in this file.

## [2026-02-19] - Global Markets & Dividends (v0.3.0)

### Added
- **Multiple Exchanges:** Introduced NASDAQ, NYSE, LSE, and CRYPTO exchanges.
- **Market Progression:** Players now start with only NASDAQ unlocked. Other markets require purchasing licenses in-game.
- **Dividend System:** Added passive income mechanic for specific stocks.
- **UI Enhancements:** Exchange tabs, market lock overlays, and dividend indicators.

### Changed
- **State Management:** Updated `GameState` to track `unlockedExchanges` and `totalDividends`.
- **Simulation Engine:** Added dividend payout calculation to the game tick.

## [2026-02-19] - Visual Overhaul (v0.3.1)
...
## [2026-02-19] - Content Enrichment (v0.3.2)

### Added
- **Expanded Stock List:** Added 30+ diverse stocks across all exchanges, including major S&P 500 companies (NVDA, DIS, V, WMT, etc.) and more crypto assets (SOL, DOGE, XRP).
- **Sector Variety:** Improved representation of different sectors like Energy, Consumer Goods, and Healthcare.

## [2026-02-19] - Advanced Gameplay & Persistence (v0.2.0)

### Added
- **High Score System:** Persistent local storage for top 10 sessions, tracking net worth, return percentage, and duration.
- **Initial Setup Options:** Users can now choose their starting year (1980-2020) and initial capital ($1k - $100k).
- **Insider Tips:** A new "power-up" mechanic where users can pay $1,000 to see a 30-day forecast for a specific stock.
- **Historical Events:** Added a news system that triggers real-world headlines on specific historical dates (e.g., Black Monday, Dot-com peak).
- **System Message Log:** A retro-styled scrolling log to track trades, news, and system errors.
- **Storage Utility:** New `src/lib/storage.ts` for handling local storage persistence.

### Changed
- **AppState Management:** Updated `App.tsx` and `useGame.ts` to handle complex game setup and score recording.
- **Simulation Engine:** Exported `getHistoricalPrice` for use in the Tip system and added `checkEvents` for the news engine.
- **UI Layout:** Redesigned the main interface to include a side-bar message log and a more robust setup screen with tabs.

### Fixed
- JSX syntax errors in retro UI elements (escaped `>` symbols).
- TypeScript build errors related to unused imports and type-only imports.
