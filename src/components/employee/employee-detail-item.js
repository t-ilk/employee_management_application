import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeDetailItem extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .detail-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 400;
      line-height: 1.4;
      min-height: 20px;
    }
  `;

  static properties = {
    label: { type: String },
    value: { type: String }
  };

  constructor() {
    super();
    this.label = '';
    this.value = '';
  }

  render() {
    return html`
      <span class="detail-label">${this.label}</span>
      <span class="detail-value">${this.value}</span>
    `;
  }
}

customElements.define('employee-detail-item', EmployeeDetailItem);