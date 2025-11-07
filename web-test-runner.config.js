import { playwrightLauncher } from '@web/test-runner-playwright';

/**
 * Web Test Runner Configuration
 * 
 * This configuration sets up the testing environment for the Employee Management Application.
 * It uses @web/test-runner with Playwright for cross-browser testing.
 */

export default {
  // Test files pattern
  files: 'test/**/*.test.js',
  
  // Node resolve for imports
  nodeResolve: {
    exportConditions: ['browser', 'development'],
    preferBuiltins: false
  },
  
  // Coverage configuration
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: [
      'src/**/*.test.js',
      'src/**/*.spec.js',
      'test/**/*'
    ],
    threshold: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80
    }
  },

  // Browser launchers
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    // Uncomment for cross-browser testing
    // playwrightLauncher({ product: 'firefox' }),
    // playwrightLauncher({ product: 'webkit' }),
  ],

  // Filter browser logs to prevent dev mode warnings from failing tests
  filterBrowserLogs: (log) => {
    // Skip LitElement dev mode warnings
    if (log.args && log.args.some && log.args.some(arg => 
      typeof arg === 'string' && (
        arg.includes('Lit is in dev mode') || 
        arg.includes('scheduled an update after update completed')
      )
    )) {
      return false;
    }
    return true;
  },

  // Test framework
  testFramework: {
    config: {
      timeout: 3000,
      retries: 1
    }
  },

  // Serve static files
  staticDirs: ['src', 'assets'],

  // Middleware for mocking API calls during tests
  middleware: [],

  // Test runner options
  concurrency: 10,
  
  // Groups for organized test execution
  groups: [
    {
      name: 'unit',
      files: 'test/unit/**/*.test.js',
    }
  ]
};