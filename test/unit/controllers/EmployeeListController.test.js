import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { EmployeeListController } from '../../../src/controllers/EmployeeListController.js';
import { createMockHost, createRealHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

/**
 * Unit tests for EmployeeListController
 * Tests list operations, search, pagination, and filtering functionality
 */
describe('EmployeeListController', () => {
  let controller;
  let mockHost;
  let requestUpdateSpy;

  beforeEach(() => {
    // Setup mock host
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    // Create controller
    controller = new EmployeeListController(mockHost);
  });

  afterEach(() => {
    // Reset all spies
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      expect(controller.host).to.equal(mockHost);
      expect(controller.employees).to.deep.equal([]);
      expect(controller.filteredEmployees).to.deep.equal([]);
      expect(controller.paginatedEmployees).to.deep.equal([]);
      expect(controller.searchQuery).to.equal('');
      expect(controller.currentPage).to.equal(1);
      expect(controller.pageSize).to.equal(10);
      expect(controller.totalPages).to.equal(0);
      assertControllerIntegration(controller, mockHost);
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle hostConnected', () => {
      // Test that hostConnected doesn't throw and sets up subscription
      expect(() => controller.hostConnected()).to.not.throw();
      expect(controller.unsubscribe).to.be.a('function');
    });

    it('should handle hostDisconnected without subscription', () => {
      // Should not throw when unsubscribe is undefined
      expect(() => controller.hostDisconnected()).to.not.throw();
    });

    it('should unsubscribe on hostDisconnected when subscription exists', () => {
      controller.hostConnected();
      const unsubscribeSpy = sinon.spy(controller, 'unsubscribe');
      
      controller.hostDisconnected();
      
      expect(unsubscribeSpy).to.have.been.calledOnce;
    });
  });

  describe('updateFilteredEmployees()', () => {
    beforeEach(() => {
      // Setup test employees
      controller.employees = [
        createTestData.employee(),
        { 
          id: 2, 
          firstName: 'Jane', 
          lastName: 'Smith', 
          emailAddress: 'jane@example.com',
          department: 'Analytics',
          position: 'Senior',
          phoneNumber: '987-654-3210'
        },
        {
          id: 3,
          firstName: 'Bob',
          lastName: 'Johnson',
          emailAddress: 'bob.johnson@example.com',
          department: 'Tech',
          position: 'Junior',
          phoneNumber: '555-123-4567'
        }
      ];
    });

    it('should return all employees when no search query', () => {
      controller.searchQuery = '';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(3);
      expect(controller.filteredEmployees).to.deep.equal(controller.employees);
    });

    it('should filter by first name', () => {
      controller.searchQuery = 'jane';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].firstName).to.equal('Jane');
    });

    it('should filter by last name', () => {
      controller.searchQuery = 'johnson';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].lastName).to.equal('Johnson');
    });

    it('should filter by email address', () => {
      controller.searchQuery = 'jane@example.com';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].emailAddress).to.equal('jane@example.com');
    });

    it('should filter by department', () => {
      controller.searchQuery = 'Analytics';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].department).to.equal('Analytics');
    });

    it('should filter by position', () => {
      controller.searchQuery = 'senior';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(2); // John (Senior) and Jane (Senior)
    });

    it('should filter by phone number', () => {
      controller.searchQuery = '987-654';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].phoneNumber).to.equal('987-654-3210');
    });

    it('should be case insensitive', () => {
      controller.searchQuery = 'JANE';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(1);
      expect(controller.filteredEmployees[0].firstName).to.equal('Jane');
    });

    it('should handle partial matches', () => {
      controller.searchQuery = 'jo';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(2); // John and Johnson
    });

    it('should return empty array for no matches', () => {
      controller.searchQuery = 'nonexistent';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(0);
    });

    it('should handle empty string query', () => {
      controller.searchQuery = '   ';
      controller.updateFilteredEmployees();
      
      expect(controller.filteredEmployees).to.have.length(3);
    });

    it('should handle employees with missing fields', () => {
      controller.employees = [
        { id: 1, firstName: 'John' }, // Missing other fields
        { id: 2, lastName: 'Smith' },
        { id: 3, emailAddress: 'test@example.com' }
      ];
      controller.searchQuery = 'john';
      
      expect(() => controller.updateFilteredEmployees()).to.not.throw();
      expect(controller.filteredEmployees).to.have.length(1);
    });
  });

  describe('updatePagination()', () => {
    beforeEach(() => {
      // Create 25 employees for pagination testing
      controller.employees = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        firstName: `Employee${i + 1}`,
        lastName: `LastName${i + 1}`,
        emailAddress: `employee${i + 1}@example.com`,
        department: i % 2 === 0 ? 'Tech' : 'Analytics',
        position: 'Senior',
        phoneNumber: `555-000-${String(i + 1).padStart(4, '0')}`
      }));
      controller.filteredEmployees = [...controller.employees];
    });

    it('should calculate total pages correctly', () => {
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.totalPages).to.equal(3); // 25 employees / 10 per page = 3 pages
    });

    it('should handle exact page size division', () => {
      controller.filteredEmployees = controller.employees.slice(0, 20); // Exactly 20 employees
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.totalPages).to.equal(2);
    });

    it('should paginate first page correctly', () => {
      controller.currentPage = 1;
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.paginatedEmployees).to.have.length(10);
      expect(controller.paginatedEmployees[0].id).to.equal(1);
      expect(controller.paginatedEmployees[9].id).to.equal(10);
    });

    it('should paginate middle page correctly', () => {
      controller.currentPage = 2;
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.paginatedEmployees).to.have.length(10);
      expect(controller.paginatedEmployees[0].id).to.equal(11);
      expect(controller.paginatedEmployees[9].id).to.equal(20);
    });

    it('should paginate last page correctly', () => {
      controller.currentPage = 3;
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.paginatedEmployees).to.have.length(5); // Only 5 employees on last page
      expect(controller.paginatedEmployees[0].id).to.equal(21);
      expect(controller.paginatedEmployees[4].id).to.equal(25);
    });

    it('should adjust current page if it exceeds total pages', () => {
      controller.currentPage = 5; // Too high
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.currentPage).to.equal(3); // Should be adjusted to max page
    });

    it('should handle empty filtered employees', () => {
      controller.filteredEmployees = [];
      controller.currentPage = 1;
      controller.updatePagination();
      
      expect(controller.totalPages).to.equal(0);
      expect(controller.paginatedEmployees).to.have.length(0);
    });

    it('should handle single page scenarios', () => {
      controller.filteredEmployees = controller.employees.slice(0, 5); // Only 5 employees
      controller.pageSize = 10;
      controller.updatePagination();
      
      expect(controller.totalPages).to.equal(1);
      expect(controller.paginatedEmployees).to.have.length(5);
    });
  });

  describe('setSearchQuery()', () => {
    beforeEach(() => {
      controller.employees = [createTestData.employee()];
    });

    it('should update search query and reset page', () => {
      controller.currentPage = 3;
      
      controller.setSearchQuery('john');
      
      expect(controller.searchQuery).to.equal('john');
      expect(controller.currentPage).to.equal(1);
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should handle empty search query', () => {
      controller.setSearchQuery('');
      
      expect(controller.searchQuery).to.equal('');
      expect(controller.currentPage).to.equal(1);
    });

    it('should call updateFilteredEmployees', () => {
      const updateSpy = sinon.spy(controller, 'updateFilteredEmployees');
      
      controller.setSearchQuery('test');
      
      expect(updateSpy).to.have.been.calledOnce;
    });
  });

  describe('clearSearch()', () => {
    it('should clear search query and reset page', () => {
      controller.searchQuery = 'previous search';
      controller.currentPage = 3;
      
      controller.clearSearch();
      
      expect(controller.searchQuery).to.equal('');
      expect(controller.currentPage).to.equal(1);
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should call updateFilteredEmployees', () => {
      const updateSpy = sinon.spy(controller, 'updateFilteredEmployees');
      
      controller.clearSearch();
      
      expect(updateSpy).to.have.been.calledOnce;
    });
  });

  describe('changePage()', () => {
    beforeEach(() => {
      controller.totalPages = 5;
      controller.currentPage = 2;
    });

    it('should change to valid page', () => {
      controller.changePage(3);
      
      expect(controller.currentPage).to.equal(3);
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should call updatePagination', () => {
      const paginationSpy = sinon.spy(controller, 'updatePagination');
      
      controller.changePage(3);
      
      expect(paginationSpy).to.have.been.calledOnce;
    });

    it('should not change to invalid page (too low)', () => {
      const originalPage = controller.currentPage;
      
      controller.changePage(0);
      
      expect(controller.currentPage).to.equal(originalPage);
    });

    it('should not change to invalid page (too high)', () => {
      const originalPage = controller.currentPage;
      
      controller.changePage(6);
      
      expect(controller.currentPage).to.equal(originalPage);
    });

    it('should accept first page', () => {
      controller.changePage(1);
      
      expect(controller.currentPage).to.equal(1);
    });

    it('should accept last page', () => {
      controller.changePage(5);
      
      expect(controller.currentPage).to.equal(5);
    });
  });

  describe('changePageSize()', () => {
    beforeEach(() => {
      controller.employees = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));
      controller.filteredEmployees = [...controller.employees];
      controller.currentPage = 3;
    });

    it('should change page size and reset to first page', () => {
      controller.changePageSize(5);
      
      expect(controller.pageSize).to.equal(5);
      expect(controller.currentPage).to.equal(1);
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should call updateFilteredEmployees', () => {
      const updateSpy = sinon.spy(controller, 'updateFilteredEmployees');
      
      controller.changePageSize(15);
      
      expect(updateSpy).to.have.been.calledOnce;
    });

    it('should handle larger page size than employee count', () => {
      controller.changePageSize(50);
      
      expect(controller.pageSize).to.equal(50);
    });
  });

  describe('Delete Operations', () => {
    it('should call deleteEmployee without errors', () => {
      // Test that the method exists and runs without throwing
      expect(() => controller.deleteEmployee(1)).to.not.throw();
    });

    it('should call bulkDeleteEmployees without errors', () => {
      const employeeIds = [1, 2, 3];
      
      expect(() => controller.bulkDeleteEmployees(employeeIds)).to.not.throw();
    });

    it('should handle empty bulk delete array', () => {
      expect(() => controller.bulkDeleteEmployees([])).to.not.throw();
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      // Setup for pagination calculations
      controller.filteredEmployees = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      controller.pageSize = 10;
      controller.currentPage = 2;
    });

    describe('startItem', () => {
      it('should calculate start item correctly for middle page', () => {
        expect(controller.startItem).to.equal(11); // Page 2, pageSize 10: (2-1)*10 + 1 = 11
      });

      it('should calculate start item for first page', () => {
        controller.currentPage = 1;
        expect(controller.startItem).to.equal(1);
      });

      it('should calculate start item for last page', () => {
        controller.currentPage = 3;
        expect(controller.startItem).to.equal(21); // Page 3, pageSize 10: (3-1)*10 + 1 = 21
      });
    });

    describe('endItem', () => {
      it('should calculate end item correctly for full page', () => {
        expect(controller.endItem).to.equal(20); // Page 2, pageSize 10: min(2*10, 25) = min(20, 25) = 20
      });

      it('should calculate end item for partial last page', () => {
        controller.currentPage = 3;
        expect(controller.endItem).to.equal(25); // Page 3: min(3*10, 25) = min(30, 25) = 25
      });

      it('should handle empty results', () => {
        controller.filteredEmployees = [];
        expect(controller.endItem).to.equal(0);
      });
    });

    describe('hasResults', () => {
      it('should return true when there are filtered employees', () => {
        expect(controller.hasResults).to.be.true;
      });

      it('should return false when no filtered employees', () => {
        controller.filteredEmployees = [];
        expect(controller.hasResults).to.be.false;
      });
    });

    describe('showNoResults', () => {
      it('should return true when searching but no results', () => {
        controller.searchQuery = 'nonexistent';
        controller.filteredEmployees = [];
        expect(controller.showNoResults).to.be.true;
      });

      it('should return false when not searching', () => {
        controller.searchQuery = '';
        controller.filteredEmployees = [];
        expect(controller.showNoResults).to.not.be.ok; // Empty string is falsy
      });

      it('should return false when searching and has results', () => {
        controller.searchQuery = 'john';
        controller.filteredEmployees = [{ id: 1 }];
        expect(controller.showNoResults).to.be.false;
      });
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(() => {
      // Setup realistic employee data
      controller.employees = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          emailAddress: 'john.doe@example.com',
          department: 'Tech',
          position: 'Senior',
          phoneNumber: '555-0001'
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          emailAddress: 'jane.smith@example.com',
          department: 'Analytics',
          position: 'Junior',
          phoneNumber: '555-0002'
        },
        {
          id: 3,
          firstName: 'Bob',
          lastName: 'Johnson',
          emailAddress: 'bob.johnson@example.com',
          department: 'Tech',
          position: 'Senior',
          phoneNumber: '555-0003'
        }
      ];
    });

    it('should handle complete search and pagination workflow', () => {
      // Start with all employees
      controller.updateFilteredEmployees();
      expect(controller.filteredEmployees).to.have.length(3);
      
      // Search for Tech department
      controller.setSearchQuery('Tech');
      expect(controller.filteredEmployees).to.have.length(2);
      expect(controller.currentPage).to.equal(1);
      
      // Change page size
      controller.changePageSize(1);
      expect(controller.pageSize).to.equal(1);
      expect(controller.totalPages).to.equal(2);
      
      // Navigate to second page
      controller.changePage(2);
      expect(controller.currentPage).to.equal(2);
      expect(controller.paginatedEmployees).to.have.length(1);
      
      // Clear search
      controller.clearSearch();
      expect(controller.searchQuery).to.equal('');
      expect(controller.filteredEmployees).to.have.length(3);
      expect(controller.currentPage).to.equal(1);
    });

    it('should handle edge case: search returns no results', () => {
      controller.setSearchQuery('nonexistent');
      
      expect(controller.filteredEmployees).to.have.length(0);
      expect(controller.paginatedEmployees).to.have.length(0);
      expect(controller.totalPages).to.equal(0);
      expect(controller.hasResults).to.be.false;
      expect(controller.showNoResults).to.be.true;
    });

    it('should handle real host integration', () => {
      const realHost = createRealHost();
      const realController = new EmployeeListController(realHost);
      
      expect(realController.host).to.be.instanceOf(LitElement);
      expect(realHost.updateComplete).to.be.a('promise');
    });

    it('should maintain state consistency during multiple operations', () => {
      // Initial state
      controller.updateFilteredEmployees();
      const initialFilteredCount = controller.filteredEmployees.length;
      
      // Apply search
      controller.setSearchQuery('john');
      const searchResults = controller.filteredEmployees.length;
      expect(searchResults).to.be.lessThan(initialFilteredCount);
      
      // Change page size should not affect filtered count
      controller.changePageSize(1);
      expect(controller.filteredEmployees.length).to.equal(searchResults);
      
      // Clear search should restore all employees
      controller.clearSearch();
      expect(controller.filteredEmployees.length).to.equal(initialFilteredCount);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined employees array', () => {
      controller.employees = undefined;
      
      expect(() => controller.updateFilteredEmployees()).to.throw();
    });

    it('should handle null search query', () => {
      controller.searchQuery = null;
      
      expect(() => controller.updateFilteredEmployees()).to.throw();
    });

    it('should handle negative page numbers', () => {
      controller.totalPages = 5;
      
      controller.changePage(-1);
      
      // Should not change from current page
      expect(controller.currentPage).to.equal(1);
    });

    it('should handle zero page size', () => {
      controller.changePageSize(0);
      
      expect(controller.pageSize).to.equal(0);
      // Division by zero in JavaScript with 0/0 results in NaN
      controller.filteredEmployees = [];
      controller.updatePagination();
      expect(controller.totalPages).to.be.NaN;
    });

    it('should handle very large page size', () => {
      controller.employees = [createTestData.employee()];
      controller.filteredEmployees = [...controller.employees];
      
      controller.changePageSize(10000);
      
      expect(controller.pageSize).to.equal(10000);
      controller.updatePagination();
      expect(controller.totalPages).to.equal(1);
      expect(controller.paginatedEmployees).to.have.length(1);
    });
  });
});