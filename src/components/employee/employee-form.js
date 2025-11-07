import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import { EmployeeFormController } from '../../controllers/EmployeeFormController.js';
import { ConfirmationModalController } from '../../controllers/ConfirmationModalController.js';
import '../ui/modal-dialog.js';
import './employee-form-fields.js';

export class EmployeeForm extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      color: #FF6200;
      font-size: 24px;
      font-weight: 600;
    }

    /* Tablet and larger */
    @media (min-width: 768px) {
      :host {
        padding: 32px;
      }
      
      .header {
        margin-bottom: 32px;
      }
      
      h1 {
        font-size: 28px;
      }
    }

    /* Desktop responsive */
    @media (min-width: 1024px) {
      h1 {
        font-size: 32px;
      }
    }
  `;

  static properties = {
    mode: { type: String },
    employeeId: { type: String }
  };

  constructor() {
    super();
    this.mode = 'add';
    this.employeeId = null;
    
    // Initialize controllers
    this.formController = new EmployeeFormController(this, this.mode);
    this.modalController = new ConfirmationModalController(this);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    
    // Update controller when properties change, but avoid triggering during initial render
    if (this.hasUpdated && (changedProperties.has('mode') || changedProperties.has('employeeId'))) {
      this.formController.setMode(this.mode, this.employeeId);
    }
  }

  // Event handlers that delegate to controllers
  handleFormInput(event) {
    const { field, value } = event.detail;
    this.formController.updateField(field, value);
  }

  handleFormSubmit(event) {
    if (!this.formController.validateForm((key, params) => this.t(key, params))) {
      this.requestUpdate(); // Force re-render to show validation errors
      return;
    }

    if (this.formController.isEditMode) {
      // Show confirmation modal for edit
      this.modalController.showConfirmation(() => this.formController.saveEmployee());
    } else {
      // Direct save for new employee
      this.formController.saveEmployee();
    }
  }

  handleFormCancel() {
    this.formController.cancelForm();
  }

  handleConfirmModalConfirm() {
    this.modalController.executeConfirmedAction();
  }

  handleConfirmModalCancel() {
    this.modalController.hideConfirmation();
  }

  get pageTitle() {
    return this.formController.isAddMode
      ? this.t('page.addEmployee')
      : this.t('page.editEmployee');
  }

  get submitButtonText() {
    return this.formController.isAddMode
      ? this.t('button.addEmployee')
      : this.t('button.save');
  }

  get editInfoText() {
    if (this.formController.isEditMode && this.formController.formData.firstName && this.formController.formData.lastName) {
      return this.t('employeeEdit.editingEmployee', { 
        name: `${this.formController.formData.firstName} ${this.formController.formData.lastName}` 
      });
    }
    return '';
  }

  render() {
    return html`
      <div class="header">
        <h1>${this.pageTitle}</h1>
      </div>

      <employee-form-fields
        .formData="${this.formController.formData}"
        .errors="${this.formController.errors}"
        .departments="${this.formController.departments}"
        .positions="${this.formController.positions}"
        .submitButtonText="${this.submitButtonText}"
        .showEditInfo="${this.formController.isEditMode}"
        .editInfoText="${this.editInfoText}"
        @form-input="${this.handleFormInput}"
        @form-submit="${this.handleFormSubmit}"
        @form-cancel="${this.handleFormCancel}">
      </employee-form-fields>

      <modal-dialog 
        .open="${this.modalController.showConfirmModal}"
        .title="${this.t('employeeEdit.confirmTitle')}"
        .message="${this.t('employeeEdit.confirmMessage', { 
          name: `${this.formController.formData.firstName} ${this.formController.formData.lastName}` 
        })}"
        .primaryLabel="${this.t('employeeEdit.saveChanges')}"
        .secondaryLabel="${this.t('employeeEdit.cancel')}"
        @modal-confirm="${this.handleConfirmModalConfirm}"
        @modal-cancel="${this.handleConfirmModalCancel}">
      </modal-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);