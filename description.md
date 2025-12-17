# World Clocks - Code Description

## Overview

This application displays up to 5 analog clocks showing the current time in different cities around the world. It uses 3 languages: HTML, CSS, and JavaScript.

---

## 1. HTML (`index.html`) - 67 lines

### Structure:
- **Header** (lines 10-18): Contains title "World Clocks" and controls
  - "Add City" button (`#add-city-btn`)
  - Hidden dropdown (`#city-dropdown`) for city selection

- **Main Container** (lines 20-22): Empty `#clock-container` where clocks are dynamically inserted

- **Clock Template** (lines 25-63): An HTML `<template>` element containing:
  - `.clock-card` wrapper with `data-city-id` attribute
  - `.remove-btn` (× button) for removing clocks
  - **SVG Clock Face** (200×200 viewBox):
    - Circle for clock border
    - 12 hour markers using `<line>` elements with rotation transforms
    - 3 clock hands: `.hour-hand`, `.minute-hand`, `.second-hand`
    - Center dot
  - `.city-name` and `.digital-time` display elements

---

## 2. JavaScript (`js/clocks.js`) - 441 lines

### Data Structures:
```javascript
CITIES[]        // 15 cities with {id, name, timezone}
DEFAULT_CITIES  // ['new-york', 'london', 'tokyo', 'sydney', 'paris']
MAX_CLOCKS      // 5
activeCities[]  // Currently displayed city IDs
```

### Core Functions:

| Function | Purpose |
|----------|---------|
| `getTimeForTimezone(tz)` | Uses `Intl` API to get {hours, minutes, seconds} for a timezone |
| `calculateHandAngles(h,m,s)` | Converts time to rotation degrees |
| `formatDigitalTime(h,m,s)` | Returns "HH:MM:SS" string |
| `updateClock(element, tz)` | Sets CSS `transform: rotate()` on hands + updates digital display |
| `createClockElement(city)` | Clones template, sets city data, attaches event listeners |

### Angle Calculations (lines 68-78):
- **Hour**: `(hours % 12) × 30° + minutes × 0.5°`
- **Minute**: `minutes × 6° + seconds × 0.1°`
- **Second**: `seconds × 6°`

### City Management:
- `addCity(cityId)` - Validates, adds to array, creates DOM element, updates UI
- `removeCity(cityId)` - Removes from array and DOM
- `updateDropdown()` - Rebuilds dropdown options excluding active cities
- `updateAddButton()` - Disables button when 5 clocks displayed

### Persistence (lines 310-336):
- `saveToStorage()` - Saves `activeCities` to `localStorage`
- `loadFromStorage()` - Retrieves and validates stored city IDs

### Initialization Flow:
1. `init()` → `setupEventListeners()` + `initializeClocks()`
2. Load cities from localStorage or defaults
3. Create clock elements for each city
4. Start `setInterval(updateAllClocks, 1000)`

---

## 3. CSS (`css/styles.css`) - 294 lines

### CSS Variables (`:root`):
```css
--primary-color: #2c3e50   /* Dark blue - hands, borders */
--secondary-color: #3498db /* Blue - buttons */
--accent-color: #e74c3c    /* Red - second hand, center dot */
--bg-color: #ecf0f1        /* Light gray background */
```

### Key Styling:

| Element | Technique |
|---------|-----------|
| Clock Container | CSS Grid: `repeat(auto-fit, minmax(280px, 1fr))` |
| Clock Hands | `transform-origin: 100px 100px` (SVG center point) |
| Hand Animation | `transition: transform 0.1s cubic-bezier(...)` for smooth ticking |
| Card Hover | `translateY(-4px)` + enhanced shadow |
| Remove Button | Absolute positioned, circular, red on hover |

### Responsive Breakpoints:
- **768px**: Header stacks vertically, smaller clock faces (150px)
- **480px**: Single column grid, reduced font sizes

---

## Architecture Flow

```
┌─────────────────┐
│   Page Load     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ init()          │
│ - setupEvents   │
│ - loadStorage   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ initializeClocks│
│ - clone template│
│ - append to DOM │
└────────┬────────┘
         ▼
┌─────────────────┐
│ setInterval     │◄──── Every 1 second
│ updateAllClocks │
└────────┬────────┘
         ▼
┌─────────────────┐
│ For each clock: │
│ - getTime(tz)   │
│ - calcAngles()  │
│ - CSS transform │
└─────────────────┘
```

---

## Available Cities (15 total)

| City | Timezone |
|------|----------|
| New York | America/New_York |
| London | Europe/London |
| Tokyo | Asia/Tokyo |
| Sydney | Australia/Sydney |
| Paris | Europe/Paris |
| Dubai | Asia/Dubai |
| Singapore | Asia/Singapore |
| Hong Kong | Asia/Hong_Kong |
| Moscow | Europe/Moscow |
| Los Angeles | America/Los_Angeles |
| Chicago | America/Chicago |
| Toronto | America/Toronto |
| Berlin | Europe/Berlin |
| Mumbai | Asia/Kolkata |
| São Paulo | America/Sao_Paulo |

---

## Test Coverage

- **64 unit tests** (Jest) - Setup, DOM, styles, clock logic
- **21 E2E tests** (Playwright) - User interactions, persistence, responsive layout
- **85 total tests passing**
