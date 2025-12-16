/**
 * World Clocks - Main JavaScript
 * Handles clock rendering, timezone conversions, and real-time updates
 */

// Available cities with timezone data
const CITIES = [
  { id: 'new-york', name: 'New York', timezone: 'America/New_York' },
  { id: 'london', name: 'London', timezone: 'Europe/London' },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney' },
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris' },
  { id: 'dubai', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'hong-kong', name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { id: 'moscow', name: 'Moscow', timezone: 'Europe/Moscow' },
  { id: 'los-angeles', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 'chicago', name: 'Chicago', timezone: 'America/Chicago' },
  { id: 'toronto', name: 'Toronto', timezone: 'America/Toronto' },
  { id: 'berlin', name: 'Berlin', timezone: 'Europe/Berlin' },
  { id: 'mumbai', name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { id: 'sao-paulo', name: 'São Paulo', timezone: 'America/Sao_Paulo' }
];

// Default cities to display on first load
const DEFAULT_CITIES = ['new-york', 'london', 'tokyo', 'sydney', 'paris'];

// Maximum number of clocks
const MAX_CLOCKS = 5;

// Storage key for localStorage
const STORAGE_KEY = 'world-clocks-cities';

// Currently active cities
let activeCities = [];

// Update interval reference
let updateInterval = null;

/**
 * Get time for a specific timezone
 * @param {string} timezone - IANA timezone identifier
 * @returns {object} - { hours, minutes, seconds }
 */
function getTimeForTimezone(timezone) {
  const now = new Date();
  const options = {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const timeString = now.toLocaleTimeString('en-US', options);
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return { hours, minutes, seconds };
}

/**
 * Calculate clock hand angles from time
 * @param {number} hours - Hours (0-23)
 * @param {number} minutes - Minutes (0-59)
 * @param {number} seconds - Seconds (0-59)
 * @returns {object} - { hourAngle, minuteAngle, secondAngle }
 */
function calculateHandAngles(hours, minutes, seconds) {
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);

  // Minute hand: 6 degrees per minute + 0.1 degrees per second
  const minuteAngle = (minutes * 6) + (seconds * 0.1);

  // Second hand: 6 degrees per second
  const secondAngle = seconds * 6;

  return { hourAngle, minuteAngle, secondAngle };
}

/**
 * Format time as digital display string
 * @param {number} hours - Hours
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @returns {string} - Formatted time string (HH:MM:SS)
 */
function formatDigitalTime(hours, minutes, seconds) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Update a single clock element
 * @param {HTMLElement} clockElement - The clock card element
 * @param {string} timezone - IANA timezone identifier
 */
function updateClock(clockElement, timezone) {
  const { hours, minutes, seconds } = getTimeForTimezone(timezone);
  const { hourAngle, minuteAngle, secondAngle } = calculateHandAngles(hours, minutes, seconds);

  // Update clock hands
  const hourHand = clockElement.querySelector('.hour-hand');
  const minuteHand = clockElement.querySelector('.minute-hand');
  const secondHand = clockElement.querySelector('.second-hand');

  if (hourHand) hourHand.style.transform = `rotate(${hourAngle}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  if (secondHand) secondHand.style.transform = `rotate(${secondAngle}deg)`;

  // Update digital time
  const digitalTime = clockElement.querySelector('.digital-time');
  if (digitalTime) {
    digitalTime.textContent = formatDigitalTime(hours, minutes, seconds);
  }
}

/**
 * Create a clock element for a city
 * @param {object} city - City object with id, name, timezone
 * @returns {HTMLElement} - Clock card element
 */
function createClockElement(city) {
  const template = document.getElementById('clock-template');
  if (!template) return null;

  const clone = template.content.cloneNode(true);
  const clockCard = clone.querySelector('.clock-card');

  clockCard.dataset.cityId = city.id;
  clockCard.querySelector('.city-name').textContent = city.name;

  // Add remove button event listener
  const removeBtn = clockCard.querySelector('.remove-btn');
  removeBtn.addEventListener('click', () => removeCity(city.id));

  return clockCard;
}

/**
 * Get city by ID
 * @param {string} cityId - City ID
 * @returns {object|undefined} - City object or undefined
 */
function getCityById(cityId) {
  return CITIES.find(city => city.id === cityId);
}

/**
 * Get list of active cities
 * @returns {string[]} - Array of active city IDs
 */
function getActiveCities() {
  return [...activeCities];
}

/**
 * Get list of available cities (not currently displayed)
 * @returns {object[]} - Array of available city objects
 */
function getAvailableCities() {
  return CITIES.filter(city => !activeCities.includes(city.id));
}

/**
 * Update all clocks
 */
function updateAllClocks() {
  const clockCards = document.querySelectorAll('.clock-card');
  clockCards.forEach(card => {
    const cityId = card.dataset.cityId;
    const city = getCityById(cityId);
    if (city) {
      updateClock(card, city.timezone);
    }
  });
}

/**
 * Start clock update interval
 */
function startClockUpdates() {
  // Update immediately
  updateAllClocks();

  // Update every second
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  updateInterval = setInterval(updateAllClocks, 1000);
}

/**
 * Stop clock update interval
 */
function stopClockUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

/**
 * Add a city clock
 * @param {string} cityId - City ID to add
 * @returns {boolean} - Success status
 */
function addCity(cityId) {
  // Check if already at max
  if (activeCities.length >= MAX_CLOCKS) {
    return false;
  }

  // Check if city already active
  if (activeCities.includes(cityId)) {
    return false;
  }

  // Check if city exists
  const city = getCityById(cityId);
  if (!city) {
    return false;
  }

  // Add to active cities
  activeCities.push(cityId);

  // Create and add clock element
  const container = document.getElementById('clock-container');
  const clockElement = createClockElement(city);
  if (container && clockElement) {
    container.appendChild(clockElement);
    updateClock(clockElement, city.timezone);
  }

  // Update UI
  updateDropdown();
  updateAddButton();
  saveToStorage();

  return true;
}

/**
 * Remove a city clock
 * @param {string} cityId - City ID to remove
 * @returns {boolean} - Success status
 */
function removeCity(cityId) {
  const index = activeCities.indexOf(cityId);
  if (index === -1) {
    return false;
  }

  // Remove from active cities
  activeCities.splice(index, 1);

  // Remove clock element
  const clockCard = document.querySelector(`.clock-card[data-city-id="${cityId}"]`);
  if (clockCard) {
    clockCard.remove();
  }

  // Update UI
  updateDropdown();
  updateAddButton();
  saveToStorage();

  return true;
}

/**
 * Update the city dropdown with available cities
 */
function updateDropdown() {
  const dropdown = document.getElementById('city-dropdown');
  if (!dropdown) return;

  // Clear existing options except the first placeholder
  while (dropdown.options.length > 1) {
    dropdown.remove(1);
  }

  // Add available cities
  const available = getAvailableCities();
  available.forEach(city => {
    const option = document.createElement('option');
    option.value = city.id;
    option.textContent = city.name;
    dropdown.appendChild(option);
  });

  // Reset selection
  dropdown.value = '';
}

/**
 * Update add button state
 */
function updateAddButton() {
  const addBtn = document.getElementById('add-city-btn');
  if (addBtn) {
    addBtn.disabled = activeCities.length >= MAX_CLOCKS;
  }
}

/**
 * Save active cities to localStorage
 */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeCities));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

/**
 * Load active cities from localStorage
 * @returns {string[]} - Array of city IDs
 */
function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Validate that all stored cities exist
        return parsed.filter(id => getCityById(id));
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

/**
 * Initialize clocks from storage or defaults
 */
function initializeClocks() {
  const container = document.getElementById('clock-container');
  if (!container) return;

  // Clear existing clocks
  container.innerHTML = '';
  activeCities = [];

  // Load from storage or use defaults
  const storedCities = loadFromStorage();
  const citiesToLoad = storedCities || DEFAULT_CITIES;

  // Add each city
  citiesToLoad.forEach(cityId => {
    const city = getCityById(cityId);
    if (city && activeCities.length < MAX_CLOCKS) {
      activeCities.push(cityId);
      const clockElement = createClockElement(city);
      if (clockElement) {
        container.appendChild(clockElement);
      }
    }
  });

  // Update UI
  updateDropdown();
  updateAddButton();

  // Start updates
  startClockUpdates();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Add city button
  const addBtn = document.getElementById('add-city-btn');
  const dropdown = document.getElementById('city-dropdown');

  if (addBtn && dropdown) {
    addBtn.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
      if (!dropdown.classList.contains('hidden')) {
        dropdown.focus();
      }
    });

    dropdown.addEventListener('change', (e) => {
      const cityId = e.target.value;
      if (cityId) {
        addCity(cityId);
        dropdown.classList.add('hidden');
      }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!addBtn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }
}

/**
 * Initialize the application
 */
function init() {
  setupEventListeners();
  initializeClocks();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CITIES,
    DEFAULT_CITIES,
    MAX_CLOCKS,
    getTimeForTimezone,
    calculateHandAngles,
    formatDigitalTime,
    getCityById,
    getActiveCities,
    getAvailableCities,
    addCity,
    removeCity,
    saveToStorage,
    loadFromStorage,
    // Expose internal state for testing
    _setActiveCities: (cities) => { activeCities = cities; },
    _getActiveCities: () => activeCities
  };
}
