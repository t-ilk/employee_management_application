import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import './employee-detail-item.js';

export class EmployeeLeftColumn extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `;

  static properties = {
    employee: { type: Object }
  };

  constructor() {
    super();
    this.employee = {};
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

  render() {
    if (!this.employee) {
      return html``;
    }

    return html`
      <employee-detail-item 
        .label="${this.t('table.firstName')}" 
        .value="${this.employee.firstName || ''}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.dateOfEmployment')}" 
        .value="${this.formatDate(this.employee.dateOfEmployment)}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.phoneNumber')}" 
        .value="${this.formatPhoneNumber(this.employee.phoneNumber)}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.department')}" 
        .value="${this.getTranslatedDepartment(this.employee.department)}">
      </employee-detail-item>
    `;
  }
}

customElements.define('employee-left-column', EmployeeLeftColumn);