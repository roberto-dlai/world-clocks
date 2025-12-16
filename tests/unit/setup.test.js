/**
 * Setup verification tests
 * Ensures project structure and configuration are correct
 */

const fs = require('fs');
const path = require('path');

describe('Project Setup', () => {
  const rootDir = path.resolve(__dirname, '../..');

  test('package.json exists and has correct test scripts', () => {
    const packageJsonPath = path.join(rootDir, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);

    const packageJson = require(packageJsonPath);
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts['test:e2e']).toBeDefined();
  });

  test('required directories exist', () => {
    const requiredDirs = ['css', 'js', 'tests/unit', 'tests/e2e'];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(rootDir, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test('jest config exists', () => {
    const jestConfigPath = path.join(rootDir, 'jest.config.js');
    expect(fs.existsSync(jestConfigPath)).toBe(true);
  });

  test('playwright config exists', () => {
    const playwrightConfigPath = path.join(rootDir, 'playwright.config.js');
    expect(fs.existsSync(playwrightConfigPath)).toBe(true);
  });
});
