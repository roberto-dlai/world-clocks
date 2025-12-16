# World Clocks

A responsive web application that displays up to 5 analog clocks showing the current time in different cities around the world.

## Features

- **Analog Clocks**: Beautiful SVG-based analog clocks with hour, minute, and second hands
- **Real-time Updates**: Clocks update every second with smooth animations
- **Digital Time Display**: Each clock shows digital time below the analog face
- **15 World Cities**: Choose from major cities across different timezones
- **Customizable**: Add and remove cities to personalize your dashboard
- **Persistent Preferences**: Your city selection is saved to localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Dependencies**: Built with vanilla HTML, CSS, and JavaScript

## Available Cities

- New York (America/New_York)
- London (Europe/London)
- Tokyo (Asia/Tokyo)
- Sydney (Australia/Sydney)
- Paris (Europe/Paris)
- Dubai (Asia/Dubai)
- Singapore (Asia/Singapore)
- Hong Kong (Asia/Hong_Kong)
- Moscow (Europe/Moscow)
- Los Angeles (America/Los_Angeles)
- Chicago (America/Chicago)
- Toronto (America/Toronto)
- Berlin (Europe/Berlin)
- Mumbai (Asia/Kolkata)
- São Paulo (America/Sao_Paulo)

## Getting Started

### Prerequisites

- Node.js (for running tests)
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/roberto-dlai/world-clocks.git
   cd world-clocks
   ```

2. Install dependencies (for testing):
   ```bash
   npm install
   ```

3. Open `index.html` in your browser to view the application.

### Running Tests

Run unit tests:
```bash
npm test
```

Run unit tests with watch mode:
```bash
npm run test:watch
```

Run unit tests with coverage:
```bash
npm run test:coverage
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run E2E tests in headed mode (visible browser):
```bash
npm run test:e2e:headed
```

Run all tests:
```bash
npm run test:all
```

## Usage

1. **View Clocks**: The application loads with 5 default cities (New York, London, Tokyo, Sydney, Paris)

2. **Add a City**:
   - Click the "Add City" button in the header
   - Select a city from the dropdown
   - The new clock will appear (maximum 5 clocks)

3. **Remove a City**:
   - Hover over a clock card
   - Click the × button in the top-right corner

4. **Preferences**: Your city selection is automatically saved and will be restored when you return

## Project Structure

```
world-clocks/
├── index.html              # Main HTML page
├── css/
│   └── styles.css          # All styling
├── js/
│   └── clocks.js           # Clock logic and city management
├── tests/
│   ├── unit/               # Jest unit tests
│   │   ├── setup.test.js
│   │   ├── dom.test.js
│   │   ├── styles.test.js
│   │   └── clocks.test.js
│   └── e2e/                # Playwright E2E tests
│       └── clocks.e2e.test.js
├── package.json            # npm configuration
├── jest.config.js          # Jest configuration
├── playwright.config.js    # Playwright configuration
├── progress.md             # Development progress tracker
└── README.md               # This file
```

## Deploying to GitHub Pages

1. Go to your repository on GitHub

2. Navigate to **Settings** > **Pages**

3. Under "Source", select **Deploy from a branch**

4. Select the `main` branch and `/ (root)` folder

5. Click **Save**

6. Your site will be available at: `https://roberto-dlai.github.io/world-clocks/`

## Technical Details

### Timezone Handling

The application uses the JavaScript `Intl.DateTimeFormat` API with IANA timezone identifiers for accurate timezone conversions.

### Clock Hand Calculations

- **Hour hand**: 30° per hour + 0.5° per minute (smooth movement)
- **Minute hand**: 6° per minute + 0.1° per second (smooth movement)
- **Second hand**: 6° per second

### Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- SVG
- localStorage
- Intl.DateTimeFormat API

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

Built with vanilla web technologies - no frameworks or external dependencies required for the core functionality.
