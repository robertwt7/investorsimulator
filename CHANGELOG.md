# Changelog

All notable changes to the Investor Simulator project will be documented in this file.

## [2026-02-21] - UI/UX & Market Analysis (v0.5.0)

### Added
- **Stock Details Screen:** Deep-dive view for every stock including company descriptions, CEO information, founding dates, and detailed area charts.
- **Financial Reports:** Mocked quarterly reports (EPS/Revenue) and real-time news feed within the stock details view.
- **Stock Market List View:** Added a toggleable "List View" for the Stock Market, providing a more compact and manageable way to browse many stocks.
- **Search & Filtering:** Users can now search for stocks by symbol or name in real-time.
- **Performance Indicators:** List view now shows 30-day and 1-year (365-day) price change percentages for all stocks.
- **Improved Insider Tips:** Insider tips now trigger a clear alert box in addition to being logged, ensuring users don't miss valuable information they've paid for.

### Changed
- **Extended History:** Increased the internal stock price history tracking from 100 to 365 days to support longer-term performance analysis.
- **Stock Market UI:** Redesigned the Stock Market header to include search, view toggles, and improved exchange tabs.
- **Portfolio Layout:** Fixed a layout issue where the portfolio list didn't occupy the full vertical space, improving scrollability and visual density.

## [2026-02-19] - Persistence & Session Recovery (v0.4.0)

### Added
- **Session Persistence:** The current game state and application view (Setup/Playing/Finished) are now saved to `localStorage`.
- **Automatic Recovery:** Refreshing the browser now restores the exact state of the game, including portfolio, cash, messages, and simulation date.
- **Session Management:** Added `saveSession`, `getSession`, and `clearSession` utilities to `lib/storage.ts`.

### Changed
- **useGame Hook:** Now initializes from a saved session if available and persists state changes automatically.
- **App Component:** Persists the current view state and clears sessions when returning to the main menu.

## [2026-02-19] - Content Enrichment (v0.3.2)

### Added
- **Expanded Stock List:** Added 30+ diverse stocks across all exchanges, including major S&P 500 companies (NVDA, DIS, V, WMT, etc.) and more crypto assets (SOL, DOGE, XRP).
- **Sector Variety:** Improved representation of different sectors like Energy, Consumer Goods, and Healthcare.

## [2026-02-19] - Visual Overhaul (v0.3.1)

### Changed
- **Color Palette:** Refined theme with deep blacks (`#050505`) and muted greens for better contrast and reduced eye strain.
- **CRT Effects:** Optimized flicker animation and scanlines to be less intrusive.
- **Background:** Replaced solid black background with a CSS-generated tactical grid pattern.
- **Component Styling:**
    - Added 3D "press" effects to retro buttons.
    - Improved hierarchy in Portfolio and Stock Card lists.
    - Added decorative ASCII-style borders to the Score Screen.

## [2026-02-19] - Global Markets & Dividends (v0.3.0)

### Added
- **Multiple Exchanges:** Introduced NASDAQ, NYSE, LSE, and CRYPTO exchanges.
- **Market Progression:** Players now start with only NASDAQ unlocked. Other markets require purchasing licenses in-game.
- **Dividend System:** Added passive income mechanic for specific stocks.
- **UI Enhancements:** Exchange tabs, market lock overlays, and dividend indicators.

### Changed
- **State Management:** Updated `GameState` to track `unlockedExchanges` and `totalDividends`.
- **Simulation Engine:** Added dividend payout calculation to the game tick.

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

## [2026-02-19] - Initial Prototype (v0.1.0)

### Added
- Basic market simulation with historical and random modes.
- Core trading mechanics (buy/sell).
- Portfolio and market UI components.
- Initial CRT/Retro styling.
