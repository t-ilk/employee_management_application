import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeListResultsInfo extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .results-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .results-info {
      margin-bottom: 15px;
      color: #666;
      font-size: 14px;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      flex-wrap: wrap;
    }

    .page-size-select {
      padding: 0px 10px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 16px;
      background-color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 32px;
    }

    .page-size-select:focus {
      outline: none;
      border-color: #FF6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }

    /* Mobile styles */
    @media (max-width: 767px) {
      .results-container {
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .page-size-selector {
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .results-info {
        text-align: center;
        font-size: 13px;
        margin-bottom: 10px;
      }
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      .results-info {
        margin-bottom: 20px;
      }
    }
  `;

  static properties = {
    startItem: { type: Number },
    endItem: { type: Number },
    totalItems: { type: Number },
    pageSize: { type: Number },
    showResults: { type: Boolean }
  };

  constructor() {
    super();
    this.startItem = 0;
    this.endItem = 0;
    this.totalItems = 0;
    this.pageSize = 10;
    this.showResults = false;
  }

  handlePageSizeChange(event) {
    this.dispatchEvent(new CustomEvent('page-size-change', {
      detail: { pageSize: parseInt(event.target.value) },
      bubbles: true
    }));
  }

  render() {
    if (!this.showResults) {
      return html``;
    }

    return html`
      <div class="results-container">
        <div class="results-info">
          ${this.t('employeeList.showingResults', { 
            start: this.startItem, 
            end: this.endItem, 
            total: this.totalItems 
          })}
        </div>
        
        <div class="page-size-selector">
          <span>${this.t('employeeList.itemsPerPage')}</span>
          <select 
            class="page-size-select" 
            .value="${this.pageSize.toString()}"
            @change="${this.handlePageSizeChange}"
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list-results-info', EmployeeListResultsInfo);