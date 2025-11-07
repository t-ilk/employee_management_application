import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import './employee-list-item.js';

export class EmployeeListView extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .employee-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
      grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
      .employee-list {
        grid-template-columns: 1fr;
        gap: 15px;
      }
    }

    @media (min-width: 769px) and (max-width: 1200px) {
      .employee-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1201px) {
      .employee-list {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }
    }
  `;

  static properties = {
    employees: { type: Array }
  };

  constructor() {
    super();
    this.employees = [];
  }

  handleItemDelete(event) {
    const employee = event.detail.employee;
    // Re-dispatch event to parent component without confirmation
    // The parent component will handle the modal confirmation
    this.dispatchEvent(new CustomEvent('employee-delete', {
      detail: { employee },
      bubbles: true
    }));
  }

  handleItemEdit(event) {
    const employee = event.detail.employee;
    // Re-dispatch event to parent component
    this.dispatchEvent(new CustomEvent('employee-edit', {
      detail: { employee },
      bubbles: true
    }));
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
      <div class="employee-list" @employee-item-delete="${this.handleItemDelete}" @employee-item-edit="${this.handleItemEdit}">
        ${this.employees.map(employee => html`
          <employee-list-item .employee="${employee}"></employee-list-item>
        `)}
      </div>
    `;
  }
}

customElements.define('employee-list-view', EmployeeListView);