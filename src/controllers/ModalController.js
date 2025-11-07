import { Router } from '@vaadin/router';

/**
 * Modal Controller - Handles modal state and actions
 * Following Lit's Reactive Controller pattern
 */
export class ModalController {
  constructor(host) {
    this.host = host;
    this.host.addController(this);
    
    // Modal states
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.showEditModal = false;
    this.employeeToEdit = null;
    this.showBulkDeleteModal = false;
    this.employeeIdsToDelete = [];
  }

  // Reactive Controller lifecycle methods
  hostConnected() {
    // No subscription needed for modal controller
  }

  hostDisconnected() {
    // No cleanup needed for modal controller
  }

  // Delete modal methods
  openDeleteModal(employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
    this.host.requestUpdate();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.host.requestUpdate();
  }

  // Edit modal methods
  openEditModal(employee) {
    this.employeeToEdit = employee;
    this.showEditModal = true;
    this.host.requestUpdate();
  }

  closeEditModal() {
    this.showEditModal = false;
    this.employeeToEdit = null;
    this.host.requestUpdate();
  }

  confirmEdit() {
    if (this.employeeToEdit) {
      Router.go(`/edit/${this.employeeToEdit.id}`);
      this.closeEditModal();
    }
  }

  // Bulk delete modal methods
  openBulkDeleteModal(employeeIds) {
    this.employeeIdsToDelete = employeeIds;
    this.showBulkDeleteModal = true;
    this.host.requestUpdate();
  }

  closeBulkDeleteModal() {
    this.showBulkDeleteModal = false;
    this.employeeIdsToDelete = [];
    this.host.requestUpdate();
  }

  // Computed properties
  get hasEmployeeToDelete() {
    return this.employeeToDelete !== null;
  }

  get hasEmployeeToEdit() {
    return this.employeeToEdit !== null;
  }

  get hasBulkDeleteEmployees() {
    return this.employeeIdsToDelete.length > 0;
  }
}