import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { ViewStateController } from '../../../src/controllers/ViewStateController.js';
import { createMockHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

/**
 * Unit tests for ViewStateController
 * Tests view state management, localStorage persistence, and computed properties
 */
describe('ViewStateController', () => {
  let controller;
  let mockHost;
  let requestUpdateSpy;
  let localStorageStub;

  beforeEach(() => {
    // Setup mock host
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    // Mock localStorage
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub(),
      clear: sinon.stub()
    };
    
    // Replace window localStorage
    sinon.replaceGetter(window, 'localStorage', () => localStorageStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with default table view mode', () => {
      controller = new ViewStateController(mockHost);
      
      expect(controller.host).to.equal(mockHost);
      expect(controller.viewMode).to.equal('table');
      assertControllerIntegration(controller, mockHost);
    });

    it('should initialize with custom view mode', () => {
      controller = new ViewStateController(mockHost, 'list');
      
      expect(controller.host).to.equal(mockHost);
      expect(controller.viewMode).to.equal('list');
      expect(mockHost.addController).to.have.been.calledWith(controller);
    });

    it('should handle different initial view modes', () => {
      const tableController = new ViewStateController(mockHost, 'table');
      expect(tableController.viewMode).to.equal('table');
      
      const listController = new ViewStateController(mockHost, 'list');
      expect(listController.viewMode).to.equal('list');
    });

    it('should register with host correctly', () => {
      controller = new ViewStateController(mockHost);
      expect(mockHost.addController).to.have.been.calledWith(controller);
    });

    it('should handle undefined initial view mode', () => {
      controller = new ViewStateController(mockHost, undefined);
      expect(controller.viewMode).to.equal('table'); // Default parameter kicks in when undefined
    });

    it('should handle null initial view mode', () => {
      controller = new ViewStateController(mockHost, null);
      expect(controller.viewMode).to.be.null; // Constructor assigns the value directly
    });

    it('should handle invalid initial view mode', () => {
      controller = new ViewStateController(mockHost, 'invalid');
      expect(controller.viewMode).to.equal('invalid'); // Constructor doesn't validate, just assigns
    });
  });

  describe('Lifecycle Methods', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
      requestUpdateSpy.resetHistory();
    });

    describe('hostConnected()', () => {
      it('should load valid view mode from localStorage', () => {
        localStorageStub.getItem.returns('list');
        
        controller.hostConnected();
        
        expect(localStorageStub.getItem).to.have.been.calledWith('employee-list-view-mode');
        expect(controller.viewMode).to.equal('list');
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should load table view mode from localStorage', () => {
        localStorageStub.getItem.returns('table');
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('table');
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should ignore invalid view mode from localStorage', () => {
        controller.viewMode = 'table';
        localStorageStub.getItem.returns('invalid');
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('table');
        expect(requestUpdateSpy).to.not.have.been.called;
      });

      it('should handle null value from localStorage', () => {
        controller.viewMode = 'table';
        localStorageStub.getItem.returns(null);
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('table');
        expect(requestUpdateSpy).to.not.have.been.called;
      });

      it('should handle undefined value from localStorage', () => {
        controller.viewMode = 'list';
        localStorageStub.getItem.returns(undefined);
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('list');
        expect(requestUpdateSpy).to.not.have.been.called;
      });

      it('should handle empty string from localStorage', () => {
        controller.viewMode = 'table';
        localStorageStub.getItem.returns('');
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('table');
        expect(requestUpdateSpy).to.not.have.been.called;
      });

      it('should handle localStorage getItem throwing error', () => {
        controller.viewMode = 'table';
        localStorageStub.getItem.throws(new Error('localStorage error'));
        
        expect(() => controller.hostConnected()).to.throw('localStorage error');
        expect(controller.viewMode).to.equal('table');
      });

      it('should preserve existing view mode when localStorage is empty', () => {
        controller.viewMode = 'list';
        localStorageStub.getItem.returns(null);
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('list');
      });

      it('should handle case sensitive view modes from localStorage', () => {
        controller.viewMode = 'table';
        localStorageStub.getItem.returns('Table'); // Capital T
        
        controller.hostConnected();
        
        expect(controller.viewMode).to.equal('table'); // Should remain unchanged
        expect(requestUpdateSpy).to.not.have.been.called;
      });
    });

    describe('hostDisconnected()', () => {
      it('should save view mode to localStorage on disconnect', () => {
        controller.viewMode = 'list';
        
        controller.hostDisconnected();
        
        expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'list');
      });

      it('should save table view mode to localStorage', () => {
        controller.viewMode = 'table';
        
        controller.hostDisconnected();
        
        expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
      });

      it('should handle localStorage setItem throwing error', () => {
        controller.viewMode = 'list';
        localStorageStub.setItem.throws(new Error('localStorage write error'));
        
        expect(() => controller.hostDisconnected()).to.throw('localStorage write error');
      });

      it('should save even invalid view modes to localStorage', () => {
        controller.viewMode = 'invalid';
        
        controller.hostDisconnected();
        
        expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'invalid');
      });

      it('should handle null view mode', () => {
        controller.viewMode = null;
        
        controller.hostDisconnected();
        
        expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', null);
      });

      it('should handle undefined view mode', () => {
        controller.viewMode = undefined;
        
        controller.hostDisconnected();
        
        expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', undefined);
      });
    });
  });

  describe('setViewMode()', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
      requestUpdateSpy.resetHistory();
      localStorageStub.setItem.resetHistory();
    });

    it('should set valid table view mode', () => {
      controller.setViewMode('table');
      
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should set valid list view mode', () => {
      controller.setViewMode('list');
      
      expect(controller.viewMode).to.equal('list');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'list');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should ignore invalid view mode', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode('invalid');
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
      expect(requestUpdateSpy).to.not.have.been.called;
    });

    it('should ignore null view mode', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode(null);
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
      expect(requestUpdateSpy).to.not.have.been.called;
    });

    it('should ignore undefined view mode', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode(undefined);
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
      expect(requestUpdateSpy).to.not.have.been.called;
    });

    it('should ignore empty string view mode', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode('');
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
      expect(requestUpdateSpy).to.not.have.been.called;
    });

    it('should ignore case variations of valid modes', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode('Table');
      expect(controller.viewMode).to.equal(originalMode);
      
      controller.setViewMode('LIST');
      expect(controller.viewMode).to.equal(originalMode);
      
      controller.setViewMode('List');
      expect(controller.viewMode).to.equal(originalMode);
      
      expect(localStorageStub.setItem).to.not.have.been.called;
      expect(requestUpdateSpy).to.not.have.been.called;
    });

    it('should handle multiple consecutive valid calls', () => {
      controller.setViewMode('list');
      controller.setViewMode('table');
      controller.setViewMode('list');
      
      expect(controller.viewMode).to.equal('list');
      expect(localStorageStub.setItem).to.have.been.calledThrice;
      expect(requestUpdateSpy).to.have.been.calledThrice;
    });

    it('should handle localStorage setItem throwing error', () => {
      localStorageStub.setItem.throws(new Error('localStorage error'));
      
      expect(() => controller.setViewMode('list')).to.throw('localStorage error');
    });

    it('should handle numeric view modes', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode(1);
      controller.setViewMode(0);
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
    });

    it('should handle boolean view modes', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode(true);
      controller.setViewMode(false);
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
    });

    it('should handle object view modes', () => {
      const originalMode = controller.viewMode;
      
      controller.setViewMode({ mode: 'table' });
      controller.setViewMode([]);
      
      expect(controller.viewMode).to.equal(originalMode);
      expect(localStorageStub.setItem).to.not.have.been.called;
    });
  });

  describe('toggleViewMode()', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
      requestUpdateSpy.resetHistory();
      localStorageStub.setItem.resetHistory();
    });

    it('should toggle from table to list view', () => {
      controller.viewMode = 'table';
      
      controller.toggleViewMode();
      
      expect(controller.viewMode).to.equal('list');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'list');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should toggle from list to table view', () => {
      controller.viewMode = 'list';
      
      controller.toggleViewMode();
      
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should handle multiple consecutive toggles', () => {
      controller.viewMode = 'table';
      
      controller.toggleViewMode(); // table -> list
      expect(controller.viewMode).to.equal('list');
      
      controller.toggleViewMode(); // list -> table
      expect(controller.viewMode).to.equal('table');
      
      controller.toggleViewMode(); // table -> list
      expect(controller.viewMode).to.equal('list');
      
      expect(localStorageStub.setItem).to.have.been.calledThrice;
      expect(requestUpdateSpy).to.have.been.calledThrice;
    });

    it('should handle invalid current view mode by defaulting to table', () => {
      controller.viewMode = 'invalid';
      
      controller.toggleViewMode();
      
      // Since current mode is not 'table', it should set to 'table'
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
    });

    it('should handle null current view mode', () => {
      controller.viewMode = null;
      
      controller.toggleViewMode();
      
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
    });

    it('should handle undefined current view mode', () => {
      controller.viewMode = undefined;
      
      controller.toggleViewMode();
      
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
    });

    it('should handle empty string current view mode', () => {
      controller.viewMode = '';
      
      controller.toggleViewMode();
      
      expect(controller.viewMode).to.equal('table');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
    });

    it('should handle rapid successive toggles', () => {
      controller.viewMode = 'table';
      const initialCallCount = requestUpdateSpy.callCount;
      
      for (let i = 0; i < 10; i++) {
        controller.toggleViewMode();
      }
      
      // After 10 toggles from table, should end up back at table
      expect(controller.viewMode).to.equal('table');
      expect(requestUpdateSpy.callCount - initialCallCount).to.equal(10);
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
    });

    describe('isTableView', () => {
      it('should return true when view mode is table', () => {
        controller.viewMode = 'table';
        expect(controller.isTableView).to.be.true;
      });

      it('should return false when view mode is list', () => {
        controller.viewMode = 'list';
        expect(controller.isTableView).to.be.false;
      });

      it('should return false for invalid view modes', () => {
        controller.viewMode = 'invalid';
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = null;
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = undefined;
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = '';
        expect(controller.isTableView).to.be.false;
      });

      it('should be case sensitive', () => {
        controller.viewMode = 'Table';
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = 'TABLE';
        expect(controller.isTableView).to.be.false;
      });

      it('should handle numeric view modes', () => {
        controller.viewMode = 0;
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = 1;
        expect(controller.isTableView).to.be.false;
      });

      it('should handle boolean view modes', () => {
        controller.viewMode = true;
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = false;
        expect(controller.isTableView).to.be.false;
      });

      it('should update dynamically when view mode changes', () => {
        controller.viewMode = 'list';
        expect(controller.isTableView).to.be.false;
        
        controller.viewMode = 'table';
        expect(controller.isTableView).to.be.true;
        
        controller.viewMode = 'list';
        expect(controller.isTableView).to.be.false;
      });
    });

    describe('isListView', () => {
      it('should return true when view mode is list', () => {
        controller.viewMode = 'list';
        expect(controller.isListView).to.be.true;
      });

      it('should return false when view mode is table', () => {
        controller.viewMode = 'table';
        expect(controller.isListView).to.be.false;
      });

      it('should return false for invalid view modes', () => {
        controller.viewMode = 'invalid';
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = null;
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = undefined;
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = '';
        expect(controller.isListView).to.be.false;
      });

      it('should be case sensitive', () => {
        controller.viewMode = 'List';
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = 'LIST';
        expect(controller.isListView).to.be.false;
      });

      it('should handle numeric view modes', () => {
        controller.viewMode = 0;
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = 1;
        expect(controller.isListView).to.be.false;
      });

      it('should handle boolean view modes', () => {
        controller.viewMode = true;
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = false;
        expect(controller.isListView).to.be.false;
      });

      it('should update dynamically when view mode changes', () => {
        controller.viewMode = 'table';
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = 'list';
        expect(controller.isListView).to.be.true;
        
        controller.viewMode = 'table';
        expect(controller.isListView).to.be.false;
      });

      it('should be mutually exclusive with isTableView', () => {
        controller.viewMode = 'table';
        expect(controller.isTableView).to.be.true;
        expect(controller.isListView).to.be.false;
        
        controller.viewMode = 'list';
        expect(controller.isTableView).to.be.false;
        expect(controller.isListView).to.be.true;
        
        controller.viewMode = 'invalid';
        expect(controller.isTableView).to.be.false;
        expect(controller.isListView).to.be.false;
      });
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
      requestUpdateSpy.resetHistory();
      localStorageStub.getItem.resetHistory();
      localStorageStub.setItem.resetHistory();
    });

    it('should handle complete lifecycle with localStorage persistence', () => {
      // Simulate saved state
      localStorageStub.getItem.returns('list');
      
      // Connect (load from localStorage)
      controller.hostConnected();
      expect(controller.viewMode).to.equal('list');
      expect(controller.isListView).to.be.true;
      
      // Toggle view mode
      controller.toggleViewMode();
      expect(controller.viewMode).to.equal('table');
      expect(controller.isTableView).to.be.true;
      
      // Disconnect (save to localStorage)
      controller.hostDisconnected();
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
    });

    it('should handle view mode changes with localStorage sync', () => {
      controller.setViewMode('list');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'list');
      
      controller.toggleViewMode();
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'table');
      
      controller.setViewMode('list');
      expect(localStorageStub.setItem).to.have.been.calledWith('employee-list-view-mode', 'list');
      
      expect(localStorageStub.setItem).to.have.been.calledThrice;
    });

    it('should handle rapid view mode changes', () => {
      const initialCallCount = requestUpdateSpy.callCount;
      
      controller.setViewMode('list');
      controller.setViewMode('table');
      controller.toggleViewMode();
      controller.toggleViewMode();
      controller.setViewMode('list');
      
      expect(requestUpdateSpy.callCount - initialCallCount).to.equal(5);
      expect(controller.viewMode).to.equal('list');
      expect(controller.isListView).to.be.true;
    });

    it('should work with mock host integration', () => {
      const mockHost2 = createMockHost();
      const testController = new ViewStateController(mockHost2, 'list');
      
      expect(testController.host).to.equal(mockHost2);
      expect(() => {
        testController.setViewMode('table');
        testController.toggleViewMode();
        testController.hostConnected();
        testController.hostDisconnected();
      }).to.not.throw();
      
      expect(testController.viewMode).to.equal('list');
      expect(testController.isListView).to.be.true;
    });

    it('should handle localStorage errors gracefully in complete workflow', () => {
      // Setup localStorage to work initially, then fail
      localStorageStub.getItem.returns('list');
      
      controller.hostConnected();
      expect(controller.viewMode).to.equal('list');
      
      // Make setItem fail for subsequent operations
      localStorageStub.setItem.throws(new Error('Storage quota exceeded'));
      
      expect(() => controller.setViewMode('table')).to.throw('Storage quota exceeded');
      expect(() => controller.hostDisconnected()).to.throw('Storage quota exceeded');
    });

    it('should maintain state consistency across operations', () => {
      // Start with table view
      expect(controller.viewMode).to.equal('table');
      expect(controller.isTableView).to.be.true;
      expect(controller.isListView).to.be.false;
      
      // Switch to list view
      controller.setViewMode('list');
      expect(controller.viewMode).to.equal('list');
      expect(controller.isTableView).to.be.false;
      expect(controller.isListView).to.be.true;
      
      // Toggle back to table
      controller.toggleViewMode();
      expect(controller.viewMode).to.equal('table');
      expect(controller.isTableView).to.be.true;
      expect(controller.isListView).to.be.false;
    });

    it('should handle controller lifecycle with different initial modes', () => {
      // Test with list initial mode
      const listController = new ViewStateController(mockHost, 'list');
      localStorageStub.getItem.returns('table');
      
      listController.hostConnected();
      expect(listController.viewMode).to.equal('table');
      expect(listController.isTableView).to.be.true;
      
      // Test with table initial mode
      const tableController = new ViewStateController(mockHost, 'table');
      localStorageStub.getItem.returns('list');
      
      tableController.hostConnected();
      expect(tableController.viewMode).to.equal('list');
      expect(tableController.isListView).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      controller = new ViewStateController(mockHost);
    });

    it('should handle concurrent view mode operations', () => {
      const operations = [
        () => controller.setViewMode('list'),
        () => controller.toggleViewMode(),
        () => controller.setViewMode('table'),
        () => controller.toggleViewMode(),
        () => controller.setViewMode('list')
      ];
      
      operations.forEach(op => op());
      
      expect(controller.viewMode).to.equal('list');
      expect(controller.isListView).to.be.true;
    });

    it('should handle view mode changes with different localStorage states', () => {
      // Test when localStorage.getItem returns different values
      const testValues = [null, undefined, '', 'invalid', 'table', 'list', 'Table', 'LIST'];
      
      testValues.forEach((value, index) => {
        const testController = new ViewStateController(mockHost);
        localStorageStub.getItem.returns(value);
        
        expect(() => testController.hostConnected()).to.not.throw();
        
        if (value === 'table' || value === 'list') {
          expect(testController.viewMode).to.equal(value);
        }
      });
    });

    it('should handle view mode property access without initialization', () => {
      const uninitializedController = Object.create(ViewStateController.prototype);
      
      expect(() => uninitializedController.isTableView).to.not.throw();
      expect(() => uninitializedController.isListView).to.not.throw();
      
      expect(uninitializedController.isTableView).to.be.false;
      expect(uninitializedController.isListView).to.be.false;
    });

    it('should handle localStorage quota exceeded scenarios', () => {
      localStorageStub.setItem.throws(new DOMException('Quota exceeded', 'QuotaExceededError'));
      
      expect(() => controller.setViewMode('list')).to.throw('Quota exceeded');
      expect(() => controller.hostDisconnected()).to.throw('Quota exceeded');
    });

    it('should handle localStorage disabled scenarios', () => {
      localStorageStub.getItem.throws(new Error('localStorage is not available'));
      localStorageStub.setItem.throws(new Error('localStorage is not available'));
      
      expect(() => controller.hostConnected()).to.throw('localStorage is not available');
      expect(() => controller.setViewMode('list')).to.throw('localStorage is not available');
      expect(() => controller.hostDisconnected()).to.throw('localStorage is not available');
    });

    it('should handle very long view mode strings', () => {
      const longString = 'a'.repeat(10000);
      
      controller.setViewMode(longString);
      expect(controller.viewMode).to.equal('table'); // Should remain unchanged
    });

    it('should handle special characters in view mode', () => {
      const specialValues = ['tab\tle', 'li\nst', 'table\r', 'list\0', 'table🎯', 'list-mode'];
      
      specialValues.forEach(value => {
        const originalMode = controller.viewMode;
        controller.setViewMode(value);
        expect(controller.viewMode).to.equal(originalMode);
      });
    });

    it('should handle repeated lifecycle calls', () => {
      localStorageStub.getItem.returns('list');
      
      // Multiple hostConnected calls
      controller.hostConnected();
      controller.hostConnected();
      controller.hostConnected();
      
      expect(controller.viewMode).to.equal('list');
      
      // Multiple hostDisconnected calls
      expect(() => {
        controller.hostDisconnected();
        controller.hostDisconnected();
        controller.hostDisconnected();
      }).to.not.throw();
      
      expect(localStorageStub.setItem).to.have.been.calledThrice;
    });

    it('should handle state mutations during operations', () => {
      // Simulate external mutation of viewMode during operation
      controller.viewMode = 'list';
      
      const originalSetViewMode = controller.setViewMode;
      controller.setViewMode = function(mode) {
        this.viewMode = 'corrupted'; // Simulate corruption
        return originalSetViewMode.call(this, mode);
      };
      
      controller.setViewMode('table');
      
      // The setViewMode should still work correctly despite the mutation
      expect(controller.viewMode).to.equal('table');
    });
  });
});