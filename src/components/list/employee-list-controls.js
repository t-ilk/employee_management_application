import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeListControls extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .controls-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .search-and-clear {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 1;
      min-width: 250px;
    }

    .search-input {
      flex: 1;
      max-width: 300px;
      padding: 8px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 16px; /* Prevent zoom on iOS */
      transition: all 0.2s ease;
      background-color: #fff;
      min-width: 0; /* Allow flex shrinking */
    }

    .search-input:focus {
      outline: none;
      border-color: #FF6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    .clear-btn {
      background-color: #f8f9fa;
      color: #666;
      padding: 8px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .clear-btn:hover:not(:disabled) {
      background-color: #e9ecef;
      border-color: #ced4da;
    }

    .clear-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Mobile First - Base styles for mobile */
    @media (max-width: 767px) {
      .controls-row {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
        margin: 0 15px;
      }

      .search-and-clear {
        flex-direction: column;
        min-width: 100%;
        gap: 10px;
      }

      .search-input {
        width: 100%;
        max-width: none;
        box-sizing: border-box;
      }

      .clear-btn {
        width: 100%;
        justify-content: center;
      }
    }

    /* Tablet styles */
    @media (min-width: 768px) and (max-width: 1023px) {
      .controls-row {
        flex-direction: row;
      }

      .search-and-clear {
        flex: 1;
        max-width: 400px;
      }
    }
  `;

  static properties = {
    searchQuery: { type: String }
  };

  constructor() {
    super();
    this.searchQuery = '';
  }

  handleSearchInput(event) {
    this.dispatchEvent(new CustomEvent('search-input', {
      detail: { value: event.target.value },
      bubbles: true
    }));
  }

  handleClearSearch() {
    this.dispatchEvent(new CustomEvent('clear-search', {
      detail: {},
      bubbles: true
    }));
  }

  render() {
    return html`
      <div class="controls-row">
        <div class="search-and-clear">
          <input
            type="text"
            class="search-input"
            .value="${this.searchQuery}"
            @input="${this.handleSearchInput}"
            placeholder="${this.t('employeeList.searchPlaceholder')}"
          />
          <button 
            class="clear-btn" 
            @click="${this.handleClearSearch}"
            ?disabled="${this.searchQuery === ''}"
          >
            ${this.t('employeeList.clearSearch')}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list-controls', EmployeeListControls);