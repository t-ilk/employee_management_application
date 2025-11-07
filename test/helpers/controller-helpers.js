import { expect } from '@open-wc/testing';
import { LitElement } from 'lit';
import sinon from 'sinon';

/**
 * Creates a mock host element for testing controllers
 * @returns {Object} Mock host with spies for controller methods
 */
export const createMockHost = () => {
  const mockHost = {
    addController: sinon.spy(),
    removeController: sinon.spy(),
    requestUpdate: sinon.spy(),
    updateComplete: Promise.resolve(),
    hasUpdated: false,
    isUpdatePending: false
  };

  // Add properties that controllers might access
  Object.defineProperty(mockHost, 'updateComplete', {
    get: () => Promise.resolve(),
    configurable: true
  });

  return mockHost;
};

/**
 * Creates a real LitElement host for integration testing
 * @returns {LitElement} A minimal LitElement instance
 */
export const createRealHost = () => {
  class TestHost extends LitElement {
    constructor() {
      super();
      this.controllers = [];
    }

    addController(controller) {
      super.addController(controller);
      this.controllers.push(controller);
    }

    removeController(controller) {
      super.removeController(controller);
      const index = this.controllers.indexOf(controller);
      if (index > -1) {
        this.controllers.splice(index, 1);
      }
    }

    render() {
      return '';
    }
  }

  if (!customElements.get('test-host-element')) {
    customElements.define('test-host-element', TestHost);
  }

  return new TestHost();
};

/**
 * Waits for a controller to complete any async operations
 * @param {Object} controller - The controller instance
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Promise that resolves after timeout
 */
export const waitForController = async (controller, timeout = 0) => {
  if (timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  if (controller.host && controller.host.updateComplete) {
    await controller.host.updateComplete;
  }
};

/**
 * Asserts that a controller properly integrates with its host
 * @param {Object} controller - The controller instance
 * @param {Object} host - The host element
 */
export const assertControllerIntegration = (controller, host) => {
  expect(controller.host).to.equal(host);
  expect(host.addController).to.have.been.calledWith(controller);
};

/**
 * Creates test data for controller testing
 */
export const createTestData = {
  employee: () => ({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@example.com',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01',
    dateOfEmployment: '2020-01-01',
    department: 'Tech',
    position: 'Senior'
  }),

  employees: (count = 3) => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      firstName: `Employee${index + 1}`,
      lastName: `LastName${index + 1}`,
      emailAddress: `employee${index + 1}@example.com`,
      phoneNumber: `123456789${index}`,
      dateOfBirth: `199${index}-01-01`,
      dateOfEmployment: `202${index}-01-01`,
      department: index % 2 === 0 ? 'Tech' : 'Analytics',
      position: ['Junior', 'Medior', 'Senior'][index % 3]
    }));
  },

  formData: () => ({
    firstName: 'Test',
    lastName: 'User',
    emailAddress: 'test@example.com',
    phoneNumber: '1234567890',
    dateOfBirth: '1990-01-01',
    dateOfEmployment: '2020-01-01',
    department: 'Tech',
    position: 'Senior'
  })
};

/**
 * Mock Redux store for testing
 */
export const createMockStore = (initialState = {}) => {
  const store = {
    state: {
      employees: [],
      ...initialState
    },
    listeners: new Set(),
    
    getState() {
      return this.state;
    },
    
    dispatch(action) {
      // Mock dispatch - could be enhanced to actually process actions
      this.notifyListeners();
      return action;
    },
    
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    },
    
    setState(newState) {
      this.state = { ...this.state, ...newState };
      this.notifyListeners();
    },
    
    notifyListeners() {
      this.listeners.forEach(listener => listener());
    }
  };

  return store;
};

/**
 * Spies on console methods for testing logging behavior
 */
export const spyConsole = () => {
  const originalConsole = { ...console };
  const consoleSpy = {
    log: sinon.spy(),
    warn: sinon.spy(),
    error: sinon.spy(),
    info: sinon.spy()
  };

  // Replace console methods
  Object.assign(console, consoleSpy);

  return {
    consoleSpy,
    restore: () => Object.assign(console, originalConsole)
  };
};

export default {
  createMockHost,
  createRealHost,
  waitForController,
  assertControllerIntegration,
  createTestData,
  createMockStore,
  spyConsole
};