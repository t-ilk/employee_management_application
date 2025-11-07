import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import '../ui/modal-dialog.js';

export class EmployeeListModals extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  static properties = {
    showDeleteModal: { type: Boolean },
    employeeToDelete: { type: Object },
    showEditModal: { type: Boolean },
    employeeToEdit: { type: Object },
    showBulkDeleteModal: { type: Boolean },
    employeeIdsToDelete: { type: Array }
  };

  constructor() {
    super();
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.showEditModal = false;
    this.employeeToEdit = null;
    this.showBulkDeleteModal = false;
    this.employeeIdsToDelete = [];
  }

  handleDeleteConfirm() {
    this.dispatchEvent(new CustomEvent('delete-confirm', {
      detail: { employee: this.employeeToDelete },
      bubbles: true
    }));
  }

  handleDeleteCancel() {
    this.dispatchEvent(new CustomEvent('delete-cancel', {
      detail: {},
      bubbles: true
    }));
  }

  handleEditConfirm() {
    this.dispatchEvent(new CustomEvent('edit-confirm', {
      detail: { employee: this.employeeToEdit },
      bubbles: true
    }));
  }

  handleEditCancel() {
    this.dispatchEvent(new CustomEvent('edit-cancel', {
      detail: {},
      bubbles: true
    }));
  }

  handleBulkDeleteConfirm() {
    this.dispatchEvent(new CustomEvent('bulk-delete-confirm', {
      detail: { employeeIds: this.employeeIdsToDelete },
      bubbles: true
    }));
  }

  handleBulkDeleteCancel() {
    this.dispatchEvent(new CustomEvent('bulk-delete-cancel', {
      detail: {},
      bubbles: true
    }));
  }

  render() {
    return html`
      <modal-dialog
        .open="${this.showDeleteModal}"
        .title="${this.t('employeeList.deleteConfirmTitle')}"
        .message="${this.employeeToDelete ? this.t('employeeList.deleteConfirmMessage', { 
          name: `${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName}` 
        }) : ''}"
        .primaryLabel="${this.t('employeeList.proceed')}"
        .secondaryLabel="${this.t('employeeList.cancel')}"
        @modal-confirm="${this.handleDeleteConfirm}"
        @modal-cancel="${this.handleDeleteCancel}"
      ></modal-dialog>

      <modal-dialog
        .open="${this.showEditModal}"
        .title="${this.t('employeeList.editConfirmTitle')}"
        .message="${this.employeeToEdit ? this.t('employeeList.editConfirmMessage', { 
          name: `${this.employeeToEdit.firstName} ${this.employeeToEdit.lastName}` 
        }) : ''}"
        .primaryLabel="${this.t('employeeList.proceed')}"
        .secondaryLabel="${this.t('employeeList.cancel')}"
        @modal-confirm="${this.handleEditConfirm}"
        @modal-cancel="${this.handleEditCancel}"
      ></modal-dialog>

      <modal-dialog
        .open="${this.showBulkDeleteModal}"
        .title="${this.t('employeeList.bulkDeleteConfirmTitle')}"
        .message="${this.employeeIdsToDelete.length > 0 ? this.t('employeeList.bulkDeleteConfirmMessage', { 
          count: this.employeeIdsToDelete.length 
        }) : ''}"
        .primaryLabel="${this.t('employeeList.proceed')}"
        .secondaryLabel="${this.t('employeeList.cancel')}"
        @modal-confirm="${this.handleBulkDeleteConfirm}"
        @modal-cancel="${this.handleBulkDeleteCancel}"
      ></modal-dialog>
    `;
  }
}

customElements.define('employee-list-modals', EmployeeListModals);