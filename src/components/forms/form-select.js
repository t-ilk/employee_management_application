import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class FormSelect extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }

    select {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
      transition: all 0.2s ease;
      background-color: #ffffff;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 16px;
      padding-right: 40px;
    }

    /* Tablet and larger */
    @media (min-width: 768px) {
      select {
        padding: 14px;
        font-size: 15px;
        padding-right: 36px;
        background-position: right 10px center;
      }
      
      label {
        margin-bottom: 8px;
        font-size: 15px;
      }
    }

    select:focus {
      outline: none;
      border-color: #FF6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .error {
      color: #ef4444;
      font-size: 14px;
      margin-top: 4px;
      font-weight: 500;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 767px) {
      .form-group {
        margin-bottom: 4px;
      }
    }
  `;

  static properties = {
    label: { type: String },
    value: { type: String },
    placeholder: { type: String },
    id: { type: String },
    error: { type: String },
    options: { type: Array },
    required: { type: Boolean }
  };

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.id = '';
    this.error = '';
    this.options = [];
    this.required = false;
  }

  handleChange(event) {
    const value = event.target.value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: { value },
      bubbles: true
    }));
  }

  render() {
    return html`
      <div class="form-group">
        <label for="${this.id}">${this.label}${this.required ? '*' : ''}</label>
        <select
          id="${this.id}"
          .value="${this.value || ''}"
          @change="${this.handleChange}"
        >
          ${this.placeholder ? html`<option value="">${this.placeholder}</option>` : ''}
          ${this.options.map(option => html`
            <option value="${option.key}" ?selected="${this.value === option.key}">
              ${this.t(option.label)}
            </option>
          `)}
        </select>
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('form-select', FormSelect);