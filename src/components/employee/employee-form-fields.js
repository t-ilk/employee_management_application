import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import '../forms/form-text-input.js';
import '../forms/form-date-input.js';
import '../forms/form-select.js';

export class EmployeeFormFields extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .form-container {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
    }

    .edit-info {
      margin: 0 0 24px 0;
      color: #374151;
      font-size: 15px;
      line-height: 1.4;
      font-weight: 500;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    /* Tablet and larger */
    @media (min-width: 768px) {
      .form-container {
        padding: 32px;
      }

      .edit-info {
        margin-bottom: 32px;
        font-size: 16px;
      }

      .form-grid {
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }
    }

    /* Desktop responsive */
    @media (min-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 28px;
      }
    }

    .form-actions {
      display: flex;
      flex-direction: column-reverse;
      gap: 12px;
      margin-top: 24px;
    }

    .submit-btn {
      background: linear-gradient(135deg, #FF6200 0%, #e55a00 100%);
      color: #ffffff;
      border: none;
      padding: 18px 36px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(255, 98, 0, 0.3);
      order: 1;
    }

    .submit-btn:hover {
      background: linear-gradient(135deg, #e55a00 0%, #cc5200 100%);
      box-shadow: 0 6px 20px rgba(255, 98, 0, 0.4);
      transform: translateY(-1px);
    }

    .cancel-btn {
      background-color: #f8fafc;
      color: #6b7280;
      border: 2px solid #e5e7eb;
      padding: 16px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      order: 2;
    }

    @media (min-width: 768px) {
      .form-actions {
        flex-direction: row;
        justify-content: flex-end;
      }

      .submit-btn {
        order: 2;
        padding: 14px 28px;
      }
      
      .cancel-btn {
        order: 1;
        padding: 14px 28px;
      }
    }

    .cancel-btn:hover {
      background-color: #f1f5f9;
      border-color: #d1d5db;
      transform: none;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 767px) {
      .form-actions {
        margin-top: 20px;
        gap: 10px;
      }
    }
  `;

  static properties = {
    formData: { type: Object },
    errors: { type: Object },
    departments: { type: Array },
    positions: { type: Array },
    submitButtonText: { type: String },
    showEditInfo: { type: Boolean },
    editInfoText: { type: String }
  };

  constructor() {
    super();
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.departments = [
      { key: 'Analytics', label: 'department.analytics' },
      { key: 'Tech', label: 'department.tech' }
    ];
    this.positions = [
      { key: 'Junior', label: 'position.junior' },
      { key: 'Medior', label: 'position.medior' },
      { key: 'Senior', label: 'position.senior' }
    ];
    this.submitButtonText = 'Submit';
    this.showEditInfo = false;
    this.editInfoText = '';
  }

  handleFieldChange(field, event) {
    const value = event.detail.value;
    this.dispatchEvent(new CustomEvent('form-input', {
      detail: { field, value },
      bubbles: true
    }));
  }

  handleInput(field, event) {
    const value = event.target.value;
    this.dispatchEvent(new CustomEvent('form-input', {
      detail: { field, value },
      bubbles: true
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('form-submit', {
      bubbles: true
    }));
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('form-cancel', {
      bubbles: true
    }));
  }

  render() {
    return html`
      <div class="form-container">
        ${this.showEditInfo ? html`
          <p class="edit-info">${this.editInfoText}</p>
        ` : ''}
        
        <form @submit="${this.handleSubmit}">
          <div class="form-grid">
            <form-text-input
              .label="${this.t('form.firstName')}"
              .value="${this.formData.firstName || ''}"
              .placeholder="${this.t('placeholder.firstName')}"
              id="firstName"
              .error="${this.errors.firstName || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('firstName', e)}">
            </form-text-input>

            <form-text-input
              .label="${this.t('form.lastName')}"
              .value="${this.formData.lastName || ''}"
              .placeholder="${this.t('placeholder.lastName')}"
              id="lastName"
              .error="${this.errors.lastName || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('lastName', e)}">
            </form-text-input>

            <form-date-input
              .label="${this.t('form.dateOfEmployment')}"
              .value="${this.formData.dateOfEmployment || ''}"
              id="dateOfEmployment"
              .error="${this.errors.dateOfEmployment || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('dateOfEmployment', e)}">
            </form-date-input>

            <form-date-input
              .label="${this.t('form.dateOfBirth')}"
              .value="${this.formData.dateOfBirth || ''}"
              id="dateOfBirth"
              .error="${this.errors.dateOfBirth || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('dateOfBirth', e)}">
            </form-date-input>

            <form-text-input
              .label="${this.t('form.phoneNumber')}"
              .value="${this.formData.phoneNumber || ''}"
              .placeholder="${this.t('placeholder.phoneNumber')}"
              id="phoneNumber"
              type="tel"
              .error="${this.errors.phoneNumber || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('phoneNumber', e)}">
            </form-text-input>

            <form-text-input
              .label="${this.t('form.emailAddress')}"
              .value="${this.formData.emailAddress || ''}"
              .placeholder="${this.t('placeholder.emailAddress')}"
              id="emailAddress"
              type="email"
              .error="${this.errors.emailAddress || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('emailAddress', e)}">
            </form-text-input>

            <form-select
              .label="${this.t('form.department')}"
              .value="${this.formData.department || ''}"
              .placeholder="${this.t('placeholder.selectDepartment')}"
              id="department"
              .options="${this.departments}"
              .error="${this.errors.department || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('department', e)}">
            </form-select>

            <form-select
              .label="${this.t('form.position')}"
              .value="${this.formData.position || ''}"
              .placeholder="${this.t('placeholder.selectPosition')}"
              id="position"
              .options="${this.positions}"
              .error="${this.errors.position || ''}"
              .required="${true}"
              @input-change="${(e) => this.handleFieldChange('position', e)}">
            </form-select>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">${this.submitButtonText}</button>
            <button type="button" class="cancel-btn" @click="${this.handleCancel}">
              ${this.t('button.cancel')}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form-fields', EmployeeFormFields);