/**
 * Clock Logic Unit Tests
 * Tests for timezone handling, angle calculations, and city management
 */

const {
  CITIES,
  DEFAULT_CITIES,
  MAX_CLOCKS,
  getTimeForTimezone,
  calculateHandAngles,
  formatDigitalTime,
  getCityById,
  getAvailableCities,
  _setActiveCities,
  _getActiveCities
} = require('../../js/clocks.js');

describe('Clock Constants', () => {
  test('CITIES array contains at least 5 cities', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(5);
  });

  test('each city has required properties', () => {
    CITIES.forEach(city => {
      expect(city).toHaveProperty('id');
      expect(city).toHaveProperty('name');
      expect(city).toHaveProperty('timezone');
      expect(typeof city.id).toBe('string');
      expect(typeof city.name).toBe('string');
      expect(typeof city.timezone).toBe('string');
    });
  });

  test('DEFAULT_CITIES contains 5 cities', () => {
    expect(DEFAULT_CITIES.length).toBe(5);
  });

  test('DEFAULT_CITIES are valid city IDs', () => {
    DEFAULT_CITIES.forEach(cityId => {
      const city = CITIES.find(c => c.id === cityId);
      expect(city).toBeDefined();
    });
  });

  test('MAX_CLOCKS is 5', () => {
    expect(MAX_CLOCKS).toBe(5);
  });
});

describe('getTimeForTimezone', () => {
  test('returns object with hours, minutes, seconds', () => {
    const time = getTimeForTimezone('America/New_York');
    expect(time).toHaveProperty('hours');
    expect(time).toHaveProperty('minutes');
    expect(time).toHaveProperty('seconds');
  });

  test('hours are between 0 and 23', () => {
    const time = getTimeForTimezone('Europe/London');
    expect(time.hours).toBeGreaterThanOrEqual(0);
    expect(time.hours).toBeLessThanOrEqual(23);
  });

  test('minutes are between 0 and 59', () => {
    const time = getTimeForTimezone('Asia/Tokyo');
    expect(time.minutes).toBeGreaterThanOrEqual(0);
    expect(time.minutes).toBeLessThanOrEqual(59);
  });

  test('seconds are between 0 and 59', () => {
    const time = getTimeForTimezone('Australia/Sydney');
    expect(time.seconds).toBeGreaterThanOrEqual(0);
    expect(time.seconds).toBeLessThanOrEqual(59);
  });

  test('all values are numbers', () => {
    const time = getTimeForTimezone('Europe/Paris');
    expect(typeof time.hours).toBe('number');
    expect(typeof time.minutes).toBe('number');
    expect(typeof time.seconds).toBe('number');
  });
});

