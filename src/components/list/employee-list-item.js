import { LitElement, html, css } from 'lit-element';
import { Router } from '@vaadin/router';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import '../employee/employee-left-column.js';
import '../employee/employee-right-column.js';

export class EmployeeListItem extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      background-color: white;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.2s ease;
      height: fit-content;
    }

    :host(:hover) {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }

    .employee-card {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100%;
    }

    .card-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      flex: 1;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      justify-content: flex-start;
    }

    .edit-btn, .delete-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 100px;
      justify-content: center;
    }

    .button-icon {
      width: 16px;
      height: 16px;
      fill: currentColor; /* Use the button's text color */
    }

    .edit-btn {
      background-color: #6366f1;
      color: white;
      box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
    }

    .delete-btn {
      background-color: #FF6200;
      color: white;
      box-shadow: 0 2px 4px rgba(255, 98, 0, 0.2);
    }

    .edit-btn:hover {
      background-color: #5145db;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
    }

    .delete-btn:hover {
      background-color: #e55a00;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(255, 98, 0, 0.3);
    }

    @media (max-width: 768px) {
      .card-content {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      
      .actions {
        flex-direction: column;
        gap: 10px;
      }
      
      .edit-btn, .delete-btn {
        justify-content: center;
      }
    }
  `;

  static properties = {
    employee: { type: Object }
  };

  constructor() {
    super();
    this.employee = {};
  }

  handleEdit() {
    Router.go(`/edit/${this.employee.id}`);
  }

  handleDelete() {
    // Dispatch custom event to parent component
    this.dispatchEvent(new CustomEvent('employee-item-delete', {
      detail: { employee: this.employee },
      bubbles: true
    }));
  }

  render() {
    if (!this.employee) {
      return html``;
    }

    return html`
      <div class="employee-card">
        <!-- Two Column Layout -->
        <div class="card-content">
          <!-- Left Column -->
          <employee-left-column .employee="${this.employee}"></employee-left-column>
          
          <!-- Right Column -->
          <employee-right-column .employee="${this.employee}"></employee-right-column>
        </div>
        
        <!-- Action Buttons -->
        <div class="actions">
          <button class="edit-btn" @click="${this.handleEdit}">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
            </svg>
            ${this.t('button.edit')}
          </button>
          <button class="delete-btn" @click="${this.handleDelete}">
            <svg class="button-icon" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
            </svg>
            ${this.t('button.delete')}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list-item', EmployeeListItem);