/**
 * Test Helper Utilities
 * 
 * Common utilities and helpers for testing the Employee Management Application.
 * These helpers provide consistent ways to create test data, mock dependencies,
 * and set up test environments.
 */

/**
 * Creates a mock employee object with default values
 * @param {Object} overrides - Properties to override in the mock employee
 * @returns {Object} Mock employee object
 */
export const createMockEmployee = (overrides = {}) => {
  return {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
    phoneNumber: '1234567890',
    emailAddress: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior',
    ...overrides
  };
};

/**
 * Creates an array of mock employees
 * @param {number} count - Number of employees to create
 * @param {Object} baseOverrides - Base overrides applied to all employees
 * @returns {Array} Array of mock employee objects
 */
export const createMockEmployees = (count = 5, baseOverrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    createMockEmployee({
      id: index + 1,
      firstName: `Employee${index + 1}`,
      lastName: `Test${index + 1}`,
      emailAddress: `employee${index + 1}@test.com`,
      ...baseOverrides
    })
  );
};

/**
 * Creates a mock Redux store for testing
 * @param {Object} initialState - Initial state for the store
 * @returns {Object} Mock store object
 */
export const createMockStore = (initialState = {}) => {
  const defaultState = {
    employees: [],
    ...initialState
  };

  let currentState = defaultState;
  const listeners = [];

  return {
    getState: () => currentState,
    dispatch: (action) => {
      // Simple mock dispatch - can be enhanced for specific action handling
      console.log('Mock store dispatch:', action);
      return action;
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
    // Test helper to update state
    setState: (newState) => {
      currentState = { ...currentState, ...newState };
      listeners.forEach(listener => listener());
    }
  };
};

/**
 * Creates a mock router for testing navigation
 * @returns {Object} Mock router object
 */
export const createMockRouter = () => {
  let currentRoute = '/';
  
  return {
    go: (path) => {
      console.log('Mock router navigate to:', path);
      currentRoute = path;
    },
    getLocation: () => ({
      pathname: currentRoute,
      params: {}
    }),
    // Test helper
    setCurrentRoute: (path) => {
      currentRoute = path;
    }
  };
};

/**
 * Creates a mock host element for controller testing
 * @returns {Object} Mock host element
 */
export const createMockHost = () => {
  const controllers = [];
  let updateRequested = false;

  return {
    addController: (controller) => {
      controllers.push(controller);
    },
    requestUpdate: () => {
      updateRequested = true;
      // Simulate async update
      return Promise.resolve();
    },
    // Test helpers
    getControllers: () => controllers,
    wasUpdateRequested: () => updateRequested,
    resetUpdateFlag: () => { updateRequested = false; }
  };
};

/**
 * Waits for a condition to be true or timeout
 * @param {Function} condition - Function that returns true when condition is met
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} message - Error message if timeout occurs
 * @returns {Promise} Resolves when condition is met
 */
export const waitForCondition = async (condition, timeout = 3000, message = 'Condition not met') => {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    if (condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  throw new Error(`${message} (timeout after ${timeout}ms)`);
};

/**
 * Waits for an element to be rendered and ready
 * @param {HTMLElement} element - Element to wait for
 * @returns {Promise} Resolves when element is ready
 */
export const waitForElement = async (element) => {
  await element.updateComplete;
  
  // Wait an extra frame to ensure rendering is complete
  await new Promise(resolve => requestAnimationFrame(resolve));
};

/**
 * Creates a custom event for testing component events
 * @param {string} type - Event type
 * @param {Object} detail - Event detail object
 * @param {Object} options - Event options
 * @returns {CustomEvent} Custom event object
 */
export const createCustomEvent = (type, detail = {}, options = {}) => {
  return new CustomEvent(type, {
    detail,
    bubbles: true,
    cancelable: true,
    ...options
  });
};

/**
 * Simulates user input on an element
 * @param {HTMLElement} element - Input element
 * @param {string} value - Value to input
 */
export const simulateInput = async (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Wait for any async updates
  await new Promise(resolve => setTimeout(resolve, 0));
};

/**
 * Simulates a click event on an element
 * @param {HTMLElement} element - Element to click
 */
export const simulateClick = async (element) => {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  
  // Wait for any async updates
  await new Promise(resolve => setTimeout(resolve, 0));
};

/**
 * Mock translation function for testing localized components
 * @param {string} key - Translation key
 * @param {Object} params - Translation parameters
 * @returns {string} Mock translated string
 */
export const mockTranslate = (key, params = {}) => {
  // Simple mock - returns the key with parameters injected
  let result = `MOCK_${key}`;
  
  Object.keys(params).forEach(param => {
    result = result.replace(`{${param}}`, params[param]);
  });
  
  return result;
};

/**
 * Test data generators
 */
export const testData = {
  departments: [
    { key: 'Analytics', label: 'department.analytics' },
    { key: 'Tech', label: 'department.tech' }
  ],
  
  positions: [
    { key: 'Junior', label: 'position.junior' },
    { key: 'Medior', label: 'position.medior' },
    { key: 'Senior', label: 'position.senior' }
  ],
  
  validationErrors: {
    required: 'Field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number'
  }
};