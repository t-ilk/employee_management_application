import { store } from '../store/store.js';
import { deleteEmployee } from '../store/actions.js';

/**
 * Employee List Controller - Handles business logic for employee list operations
 * Following Lit's Reactive Controller pattern
 */
export class EmployeeListController {
  constructor(host) {
    this.host = host;
    // Register this controller with the host element
    this.host.addController(this);
    
    // Initialize state
    this.employees = [];
    this.filteredEmployees = [];
    this.paginatedEmployees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalPages = 0;
  }

  // Reactive Controller lifecycle
  hostConnected() {
    // Subscribe to store changes when host connects
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.employees !== this.employees) {
        this.employees = state.employees;
        this.updateFilteredEmployees();
        this.host.requestUpdate();
      }
    });
    
    // Initial state load
    const state = store.getState();
    this.employees = state.employees;
    this.updateFilteredEmployees();
  }

  hostDisconnected() {
    // Clean up subscription when host disconnects
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Business logic methods
  updateFilteredEmployees() {
    if (this.searchQuery.trim() === '') {
      this.filteredEmployees = [...this.employees];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredEmployees = this.employees.filter(employee => {
        return (
          employee.firstName?.toLowerCase().includes(query) ||
          employee.lastName?.toLowerCase().includes(query) ||
          employee.emailAddress?.toLowerCase().includes(query) ||
          employee.department?.toLowerCase().includes(query) ||
          employee.position?.toLowerCase().includes(query) ||
          employee.phoneNumber?.includes(query)
        );
      });
    }
    
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);
    
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex);
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.updateFilteredEmployees();
    this.host.requestUpdate();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.updateFilteredEmployees();
    this.host.requestUpdate();
  }

  changePage(newPage) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePagination();
      this.host.requestUpdate();
    }
  }

  changePageSize(newPageSize) {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.updateFilteredEmployees();
    this.host.requestUpdate();
  }

  deleteEmployee(employeeId) {
    return store.dispatch(deleteEmployee(employeeId));
  }

  bulkDeleteEmployees(employeeIds) {
    employeeIds.forEach(id => {
      store.dispatch(deleteEmployee(id));
    });
  }

  // Computed properties
  get startItem() {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem() {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  get hasResults() {
    return this.filteredEmployees.length > 0;
  }

  get showNoResults() {
    return this.searchQuery && this.filteredEmployees.length === 0;
  }
}