describe('calculateHandAngles', () => {
  test('12:00:00 returns 0 degrees for all hands', () => {
    const angles = calculateHandAngles(12, 0, 0);
    expect(angles.hourAngle).toBe(0);
    expect(angles.minuteAngle).toBe(0);
    expect(angles.secondAngle).toBe(0);
  });

  test('00:00:00 (midnight) returns 0 degrees for all hands', () => {
    const angles = calculateHandAngles(0, 0, 0);
    expect(angles.hourAngle).toBe(0);
    expect(angles.minuteAngle).toBe(0);
    expect(angles.secondAngle).toBe(0);
  });

  test('3:00:00 returns 90 degrees for hour hand', () => {
    const angles = calculateHandAngles(3, 0, 0);
    expect(angles.hourAngle).toBe(90);
    expect(angles.minuteAngle).toBe(0);
    expect(angles.secondAngle).toBe(0);
  });

  test('15:00:00 (3 PM) returns 90 degrees for hour hand', () => {
    const angles = calculateHandAngles(15, 0, 0);
    expect(angles.hourAngle).toBe(90);
  });

  test('6:00:00 returns 180 degrees for hour hand', () => {
    const angles = calculateHandAngles(6, 0, 0);
    expect(angles.hourAngle).toBe(180);
  });

  test('9:00:00 returns 270 degrees for hour hand', () => {
    const angles = calculateHandAngles(9, 0, 0);
    expect(angles.hourAngle).toBe(270);
  });

  test('6:30:00 returns correct angles', () => {
    const angles = calculateHandAngles(6, 30, 0);
    // Hour: 6*30 + 30*0.5 = 180 + 15 = 195
    expect(angles.hourAngle).toBe(195);
    // Minute: 30*6 + 0*0.1 = 180
    expect(angles.minuteAngle).toBe(180);
    expect(angles.secondAngle).toBe(0);
  });

  test('minute hand at 30 minutes is 180 degrees', () => {
    const angles = calculateHandAngles(0, 30, 0);
    expect(angles.minuteAngle).toBe(180);
  });

  test('minute hand at 15 minutes is 90 degrees', () => {
    const angles = calculateHandAngles(0, 15, 0);
    expect(angles.minuteAngle).toBe(90);
  });

  test('second hand at 30 seconds is 180 degrees', () => {
    const angles = calculateHandAngles(0, 0, 30);
    expect(angles.secondAngle).toBe(180);
  });

  test('second hand at 15 seconds is 90 degrees', () => {
    const angles = calculateHandAngles(0, 0, 15);
    expect(angles.secondAngle).toBe(90);
  });

  test('minute hand includes second offset', () => {
    const angles = calculateHandAngles(0, 0, 30);
    // Minute: 0*6 + 30*0.1 = 3
    expect(angles.minuteAngle).toBe(3);
  });

  test('hour hand includes minute offset', () => {
    const angles = calculateHandAngles(0, 30, 0);
    // Hour: 0*30 + 30*0.5 = 15
    expect(angles.hourAngle).toBe(15);
  });
});

describe('formatDigitalTime', () => {
  test('formats single digit values with leading zeros', () => {
    expect(formatDigitalTime(1, 2, 3)).toBe('01:02:03');
  });

  test('formats double digit values correctly', () => {
    expect(formatDigitalTime(12, 34, 56)).toBe('12:34:56');
  });

  test('formats midnight correctly', () => {
    expect(formatDigitalTime(0, 0, 0)).toBe('00:00:00');
  });

  test('formats noon correctly', () => {
    expect(formatDigitalTime(12, 0, 0)).toBe('12:00:00');
  });

  test('formats 23:59:59 correctly', () => {
    expect(formatDigitalTime(23, 59, 59)).toBe('23:59:59');
  });
});

describe('getCityById', () => {
  test('returns city object for valid ID', () => {
    const city = getCityById('new-york');
    expect(city).toBeDefined();
    expect(city.name).toBe('New York');
    expect(city.timezone).toBe('America/New_York');
  });

  test('returns undefined for invalid ID', () => {
    const city = getCityById('invalid-city');
    expect(city).toBeUndefined();
  });

  test('finds all default cities', () => {
    DEFAULT_CITIES.forEach(cityId => {
      const city = getCityById(cityId);
      expect(city).toBeDefined();
    });
  });
});

describe('getAvailableCities', () => {
  beforeEach(() => {
    _setActiveCities([]);
  });

  test('returns all cities when none active', () => {
    const available = getAvailableCities();
    expect(available.length).toBe(CITIES.length);
  });

  test('excludes active cities', () => {
    _setActiveCities(['new-york', 'london']);
    const available = getAvailableCities();
    expect(available.length).toBe(CITIES.length - 2);
    expect(available.find(c => c.id === 'new-york')).toBeUndefined();
    expect(available.find(c => c.id === 'london')).toBeUndefined();
  });

  test('returns empty array when all cities active', () => {
    _setActiveCities(CITIES.map(c => c.id));
    const available = getAvailableCities();
    expect(available.length).toBe(0);
  });
});

describe('Active cities management', () => {
  beforeEach(() => {
    _setActiveCities([]);
  });

  test('_setActiveCities updates internal state', () => {
    _setActiveCities(['new-york', 'london']);
    expect(_getActiveCities()).toEqual(['new-york', 'london']);
  });

  test('_getActiveCities returns current state', () => {
    _setActiveCities(['tokyo']);
    const active = _getActiveCities();
    expect(active).toEqual(['tokyo']);
  });
});
