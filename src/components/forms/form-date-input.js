import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class FormDateInput extends LocalizationMixin(LitElement) {
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

    input[type="date"] {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      font-family: inherit;
      transition: all 0.2s ease;
      background-color: #ffffff;
      position: relative;
    }

    /* Tablet and larger */
    @media (min-width: 768px) {
      input[type="date"] {
        padding: 14px;
        font-size: 15px;
      }
      
      label {
        margin-bottom: 8px;
        font-size: 15px;
      }
    }

    input[type="date"]:focus {
      outline: none;
      border-color: #FF6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    /* Orange calendar icons */
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.8;
      filter: invert(35%) sepia(100%) saturate(3000%) hue-rotate(15deg) brightness(100%) contrast(100%);
      transition: opacity 0.2s ease;
    }

    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    /* Firefox date input styling */
    input[type="date"]::-moz-calendar-picker-indicator {
      filter: invert(35%) sepia(100%) saturate(3000%) hue-rotate(15deg) brightness(100%) contrast(100%);
      opacity: 0.8;
      cursor: pointer;
    }

    /* Microsoft Edge date input styling */
    input[type="date"]::-ms-clear,
    input[type="date"]::-ms-reveal {
      filter: invert(35%) sepia(100%) saturate(3000%) hue-rotate(15deg) brightness(100%) contrast(100%);
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
    id: { type: String },
    error: { type: String },
    required: { type: Boolean }
  };

  constructor() {
    super();
    this.label = '';
    this.value = '';
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
          type="date"
          id="${this.id}"
          .value="${this.value || ''}"
          @input="${this.handleInput}"
        />
        ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      </div>
    `;
  }
}

customElements.define('form-date-input', FormDateInput);