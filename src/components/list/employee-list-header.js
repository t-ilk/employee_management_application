import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeListHeader extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    h1 {
      margin: 0;
      color: #FF6200;
      font-size: 20px;
      font-weight: 600;
    }

    .view-toggle {
      display: flex;
      gap: 4px;
      background-color: transparent;
      border: none;
      border-radius: 6px;
      padding: 2px;
    }

    .view-toggle-btn {
      background-color: #f5f5f5;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      transition: all 0.2s ease;
      color: #999;
    }

    .view-toggle-btn:hover {
      background-color: #ebebeb;
      color: #666;
    }

    .view-toggle-btn.active {
      background-color: #FF6200;
      color: white;
    }

    .view-toggle-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* Mobile First - Base styles for mobile */
    @media (max-width: 767px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .header-left {
        justify-content: center;
      }

      h1 {
        font-size: 18px;
        text-align: center;
      }

      .view-toggle {
        align-self: center;
      }

      .view-toggle-btn {
        width: 40px;
        height: 40px;
      }

      .view-toggle-btn svg {
        width: 18px;
        height: 18px;
      }
    }

    /* Tablet styles */
    @media (min-width: 768px) and (max-width: 1023px) {
      h1 {
        font-size: 22px;
      }
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      h1 {
        font-size: 24px;
      }

      .header {
        margin-bottom: 24px;
      }
    }
  `;

  static properties = {
    viewMode: { type: String }
  };

  constructor() {
    super();
    this.viewMode = 'table';
  }

  handleViewModeChange(newViewMode) {
    this.dispatchEvent(new CustomEvent('view-mode-change', {
      detail: { viewMode: newViewMode },
      bubbles: true
    }));
  }

  render() {
    return html`
      <div class="header">
        <div class="header-left">
          <h1>${this.t('employeeList.title')}</h1>
        </div>
        <div class="view-toggle">
          <button 
            class="view-toggle-btn ${this.viewMode === 'table' ? 'active' : ''}"
            @click="${() => this.handleViewModeChange('table')}"
            title="${this.t('employeeList.tableView')}"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path>
            </svg>
          </button>
          <button 
            class="view-toggle-btn ${this.viewMode === 'list' ? 'active' : ''}"
            @click="${() => this.handleViewModeChange('list')}"
            title="${this.t('employeeList.listView')}"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 8h4V4H4zm6 12h4v-4h-4zm-6 0h4v-4H4zm0-6h4v-4H4zm6 0h4v-4h-4zm6-10v4h4V4zm-6 4h4V4h-4zm6 6h4v-4h-4zm0 6h4v-4h-4z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list-header', EmployeeListHeader);