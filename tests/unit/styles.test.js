/**
 * CSS Styles Tests
 * Verifies CSS file exists and contains required style rules
 */

const fs = require('fs');
const path = require('path');

describe('CSS Styles', () => {
  let cssContent;

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, '../../css/styles.css');
    cssContent = fs.readFileSync(cssPath, 'utf8');
  });

  test('CSS file exists and is not empty', () => {
    expect(cssContent).toBeDefined();
    expect(cssContent.length).toBeGreaterThan(0);
  });

  test('contains CSS variables for theming', () => {
    expect(cssContent).toContain(':root');
    expect(cssContent).toContain('--primary-color');
    expect(cssContent).toContain('--secondary-color');
    expect(cssContent).toContain('--bg-color');
  });

  test('contains header styles', () => {
    expect(cssContent).toContain('.header');
  });

  test('contains button styles', () => {
    expect(cssContent).toContain('.btn');
    expect(cssContent).toContain('.btn-primary');
  });

  test('contains dropdown styles', () => {
    expect(cssContent).toContain('.city-dropdown');
  });

  test('contains clock container with grid layout', () => {
    expect(cssContent).toContain('.clock-container');
    expect(cssContent).toContain('display: grid');
  });

  test('contains clock card styles', () => {
    expect(cssContent).toContain('.clock-card');
  });

  test('contains clock face styles', () => {
    expect(cssContent).toContain('.clock-face');
    expect(cssContent).toContain('.clock-svg');
    expect(cssContent).toContain('.clock-circle');
  });

  test('contains clock hand styles', () => {
    expect(cssContent).toContain('.hand');
    expect(cssContent).toContain('.hour-hand');
    expect(cssContent).toContain('.minute-hand');
    expect(cssContent).toContain('.second-hand');
  });

  test('clock hands have transform-origin for rotation', () => {
    expect(cssContent).toContain('transform-origin');
  });

  test('clock hands have transition for smooth animation', () => {
    expect(cssContent).toMatch(/\.hand[\s\S]*?transition/);
  });

  test('contains remove button styles', () => {
    expect(cssContent).toContain('.remove-btn');
  });

  test('contains city name and digital time styles', () => {
    expect(cssContent).toContain('.city-name');
    expect(cssContent).toContain('.digital-time');
  });

  test('contains responsive media queries', () => {
    expect(cssContent).toContain('@media');
    expect(cssContent).toContain('max-width: 768px');
    expect(cssContent).toContain('max-width: 480px');
  });

  test('contains hidden utility class', () => {
    expect(cssContent).toContain('.hidden');
  });
});
