import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import './employee-table-row.js';

export class EmployeeTable extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      background-color: white;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      table-layout: auto; /* Allow flexible column sizing */
    }

    .employee-table th,
    .employee-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
      white-space: nowrap;
    }

    .employee-table th {
      background-color: #fafafa;
      font-weight: 600;
      font-size: 14px;
      color: #FF6200;
      border-bottom: 2px solid #f0f0f0;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .employee-table td {
      font-size: 14px;
      color: #333;
    }

    .employee-table tbody tr:hover {
      background-color: #fafafa;
    }

    .employee-table tbody tr:last-child td {
      border-bottom: none;
    }

    /* Flexible column widths that can shrink */
    .employee-table th:first-child,
    .employee-table td:first-child {
      width: 40px;
      min-width: 40px; /* Checkbox column - fixed minimum */
    }

    .employee-table th:nth-child(2),
    .employee-table td:nth-child(2),
    .employee-table th:nth-child(3),
    .employee-table td:nth-child(3) {
      width: 15%; /* Name columns - flexible percentage */
      min-width: 80px; /* Can shrink to 80px */
    }

    .employee-table th:nth-child(4),
    .employee-table td:nth-child(4),
    .employee-table th:nth-child(5),
    .employee-table td:nth-child(5) {
      width: 12%; /* Date columns - flexible */
      min-width: 90px; /* Can shrink to 90px */
    }

    .employee-table th:nth-child(6),
    .employee-table td:nth-child(6) {
      width: 12%; /* Phone column - flexible */
      min-width: 100px; /* Can shrink to 100px */
    }

    .employee-table th:nth-child(7),
    .employee-table td:nth-child(7) {
      width: 20%; /* Email column - most flexible */
      min-width: 120px; /* Can shrink to 120px */
    }

    .employee-table th:nth-child(8),
    .employee-table td:nth-child(8),
    .employee-table th:nth-child(9),
    .employee-table td:nth-child(9) {
      width: 12%; /* Department/Position - flexible */
      min-width: 90px; /* Can shrink to 90px */
    }

    .employee-table th:last-child,
    .employee-table td:last-child {
      width: 80px;
      min-width: 80px; /* Actions column - fixed minimum */
    }

    .select-all-checkbox,
    .row-checkbox {
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      accent-color: #FF6200;
    }

    .bulk-actions {
      background-color: #fff2eb;
      border: 1px solid #FF6200;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .bulk-actions.hidden {
      opacity: 0;
      height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    .selected-count {
      font-size: 14px;
      font-weight: 500;
      color: #FF6200;
    }

    .bulk-action-buttons {
      display: flex;
      gap: 8px;
    }

    .bulk-delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .bulk-delete-btn:hover {
      background-color: #c82333;
      transform: translateY(-1px);
    }

    .clear-selection-btn {
      background-color: transparent;
      color: #FF6200;
      border: 1px solid #FF6200;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .clear-selection-btn:hover {
      background-color: #FF6200;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    /* Large screens - table shrinks naturally with container */
    @media (min-width: 1200px) {
      .employee-table th,
      .employee-table td {
        padding: 16px;
      }
    }

    /* Medium screens - start compacting but still flexible */
    @media (min-width: 900px) and (max-width: 1199px) {
      .employee-table th,
      .employee-table td {
        padding: 14px;
        font-size: 14px;
      }
    }

    /* Tablet - more compact but still shrinking */
    @media (min-width: 700px) and (max-width: 899px) {
      .employee-table th,
      .employee-table td {
        padding: 12px;
        font-size: 13px;
      }

      /* Slightly reduce minimum widths for better shrinking */
      .employee-table th:nth-child(2),
      .employee-table td:nth-child(2),
      .employee-table th:nth-child(3),
      .employee-table td:nth-child(3) {
        min-width: 70px;
      }

      .employee-table th:nth-child(4),
      .employee-table td:nth-child(4),
      .employee-table th:nth-child(5),
      .employee-table td:nth-child(5) {
        min-width: 80px;
      }

      .employee-table th:nth-child(7),
      .employee-table td:nth-child(7) {
        min-width: 100px;
      }
    }

    /* Breakpoint where horizontal scrolling kicks in */
    @media (max-width: 699px) {
      .employee-table {
        min-width: 650px; /* Fixed minimum - forces horizontal scroll */
      }

      .employee-table th,
      .employee-table td {
        padding: 10px 8px;
        font-size: 12px;
      }

      .employee-table th {
        font-size: 11px;
      }

      /* Fixed minimum widths - no more shrinking */
      .employee-table th:nth-child(2),
      .employee-table td:nth-child(2),
      .employee-table th:nth-child(3),
      .employee-table td:nth-child(3) {
        width: 80px;
        min-width: 80px;
      }

      .employee-table th:nth-child(4),
      .employee-table td:nth-child(4),
      .employee-table th:nth-child(5),
      .employee-table td:nth-child(5) {
        width: 90px;
        min-width: 90px;
      }

      .employee-table th:nth-child(6),
      .employee-table td:nth-child(6) {
        width: 100px;
        min-width: 100px;
      }

      .employee-table th:nth-child(7),
      .employee-table td:nth-child(7) {
        width: 120px;
        min-width: 120px;
      }

      .employee-table th:nth-child(8),
      .employee-table td:nth-child(8),
      .employee-table th:nth-child(9),
      .employee-table td:nth-child(9) {
        width: 90px;
        min-width: 90px;
      }

      .employee-table th:last-child,
      .employee-table td:last-child {
        width: 70px;
        min-width: 70px;
      }
    }

    /* Very small screens - even more compact but still scrollable */
    @media (max-width: 480px) {
      .employee-table th,
      .employee-table td {
        padding: 8px 6px;
        font-size: 11px;
      }

      .employee-table th {
        font-size: 10px;
      }
    }
  `;

  static properties = {
    employees: { type: Array },
    selectedEmployees: { type: Array }
  };

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
  }

  handleRowDelete(event) {
    const employee = event.detail.employee;
    // Re-dispatch event to parent component without confirmation
    // The parent component will handle the modal confirmation
    this.dispatchEvent(new CustomEvent('employee-delete', {
      detail: { employee },
      bubbles: true
    }));
  }

  handleRowEdit(event) {
    const employee = event.detail.employee;
    // Re-dispatch event to parent component
    this.dispatchEvent(new CustomEvent('employee-edit', {
      detail: { employee },
      bubbles: true
    }));
  }

  handleSelectAll(event) {
    if (event.target.checked) {
      this.selectedEmployees = [...this.employees.map(emp => emp.id)];
    } else {
      this.selectedEmployees = [];
    }
    this.requestUpdate();
  }

  handleRowSelect(event) {
    const employeeId = event.detail.employeeId;
    const isSelected = event.detail.isSelected;
    
    if (isSelected) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(id => id !== employeeId);
    }
    this.requestUpdate();
  }

  handleBulkDelete() {
    if (this.selectedEmployees.length > 0) {
      this.dispatchEvent(new CustomEvent('bulk-delete', {
        detail: { employeeIds: this.selectedEmployees },
        bubbles: true
      }));
    }
  }

  handleClearSelection() {
    this.selectedEmployees = [];
    this.requestUpdate();
  }

  // Public method to clear selection (called from parent component)
  clearSelection() {
    this.selectedEmployees = [];
    this.requestUpdate();
  }

  // Clean up selection when employees list changes
  updated(changedProperties) {
    if (changedProperties.has('employees') && this.employees) {
      // Remove deleted employee IDs from selection
      const existingEmployeeIds = this.employees.map(emp => emp.id);
      this.selectedEmployees = this.selectedEmployees.filter(id => 
        existingEmployeeIds.includes(id)
      );
    }
  }

  get isAllSelected() {
    return this.employees.length > 0 && this.selectedEmployees.length === this.employees.length;
  }

  get isIndeterminate() {
    return this.selectedEmployees.length > 0 && this.selectedEmployees.length < this.employees.length;
  }

  render() {
    if (this.employees.length === 0) {
      return html`
        <div class="empty-state">
          <p>${this.t('employeeList.noEmployees')} <a href="/add">${this.t('employeeList.addFirst')}</a></p>
        </div>
      `;
    }

    return html`
      <!-- Bulk Actions Bar -->
      <div class="bulk-actions ${this.selectedEmployees.length === 0 ? 'hidden' : ''}">
        <span class="selected-count">
          ${this.t('table.selectedCount', { count: this.selectedEmployees.length })}
        </span>
        <div class="bulk-action-buttons">
          <button class="clear-selection-btn" @click="${this.handleClearSelection}">
            ${this.t('table.clearSelection')}
          </button>
          <button class="bulk-delete-btn" @click="${this.handleBulkDelete}">
            ${this.t('table.deleteSelected')}
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="employee-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  class="select-all-checkbox" 
                  .checked="${this.isAllSelected}"
                  .indeterminate="${this.isIndeterminate}"
                  @change="${this.handleSelectAll}"
                />
              </th>
              <th>${this.t('table.firstName')}</th>
              <th>${this.t('table.lastName')}</th>
              <th>${this.t('table.dateOfEmployment')}</th>
              <th>${this.t('table.dateOfBirth')}</th>
              <th>${this.t('table.phoneNumber')}</th>
              <th>${this.t('table.emailAddress')}</th>
              <th>${this.t('table.department')}</th>
              <th>${this.t('table.position')}</th>
              <th>${this.t('table.actions')}</th>
            </tr>
          </thead>
          <tbody 
            @employee-row-delete="${this.handleRowDelete}" 
            @employee-row-edit="${this.handleRowEdit}"
            @employee-row-select="${this.handleRowSelect}"
          >
            ${this.employees.map(employee => html`
              <employee-table-row 
                .employee="${employee}"
                .isSelected="${this.selectedEmployees.includes(employee.id)}"
              ></employee-table-row>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);