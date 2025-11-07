import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class FormTextInput extends LocalizationMixin(LitElement) {
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

    input {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
      transition: all 0.2s ease;
      background-color: #ffffff;
    }

    /* Tablet and larger */
    @media (min-width: 768px) {
      input {
        padding: 14px;
        font-size: 15px;
      }
      
      label {
        margin-bottom: 8px;
        font-size: 15px;
      }
    }

    input:focus {
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
    type: { type: String },
    id: { type: String },
    error: { type: String },
    required: { type: Boolean }
  };

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.type = 'text';
    this.id = '';
    this.error = '';
    this.required = false;
  }

  handleInput(event) {
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
        <input
          type="${this.type}"
          id="${this.id}"
          .value="${this.value || ''}"
          @input="${this.handleInput}"
          placeholder="${this.placeholder}"
        />
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('form-text-input', FormTextInput);