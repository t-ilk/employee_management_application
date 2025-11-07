import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { ModalController } from '../../../src/controllers/ModalController.js';
import { createMockHost, createRealHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

/**
 * Unit tests for ModalController
 * Tests modal state management, open/close operations, and navigation
 */
describe('ModalController', () => {
  let controller;
  let mockHost;
  let requestUpdateSpy;

  beforeEach(() => {
    // Setup mock host
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    // Create controller
    controller = new ModalController(mockHost);
  });

  afterEach(() => {
    // Reset all spies
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      expect(controller.host).to.equal(mockHost);
      expect(controller.showDeleteModal).to.be.false;
      expect(controller.employeeToDelete).to.be.null;
      expect(controller.showEditModal).to.be.false;
      expect(controller.employeeToEdit).to.be.null;
      expect(controller.showBulkDeleteModal).to.be.false;
      expect(controller.employeeIdsToDelete).to.deep.equal([]);
      assertControllerIntegration(controller, mockHost);
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle hostConnected without errors', () => {
      expect(() => controller.hostConnected()).to.not.throw();
    });

    it('should handle hostDisconnected without errors', () => {
      expect(() => controller.hostDisconnected()).to.not.throw();
    });
  });

  describe('Delete Modal Operations', () => {
    let testEmployee;

    beforeEach(() => {
      testEmployee = createTestData.employee();
    });

    describe('openDeleteModal()', () => {
      it('should open delete modal with employee data', () => {
        controller.openDeleteModal(testEmployee);

        expect(controller.showDeleteModal).to.be.true;
        expect(controller.employeeToDelete).to.equal(testEmployee);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle opening modal with different employees', () => {
        const employee1 = { ...testEmployee, id: 1, firstName: 'John' };
        const employee2 = { ...testEmployee, id: 2, firstName: 'Jane' };

        controller.openDeleteModal(employee1);
        expect(controller.employeeToDelete).to.equal(employee1);

        controller.openDeleteModal(employee2);
        expect(controller.employeeToDelete).to.equal(employee2);
        expect(controller.showDeleteModal).to.be.true;
      });

      it('should handle opening modal multiple times', () => {
        controller.openDeleteModal(testEmployee);
        const firstCallCount = requestUpdateSpy.callCount;

        controller.openDeleteModal(testEmployee);
        expect(requestUpdateSpy.callCount).to.equal(firstCallCount + 1);
        expect(controller.showDeleteModal).to.be.true;
      });

      it('should handle null employee', () => {
        controller.openDeleteModal(null);

        expect(controller.showDeleteModal).to.be.true;
        expect(controller.employeeToDelete).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle undefined employee', () => {
        controller.openDeleteModal(undefined);

        expect(controller.showDeleteModal).to.be.true;
        expect(controller.employeeToDelete).to.be.undefined;
        expect(requestUpdateSpy).to.have.been.called;
      });
    });

    describe('closeDeleteModal()', () => {
      it('should close delete modal and reset employee data', () => {
        // First open a modal
        controller.openDeleteModal(testEmployee);
        expect(controller.showDeleteModal).to.be.true;
        expect(controller.employeeToDelete).to.equal(testEmployee);

        // Reset spy to count only close operations
        requestUpdateSpy.resetHistory();

        // Then close it
        controller.closeDeleteModal();

        expect(controller.showDeleteModal).to.be.false;
        expect(controller.employeeToDelete).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle closing modal when already closed', () => {
        expect(controller.showDeleteModal).to.be.false;

        controller.closeDeleteModal();

        expect(controller.showDeleteModal).to.be.false;
        expect(controller.employeeToDelete).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should reset employee data even if modal was not properly opened', () => {
        // Manually set employee without opening modal
        controller.employeeToDelete = testEmployee;

        controller.closeDeleteModal();

        expect(controller.employeeToDelete).to.be.null;
        expect(controller.showDeleteModal).to.be.false;
      });
    });
  });

  describe('Edit Modal Operations', () => {
    let testEmployee;

    beforeEach(() => {
      testEmployee = createTestData.employee();
    });

    describe('openEditModal()', () => {
      it('should open edit modal with employee data', () => {
        controller.openEditModal(testEmployee);

        expect(controller.showEditModal).to.be.true;
        expect(controller.employeeToEdit).to.equal(testEmployee);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle opening modal with different employees', () => {
        const employee1 = { ...testEmployee, id: 1, firstName: 'John' };
        const employee2 = { ...testEmployee, id: 2, firstName: 'Jane' };

        controller.openEditModal(employee1);
        expect(controller.employeeToEdit).to.equal(employee1);

        controller.openEditModal(employee2);
        expect(controller.employeeToEdit).to.equal(employee2);
        expect(controller.showEditModal).to.be.true;
      });

      it('should handle null employee', () => {
        controller.openEditModal(null);

        expect(controller.showEditModal).to.be.true;
        expect(controller.employeeToEdit).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });
    });

    describe('closeEditModal()', () => {
      it('should close edit modal and reset employee data', () => {
        // First open a modal
        controller.openEditModal(testEmployee);
        expect(controller.showEditModal).to.be.true;
        expect(controller.employeeToEdit).to.equal(testEmployee);

        // Reset spy to count only close operations
        requestUpdateSpy.resetHistory();

        // Then close it
        controller.closeEditModal();

        expect(controller.showEditModal).to.be.false;
        expect(controller.employeeToEdit).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle closing modal when already closed', () => {
        expect(controller.showEditModal).to.be.false;

        controller.closeEditModal();

        expect(controller.showEditModal).to.be.false;
        expect(controller.employeeToEdit).to.be.null;
        expect(requestUpdateSpy).to.have.been.called;
      });
    });

    describe('confirmEdit()', () => {
      it('should close modal when employee exists (Router.go tested elsewhere)', () => {
        controller.openEditModal(testEmployee);

        // Test the modal closing behavior, Router.go is external dependency
        controller.confirmEdit();

        expect(controller.showEditModal).to.be.false;
        expect(controller.employeeToEdit).to.be.null;
      });

      it('should handle confirmEdit with null employee', () => {
        controller.openEditModal(null);

        controller.confirmEdit();

        // When employee is null, confirmEdit does nothing - modal stays open
        expect(controller.showEditModal).to.be.true;
        expect(controller.employeeToEdit).to.be.null;
      });

      it('should handle confirmEdit when no modal is open', () => {
        expect(controller.employeeToEdit).to.be.null;

        expect(() => controller.confirmEdit()).to.not.throw();

        // Should remain null since no employee was set
        expect(controller.employeeToEdit).to.be.null;
      });

      it('should handle employee without ID', () => {
        const employeeWithoutId = { firstName: 'John', lastName: 'Doe' };
        controller.openEditModal(employeeWithoutId);

        expect(() => controller.confirmEdit()).to.not.throw();
        expect(controller.showEditModal).to.be.false;
      });

      it('should handle employee with different ID types', () => {
        const employeeWithStringId = { ...testEmployee, id: 'abc123' };
        controller.openEditModal(employeeWithStringId);

        expect(() => controller.confirmEdit()).to.not.throw();
        expect(controller.showEditModal).to.be.false;
      });
    });
  });

  describe('Bulk Delete Modal Operations', () => {
    describe('openBulkDeleteModal()', () => {
      it('should open bulk delete modal with employee IDs', () => {
        const employeeIds = [1, 2, 3];

        controller.openBulkDeleteModal(employeeIds);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.equal(employeeIds);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle empty employee ID array', () => {
        const employeeIds = [];

        controller.openBulkDeleteModal(employeeIds);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.deep.equal([]);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle single employee ID', () => {
        const employeeIds = [1];

        controller.openBulkDeleteModal(employeeIds);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.deep.equal([1]);
      });

      it('should handle large array of employee IDs', () => {
        const employeeIds = Array.from({ length: 100 }, (_, i) => i + 1);

        controller.openBulkDeleteModal(employeeIds);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.equal(employeeIds);
        expect(controller.employeeIdsToDelete).to.have.length(100);
      });

      it('should handle null employee IDs array', () => {
        controller.openBulkDeleteModal(null);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.be.null;
      });

      it('should handle different ID types', () => {
        const mixedIds = [1, 'abc', 'def', 42];

        controller.openBulkDeleteModal(mixedIds);

        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.deep.equal(mixedIds);
      });
    });

    describe('closeBulkDeleteModal()', () => {
      it('should close bulk delete modal and reset employee IDs', () => {
        const employeeIds = [1, 2, 3];

        // First open a modal
        controller.openBulkDeleteModal(employeeIds);
        expect(controller.showBulkDeleteModal).to.be.true;
        expect(controller.employeeIdsToDelete).to.equal(employeeIds);

        // Reset spy to count only close operations
        requestUpdateSpy.resetHistory();

        // Then close it
        controller.closeBulkDeleteModal();

        expect(controller.showBulkDeleteModal).to.be.false;
        expect(controller.employeeIdsToDelete).to.deep.equal([]);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should handle closing modal when already closed', () => {
        expect(controller.showBulkDeleteModal).to.be.false;

        controller.closeBulkDeleteModal();

        expect(controller.showBulkDeleteModal).to.be.false;
        expect(controller.employeeIdsToDelete).to.deep.equal([]);
        expect(requestUpdateSpy).to.have.been.called;
      });

      it('should reset to empty array even if IDs were set manually', () => {
        // Manually set IDs without opening modal
        controller.employeeIdsToDelete = [1, 2, 3];

        controller.closeBulkDeleteModal();

        expect(controller.employeeIdsToDelete).to.deep.equal([]);
        expect(controller.showBulkDeleteModal).to.be.false;
      });
    });
  });

  describe('Computed Properties', () => {
    let testEmployee;

    beforeEach(() => {
      testEmployee = createTestData.employee();
    });

    describe('hasEmployeeToDelete', () => {
      it('should return true when employee is set', () => {
        controller.employeeToDelete = testEmployee;
        expect(controller.hasEmployeeToDelete).to.be.true;
      });

      it('should return false when employee is null', () => {
        controller.employeeToDelete = null;
        expect(controller.hasEmployeeToDelete).to.be.false;
      });

      it('should return true when employee is undefined', () => {
        controller.employeeToDelete = undefined;
        expect(controller.hasEmployeeToDelete).to.be.true;
      });

      it('should return true when employee is empty object', () => {
        controller.employeeToDelete = {};
        expect(controller.hasEmployeeToDelete).to.be.true;
      });

      it('should update when employee changes', () => {
        expect(controller.hasEmployeeToDelete).to.be.false;

        controller.openDeleteModal(testEmployee);
        expect(controller.hasEmployeeToDelete).to.be.true;

        controller.closeDeleteModal();
        expect(controller.hasEmployeeToDelete).to.be.false;
      });
    });

    describe('hasEmployeeToEdit', () => {
      it('should return true when employee is set', () => {
        controller.employeeToEdit = testEmployee;
        expect(controller.hasEmployeeToEdit).to.be.true;
      });

      it('should return false when employee is null', () => {
        controller.employeeToEdit = null;
        expect(controller.hasEmployeeToEdit).to.be.false;
      });

      it('should return true when employee is undefined', () => {
        controller.employeeToEdit = undefined;
        expect(controller.hasEmployeeToEdit).to.be.true;
      });

      it('should update when employee changes', () => {
        expect(controller.hasEmployeeToEdit).to.be.false;

        controller.openEditModal(testEmployee);
        expect(controller.hasEmployeeToEdit).to.be.true;

        controller.closeEditModal();
        expect(controller.hasEmployeeToEdit).to.be.false;
      });
    });

    describe('hasBulkDeleteEmployees', () => {
      it('should return true when employee IDs exist', () => {
        controller.employeeIdsToDelete = [1, 2, 3];
        expect(controller.hasBulkDeleteEmployees).to.be.true;
      });

      it('should return false when array is empty', () => {
        controller.employeeIdsToDelete = [];
        expect(controller.hasBulkDeleteEmployees).to.be.false;
      });

      it('should return true when array has single ID', () => {
        controller.employeeIdsToDelete = [1];
        expect(controller.hasBulkDeleteEmployees).to.be.true;
      });

      it('should update when employee IDs change', () => {
        expect(controller.hasBulkDeleteEmployees).to.be.false;

        controller.openBulkDeleteModal([1, 2, 3]);
        expect(controller.hasBulkDeleteEmployees).to.be.true;

        controller.closeBulkDeleteModal();
        expect(controller.hasBulkDeleteEmployees).to.be.false;
      });

      it('should handle null arrays gracefully', () => {
        controller.employeeIdsToDelete = null;
        expect(() => controller.hasBulkDeleteEmployees).to.throw();
      });

      it('should handle undefined arrays gracefully', () => {
        controller.employeeIdsToDelete = undefined;
        expect(() => controller.hasBulkDeleteEmployees).to.throw();
      });
    });
  });

  describe('Integration Scenarios', () => {
    let testEmployee;

    beforeEach(() => {
      testEmployee = createTestData.employee();
    });

    it('should handle multiple modal operations in sequence', () => {
      // Open delete modal
      controller.openDeleteModal(testEmployee);
      expect(controller.showDeleteModal).to.be.true;
      expect(controller.hasEmployeeToDelete).to.be.true;

      // Close delete modal and open edit modal
      controller.closeDeleteModal();
      expect(controller.showDeleteModal).to.be.false;
      expect(controller.hasEmployeeToDelete).to.be.false;

      controller.openEditModal(testEmployee);
      expect(controller.showEditModal).to.be.true;
      expect(controller.hasEmployeeToEdit).to.be.true;

      // Confirm edit (should close edit modal)
      controller.confirmEdit();
      expect(controller.showEditModal).to.be.false;
      expect(controller.hasEmployeeToEdit).to.be.false;
    });

    it('should handle concurrent modal states', () => {
      const employee1 = { ...testEmployee, id: 1 };
      const employee2 = { ...testEmployee, id: 2 };
      const employeeIds = [3, 4, 5];

      // Open all modals (they can be open simultaneously)
      controller.openDeleteModal(employee1);
      controller.openEditModal(employee2);
      controller.openBulkDeleteModal(employeeIds);

      expect(controller.showDeleteModal).to.be.true;
      expect(controller.showEditModal).to.be.true;
      expect(controller.showBulkDeleteModal).to.be.true;
      expect(controller.employeeToDelete).to.equal(employee1);
      expect(controller.employeeToEdit).to.equal(employee2);
      expect(controller.employeeIdsToDelete).to.equal(employeeIds);
    });

    it('should maintain state consistency during rapid operations', () => {
      const requestUpdateCallCount = () => requestUpdateSpy.callCount;
      const initialCallCount = requestUpdateCallCount();

      // Rapid open/close operations
      controller.openDeleteModal(testEmployee);
      controller.closeDeleteModal();
      controller.openEditModal(testEmployee);
      controller.closeEditModal();
      controller.openBulkDeleteModal([1, 2, 3]);
      controller.closeBulkDeleteModal();

      // Should have called requestUpdate for each operation
      expect(requestUpdateCallCount() - initialCallCount).to.equal(6);

      // All modals should be closed
      expect(controller.showDeleteModal).to.be.false;
      expect(controller.showEditModal).to.be.false;
      expect(controller.showBulkDeleteModal).to.be.false;

      // All employee data should be reset
      expect(controller.hasEmployeeToDelete).to.be.false;
      expect(controller.hasEmployeeToEdit).to.be.false;
      expect(controller.hasBulkDeleteEmployees).to.be.false;
    });

    it('should handle real host integration', () => {
      const realHost = createRealHost();
      const realController = new ModalController(realHost);

      expect(realController.host).to.be.instanceOf(LitElement);
      expect(realHost.updateComplete).to.be.a('promise');

      // Test basic operations with real host
      expect(() => {
        realController.openDeleteModal(testEmployee);
        realController.closeDeleteModal();
      }).to.not.throw();
    });
  });

  describe('Edge Cases', () => {
    it('should handle opening modal with extremely large employee data', () => {
      const largeEmployee = {
        ...createTestData.employee(),
        largeData: new Array(10000).fill('large data').join(' ')
      };

      expect(() => {
        controller.openDeleteModal(largeEmployee);
        controller.openEditModal(largeEmployee);
      }).to.not.throw();

      expect(controller.employeeToDelete).to.equal(largeEmployee);
      expect(controller.employeeToEdit).to.equal(largeEmployee);
    });

    it('should handle circular reference in employee data', () => {
      const circularEmployee = createTestData.employee();
      circularEmployee.self = circularEmployee;

      expect(() => {
        controller.openDeleteModal(circularEmployee);
        controller.openEditModal(circularEmployee);
      }).to.not.throw();
    });

    it('should handle extremely large bulk delete arrays', () => {
      const largeIdArray = new Array(1000).fill(0).map((_, i) => i);

      expect(() => {
        controller.openBulkDeleteModal(largeIdArray);
      }).to.not.throw();

      expect(controller.employeeIdsToDelete).to.have.length(1000);
      expect(controller.hasBulkDeleteEmployees).to.be.true;
    });

    it('should handle malformed employee objects', () => {
      const malformedEmployees = [
        { id: null },
        { id: undefined },
        { id: '' },
        { id: 0 },
        { id: false },
        { id: [] },
        { id: {} }
      ];

      malformedEmployees.forEach(employee => {
        expect(() => {
          controller.openDeleteModal(employee);
          controller.openEditModal(employee);
          if (controller.employeeToEdit) {
            controller.confirmEdit();
          }
        }).to.not.throw();
      });
    });
  });
});