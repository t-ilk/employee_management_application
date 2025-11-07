import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeTableRow extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: table-row;
    }

    :host(:hover) {
      background-color: #fafafa;
    }

    :host([selected]) {
      background-color: #fff2eb !important;
    }

    :host([selected]:hover) {
      background-color: #ffe6d6 !important;
    }

    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 0; /* Allow text-overflow to work */
    }

    /* Allow email and longer text to wrap if needed */
    td:nth-child(7) { /* Email column */
      white-space: normal;
      word-break: break-word;
      max-width: 0; /* Inherit from table column width */
    }

    .actions {
      display: flex;
      gap: 6px;
      justify-content: center;
    }

    .edit-btn, .delete-btn {
      padding: 6px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      transition: all 0.2s ease;
      background-color: transparent;
    }

    .edit-btn:hover {
      background-color: #fff2eb;
      transform: scale(1.1);
    }

    .delete-btn:hover {
      background-color: #fff2eb;
      transform: scale(1.1);
    }

    .edit-btn svg, .delete-btn svg {
      width: 16px;
      height: 16px;
    }

    .row-checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      accent-color: #FF6200;
    }

    /* Large screens - full size */
    @media (min-width: 1200px) {
      td {
        padding: 16px;
        font-size: 14px;
      }

      .edit-btn, .delete-btn {
        width: 32px;
        height: 32px;
        padding: 8px;
      }

      .edit-btn svg, .delete-btn svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Medium screens - slightly smaller */
    @media (min-width: 900px) and (max-width: 1199px) {
      td {
        padding: 14px;
        font-size: 14px;
      }

      .edit-btn, .delete-btn {
        width: 30px;
        height: 30px;
        padding: 7px;
      }

      .edit-btn svg, .delete-btn svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Tablet - more compact but still shrinking */
    @media (min-width: 700px) and (max-width: 899px) {
      td {
        padding: 12px;
        font-size: 13px;
      }

      .actions {
        gap: 6px;
      }

      .edit-btn, .delete-btn {
        width: 28px;
        height: 28px;
        padding: 6px;
      }

      .edit-btn svg, .delete-btn svg {
        width: 16px;
        height: 16px;
      }
    }

    /* Breakpoint where horizontal scrolling kicks in */
    @media (max-width: 699px) {
      td {
        padding: 10px 8px;
        font-size: 12px;
      }

      .actions {
        gap: 4px;
      }

      .edit-btn, .delete-btn {
        width: 26px;
        height: 26px;
        padding: 5px;
      }

      .edit-btn svg, .delete-btn svg {
        width: 14px;
        height: 14px;
      }

      .row-checkbox {
        width: 14px;
        height: 14px;
      }
    }

    /* Very small screens - most compact */
    @media (max-width: 480px) {
      td {
        padding: 8px 6px;
        font-size: 11px;
      }

      .actions {
        gap: 2px;
      }

      .edit-btn, .delete-btn {
        width: 24px;
        height: 24px;
        padding: 4px;
      }

      .edit-btn svg, .delete-btn svg {
        width: 12px;
        height: 12px;
      }

      .row-checkbox {
        width: 12px;
        height: 12px;
      }
    }
  `;

  static properties = {
    employee: { type: Object },
    isSelected: { type: Boolean }
  };

  constructor() {
    super();
    this.employee = {};
    this.isSelected = false;
  }

  handleEdit() {
    Router.go(`/edit/${this.employee.id}`);
  }

  handleDelete() {
    // Dispatch custom event to parent component
    this.dispatchEvent(new CustomEvent('employee-row-delete', {
      detail: { employee: this.employee },
      bubbles: true
    }));
  }

  handleSelect(event) {
    this.dispatchEvent(new CustomEvent('employee-row-select', {
      detail: { 
        employeeId: this.employee.id, 
        isSelected: event.target.checked 
      },
      bubbles: true
    }));
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatPhoneNumber(phone) {
    if (!phone) return '';
    // Format phone number (assuming US format)
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }

  getTranslatedDepartment(department) {
    if (!department) return '';
    const deptKey = `department.${department.toLowerCase()}`;
    return this.t(deptKey);
  }

  getTranslatedPosition(position) {
    if (!position) return '';
    const posKey = `position.${position.toLowerCase()}`;
    return this.t(posKey);
  }

  render() {
    if (!this.employee) {
      return html``;
    }

    // Update the host attribute to reflect selection state
    this.toggleAttribute('selected', this.isSelected);

    return html`
      <td>
        <input 
          type="checkbox" 
          class="row-checkbox" 
          .checked="${this.isSelected}"
          @change="${this.handleSelect}"
        />
      </td>
      <td>${this.employee.firstName || ''}</td>
      <td>${this.employee.lastName || ''}</td>
      <td>${this.formatDate(this.employee.dateOfEmployment)}</td>
      <td>${this.formatDate(this.employee.dateOfBirth)}</td>
      <td>${this.formatPhoneNumber(this.employee.phoneNumber)}</td>
      <td>${this.employee.emailAddress || ''}</td>
      <td>${this.getTranslatedDepartment(this.employee.department)}</td>
      <td>${this.getTranslatedPosition(this.employee.position)}</td>
      <td>
        <div class="actions">
          <button class="edit-btn" @click="${this.handleEdit}" title="${this.t('button.edit')}">
            <svg width="16" height="16" viewBox="0 -960 960 960" fill="#FF6200">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
            </svg>
          </button>
          <button class="delete-btn" @click="${this.handleDelete}" title="${this.t('button.delete')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF6200">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
            </svg>
          </button>
        </div>
      </td>
    `;
  }
}

customElements.define('employee-table-row', EmployeeTableRow);