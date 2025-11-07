/**
 * Test Setup and Configuration
 * 
 * This file sets up the global testing environment and provides
 * common setup/teardown functionality for all tests.
 */

// Import testing utilities from @open-wc/testing
import { 
  html,
  fixture,
  expect,
  elementUpdated,
  oneEvent,
  aTimeout
} from '@open-wc/testing';

// Import Sinon for mocking and spying
import { spy, stub, restore } from 'sinon';

// Make testing utilities globally available
globalThis.html = html;
globalThis.fixture = fixture;
globalThis.expect = expect;
globalThis.elementUpdated = elementUpdated;
globalThis.oneEvent = oneEvent;
globalThis.aTimeout = aTimeout;
globalThis.spy = spy;
globalThis.stub = stub;

/**
 * Global test setup - runs before all tests
 */
export const setupTests = () => {
  // Mock console methods in tests to avoid noise
  const originalConsole = { ...console };
  
  beforeEach(() => {
    // Mock console methods
    spy(console, 'log');
    spy(console, 'warn');
    spy(console, 'error');
  });
  
  afterEach(() => {
    // Clean up all spies and stubs
    restore();
  });

  // Restore original console after all tests
  after(() => {
    Object.assign(console, originalConsole);
  });
};

/**
 * Sets up a component test environment
 * @param {TemplateResult} template - LitElement template to render
 * @param {Object} options - Test options
 * @returns {Promise<HTMLElement>} The rendered element
 */
export const setupComponentTest = async (template, options = {}) => {
  const element = await fixture(template);
  
  // Wait for element to be fully rendered
  await elementUpdated(element);
  
  // Additional setup based on options
  if (options.waitForStable) {
    await element.updateComplete;
  }
  
  return element;
};

/**
 * Sets up a controller test environment
 * @param {Class} ControllerClass - Controller class to test
 * @param {Object} mockHost - Mock host element
 * @param {Array} constructorArgs - Arguments for controller constructor
 * @returns {Object} Controller instance and test utilities
 */
export const setupControllerTest = (ControllerClass, mockHost = null, ...constructorArgs) => {
  // Create a mock host if not provided
  if (!mockHost) {
    mockHost = {
      addController: spy(),
      requestUpdate: spy(() => Promise.resolve()),
      updateComplete: Promise.resolve()
    };
  }
  
  const controller = new ControllerClass(mockHost, ...constructorArgs);
  
  return {
    controller,
    mockHost,
    // Helper to trigger controller lifecycle
    connect: () => controller.hostConnected?.(),
    disconnect: () => controller.hostDisconnected?.()
  };
};

/**
 * Sets up Redux store mocking
 * @param {Object} initialState - Initial store state
 * @returns {Object} Mock store and utilities
 */
export const setupStoreMock = (initialState = {}) => {
  const store = {
    state: { employees: [], ...initialState },
    listeners: [],
    
    getState() {
      return this.state;
    },
    
    dispatch: spy(function(action) {
      // Simple reducer simulation
      switch (action.type) {
        case 'ADD_EMPLOYEE':
          this.state.employees.push(action.payload);
          break;
        case 'UPDATE_EMPLOYEE':
          const index = this.state.employees.findIndex(emp => emp.id === action.payload.id);
          if (index >= 0) {
            this.state.employees[index] = action.payload;
          }
          break;
        case 'DELETE_EMPLOYEE':
          this.state.employees = this.state.employees.filter(emp => emp.id !== action.payload);
          break;
      }
      
      // Notify listeners
      this.listeners.forEach(listener => listener());
      return action;
    }),
    
    subscribe(listener) {
      this.listeners.push(listener);
      return () => {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
          this.listeners.splice(index, 1);
        }
      };
    }
  };
  
  return {
    store,
    setState: (newState) => {
      store.state = { ...store.state, ...newState };
      store.listeners.forEach(listener => listener());
    }
  };
};

/**
 * Sets up router mocking
 * @param {string} initialRoute - Initial route path
 * @returns {Object} Mock router and utilities
 */
export const setupRouterMock = (initialRoute = '/') => {
  const router = {
    currentRoute: initialRoute,
    params: {},
    
    go: spy(function(path) {
      this.currentRoute = path;
      // Extract params from path (simple implementation)
      const match = path.match(/\/edit\/(\d+)/);
      if (match) {
        this.params = { id: match[1] };
      } else {
        this.params = {};
      }
    }),
    
    getLocation() {
      return {
        pathname: this.currentRoute,
        params: this.params
      };
    }
  };
  
  return {
    router,
    navigateTo: (path) => router.go(path),
    getCurrentRoute: () => router.currentRoute
  };
};

/**
 * Waits for a custom event to be dispatched
 * @param {HTMLElement} element - Element to listen on
 * @param {string} eventType - Event type to wait for
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<CustomEvent>} The dispatched event
 */
export const waitForEvent = (element, eventType, timeout = 3000) => {
  return oneEvent(element, eventType, { timeout });
};

/**
 * Simulates user interaction
 */
export const userInteraction = {
  /**
   * Simulates typing in an input field
   */
  async type(element, text) {
    element.focus();
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    await elementUpdated(element);
  },
  
  /**
   * Simulates clicking an element
   */
  async click(element) {
    element.click();
    await aTimeout(0); // Wait for event propagation
  },
  
  /**
   * Simulates form submission
   */
  async submit(form) {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    await aTimeout(0);
  },
  
  /**
   * Simulates selecting an option in a select element
   */
  async select(selectElement, value) {
    selectElement.value = value;
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    await elementUpdated(selectElement);
  }
};

/**
 * Assertion helpers
 */
export const assertions = {
  /**
   * Asserts that an element is visible
   */
  isVisible(element) {
    expect(element).to.exist;
    expect(getComputedStyle(element).display).to.not.equal('none');
    expect(getComputedStyle(element).visibility).to.not.equal('hidden');
  },
  
  /**
   * Asserts that an element is hidden
   */
  isHidden(element) {
    const style = getComputedStyle(element);
    expect(style.display === 'none' || style.visibility === 'hidden').to.be.true;
  },
  
  /**
   * Asserts that an element has specific text content
   */
  hasText(element, expectedText) {
    expect(element.textContent.trim()).to.equal(expectedText);
  },
  
  /**
   * Asserts that an element contains specific text
   */
  containsText(element, expectedText) {
    expect(element.textContent).to.include(expectedText);
  }
};

// Initialize global test setup
setupTests();