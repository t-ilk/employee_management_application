# Employee Management Application

A modern web application for managing employee data built with Lit Elements and Web Components.

## First Time Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd employee_management_application
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Server
To start the development server:
```bash
npm run serve
```

The application will be available at `http://localhost:8000`

## Testing

### Run All Tests with Coverage
To execute the complete test suite with coverage report:
```bash
npm test
```

The coverage report will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in your browser to view the detailed coverage report.

### Watch Mode
To run tests in watch mode (re-runs tests when files change):
```bash
npm run test:watch
```

### Update Snapshots
To update test snapshots:
```bash
npm run test:update
```

### CI Testing
To run tests in CI mode with JUnit reporter:
```bash
npm run test:ci
```

## Project Structure

- `/src` - Source code
- `/test` - Test files
- `/coverage` - Test coverage reports (generated)
- `index.html` - Main HTML entry point
- `my-element.js` - Main component file
- `web-dev-server.config.js` - Development server configuration

## Features

- Display, add, edit, and delete employees
- Search functionality
- Responsive design for mobile and desktop
- Internationalization support (English/Turkish)
- Comprehensive test coverage (85%+)

## Development Notes

This project was developed with extensive use of AI assistance tools, adopted due to tight time constraints and the developer's unfamiliarity with the Lit Elements platform and modern web component architecture. Despite these constraints, AI assistance was introduced in a controlled, step-by-step fashion to ensure code quality and maintainability.

**Note on Design Compliance:** The developer acknowledges that some features may not be 100% compliant with the provided designs. These deviations are also attributed to the tight time constraints faced during development, and represent areas for potential future refinement.
