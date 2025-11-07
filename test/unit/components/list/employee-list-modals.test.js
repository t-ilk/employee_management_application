import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-modals.js';

describe('employee-list-modals component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list-modals></employee-list-modals>`);
  });

  it('should render with default properties', () => {
    expect(element.showDeleteModal).to.be.false;
    expect(element.employeeToDelete).to.be.null;
    expect(element.showEditModal).to.be.false;
    expect(element.employeeToEdit).to.be.null;
    expect(element.showBulkDeleteModal).to.be.false;
    expect(element.employeeIdsToDelete).to.deep.equal([]);
  });

  it('should render three modal-dialog components', () => {
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    expect(modals).to.have.length(3);
  });

  it('should configure delete modal correctly', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    };
    
    element.showDeleteModal = true;
    element.employeeToDelete = mockEmployee;
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const deleteModal = modals[0];
    
    expect(deleteModal.open).to.be.true;
    expect(deleteModal.title).to.include('sure');
    expect(deleteModal.message).to.include('John Doe');
  });

  it('should configure edit modal correctly', async () => {
    const mockEmployee = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith'
    };
    
    element.showEditModal = true;
    element.employeeToEdit = mockEmployee;
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const editModal = modals[1];
    
    expect(editModal.open).to.be.true;
    expect(editModal.title).to.include('Edit');
    expect(editModal.message).to.include('Jane Smith');
  });

  it('should configure bulk delete modal correctly', async () => {
    element.showBulkDeleteModal = true;
    element.employeeIdsToDelete = [1, 2, 3];
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const bulkDeleteModal = modals[2];
    
    expect(bulkDeleteModal.open).to.be.true;
    expect(bulkDeleteModal.title).to.include('Multiple');
    expect(bulkDeleteModal.message).to.include('3');
  });

  it('should dispatch delete-confirm event on delete modal confirm', async () => {
    const mockEmployee = { id: 1, firstName: 'John', lastName: 'Doe' };
    element.employeeToDelete = mockEmployee;
    
    setTimeout(() => element.handleDeleteConfirm());
    
    const event = await oneEvent(element, 'delete-confirm');
    expect(event.type).to.equal('delete-confirm');
    expect(event.detail.employee).to.deep.equal(mockEmployee);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch delete-cancel event on delete modal cancel', async () => {
    setTimeout(() => element.handleDeleteCancel());
    
    const event = await oneEvent(element, 'delete-cancel');
    expect(event.type).to.equal('delete-cancel');
    expect(event.detail).to.deep.equal({});
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch edit-confirm event on edit modal confirm', async () => {
    const mockEmployee = { id: 2, firstName: 'Jane', lastName: 'Smith' };
    element.employeeToEdit = mockEmployee;
    
    setTimeout(() => element.handleEditConfirm());
    
    const event = await oneEvent(element, 'edit-confirm');
    expect(event.type).to.equal('edit-confirm');
    expect(event.detail.employee).to.deep.equal(mockEmployee);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch edit-cancel event on edit modal cancel', async () => {
    setTimeout(() => element.handleEditCancel());
    
    const event = await oneEvent(element, 'edit-cancel');
    expect(event.type).to.equal('edit-cancel');
    expect(event.detail).to.deep.equal({});
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch bulk-delete-confirm event on bulk delete modal confirm', async () => {
    const mockIds = [1, 2, 3, 4];
    element.employeeIdsToDelete = mockIds;
    
    setTimeout(() => element.handleBulkDeleteConfirm());
    
    const event = await oneEvent(element, 'bulk-delete-confirm');
    expect(event.type).to.equal('bulk-delete-confirm');
    expect(event.detail.employeeIds).to.deep.equal(mockIds);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch bulk-delete-cancel event on bulk delete modal cancel', async () => {
    setTimeout(() => element.handleBulkDeleteCancel());
    
    const event = await oneEvent(element, 'bulk-delete-cancel');
    expect(event.type).to.equal('bulk-delete-cancel');
    expect(event.detail).to.deep.equal({});
    expect(event.bubbles).to.be.true;
  });

  it('should handle modal confirm events from modal-dialog components', async () => {
    element.showDeleteModal = true;
    element.employeeToDelete = { id: 1, firstName: 'John', lastName: 'Doe' };
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const deleteModal = modals[0];
    
    setTimeout(() => {
      const modalEvent = new CustomEvent('modal-confirm', { bubbles: true });
      deleteModal.dispatchEvent(modalEvent);
    });
    
    const event = await oneEvent(element, 'delete-confirm');
    expect(event.detail.employee.id).to.equal(1);
  });

  it('should handle modal cancel events from modal-dialog components', async () => {
    element.showEditModal = true;
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const editModal = modals[1];
    
    setTimeout(() => {
      const modalEvent = new CustomEvent('modal-cancel', { bubbles: true });
      editModal.dispatchEvent(modalEvent);
    });
    
    const event = await oneEvent(element, 'edit-cancel');
    expect(event.type).to.equal('edit-cancel');
  });

  it('should handle empty employee data gracefully', async () => {
    element.showDeleteModal = true;
    element.employeeToDelete = null;
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const deleteModal = modals[0];
    
    expect(deleteModal.message).to.equal('');
  });

  it('should handle empty bulk delete list gracefully', async () => {
    element.showBulkDeleteModal = true;
    element.employeeIdsToDelete = [];
    await element.updateComplete;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    const bulkDeleteModal = modals[2];
    
    expect(bulkDeleteModal.message).to.equal('');
  });

  it('should update modal properties when data changes', async () => {
    // Initially closed
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    expect(modals[0].open).to.be.false;
    
    // Open delete modal
    element.showDeleteModal = true;
    element.employeeToDelete = { id: 1, firstName: 'Test', lastName: 'User' };
    await element.updateComplete;
    
    expect(modals[0].open).to.be.true;
    expect(modals[0].message).to.include('Test User');
    
    // Close delete modal
    element.showDeleteModal = false;
    await element.updateComplete;
    
    expect(modals[0].open).to.be.false;
  });

  it('should have proper CSS classes and structure', () => {
    const host = element.shadowRoot.host;
    expect(host).to.exist;
    
    const modals = element.shadowRoot.querySelectorAll('modal-dialog');
    modals.forEach(modal => {
      expect(modal.tagName.toLowerCase()).to.equal('modal-dialog');
    });
  });
});