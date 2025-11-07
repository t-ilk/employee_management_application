import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';
import './employee-detail-item.js';

export class EmployeeRightColumn extends LocalizationMixin(LitElement) {
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

  getTranslatedPosition(position) {
    if (!position) return '';
    const posKey = `position.${position.toLowerCase()}`;
    return this.t(posKey);
  }

  getPositionClass(position) {
    return position ? position.toLowerCase() : '';
  }

  render() {
    if (!this.employee) {
      return html``;
    }

    return html`
      <employee-detail-item 
        .label="${this.t('table.lastName')}" 
        .value="${this.employee.lastName || ''}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.dateOfBirth')}" 
        .value="${this.formatDate(this.employee.dateOfBirth)}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.emailAddress')}" 
        .value="${this.employee.emailAddress || ''}">
      </employee-detail-item>
      
      <employee-detail-item 
        .label="${this.t('table.position')}" 
        .value="${this.getTranslatedPosition(this.employee.position)}">
      </employee-detail-item>
    `;
  }
}

customElements.define('employee-right-column', EmployeeRightColumn);