/**
 * DOM Structure Tests
 * Verifies HTML elements are present and correctly structured
 */

const fs = require('fs');
const path = require('path');

describe('HTML Structure', () => {
  let document;

  beforeAll(() => {
    const htmlPath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    document = new DOMParser().parseFromString(html, 'text/html');
  });

  test('page has correct title', () => {
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('World Clocks');
  });

  test('page has responsive viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute('content')).toContain('width=device-width');
  });

  test('header element exists with title', () => {
    const header = document.querySelector('header');
    expect(header).not.toBeNull();

    const h1 = header.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe('World Clocks');
  });

  test('add city button exists', () => {
    const addBtn = document.querySelector('#add-city-btn');
    expect(addBtn).not.toBeNull();
    expect(addBtn.textContent).toContain('Add City');
  });

  test('city dropdown exists', () => {
    const dropdown = document.querySelector('#city-dropdown');
    expect(dropdown).not.toBeNull();
    expect(dropdown.tagName.toLowerCase()).toBe('select');
  });

  test('clock container exists', () => {
    const container = document.querySelector('#clock-container');
    expect(container).not.toBeNull();
  });

  test('clock template exists with required elements', () => {
    const template = document.querySelector('#clock-template');
    expect(template).not.toBeNull();

    const templateContent = template.content || template;

    // Check for clock card structure
    const clockCard = templateContent.querySelector('.clock-card');
    expect(clockCard).not.toBeNull();

    // Check for remove button
    const removeBtn = templateContent.querySelector('.remove-btn');
    expect(removeBtn).not.toBeNull();

    // Check for clock face with SVG
    const clockFace = templateContent.querySelector('.clock-face');
    expect(clockFace).not.toBeNull();

    const svg = templateContent.querySelector('.clock-svg');
    expect(svg).not.toBeNull();

    // Check for clock hands
    const hourHand = templateContent.querySelector('.hour-hand');
    const minuteHand = templateContent.querySelector('.minute-hand');
    const secondHand = templateContent.querySelector('.second-hand');
    expect(hourHand).not.toBeNull();
    expect(minuteHand).not.toBeNull();
    expect(secondHand).not.toBeNull();

    // Check for city name and digital time
    const cityName = templateContent.querySelector('.city-name');
    const digitalTime = templateContent.querySelector('.digital-time');
    expect(cityName).not.toBeNull();
    expect(digitalTime).not.toBeNull();
  });

  test('CSS stylesheet is linked', () => {
    const cssLink = document.querySelector('link[rel="stylesheet"]');
    expect(cssLink).not.toBeNull();
    expect(cssLink.getAttribute('href')).toBe('css/styles.css');
  });

  test('JavaScript file is linked', () => {
    const script = document.querySelector('script[src="js/clocks.js"]');
    expect(script).not.toBeNull();
  });
});
