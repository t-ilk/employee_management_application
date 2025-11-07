import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class EmployeeListPagination extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      gap: 4px;
      flex-wrap: wrap;
    }

    .pagination-btn {
      background-color: transparent;
      border: none;
      padding: 12px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      min-width: 44px; /* Touch-friendly */
      height: 44px;
      text-align: center;
    }

    .pagination-btn:hover:not(:disabled):not(.active) {
      background-color: #f8f9fa;
    }

    .pagination-btn:disabled {
      color: #ccc;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .pagination-btn.active {
      background-color: #FF6200;
      color: white;
      border-radius: 50%;
      padding: 8px 12px;
      min-width: 36px;
      height: 36px;
    }

    .pagination-nav {
      background-color: transparent;
      border: none;
      padding: 12px;
      cursor: pointer;
      color: #FF6200;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      min-width: 44px;
      height: 44px;
    }

    .pagination-nav:hover:not(:disabled) {
      background-color: #fff2eb;
      border-radius: 4px;
    }

    .pagination-nav:disabled {
      color: #ccc;
      cursor: not-allowed;
    }

    .pagination-ellipsis {
      padding: 0 8px;
      color: #666;
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    /* Mobile styles */
    @media (max-width: 767px) {
      .pagination {
        gap: 2px;
        margin-top: 15px;
      }

      .pagination-btn {
        padding: 8px 12px;
        font-size: 14px;
        min-width: 36px;
        height: 36px;
      }

      .pagination-btn.active {
        padding: 6px 10px;
        min-width: 32px;
        height: 32px;
      }

      .pagination-nav {
        padding: 8px;
        min-width: 36px;
        height: 36px;
      }

      .pagination-nav svg {
        width: 18px;
        height: 18px;
      }
    }

    /* Tablet styles */
    @media (min-width: 768px) and (max-width: 1023px) {
      .pagination {
        gap: 3px;
      }
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      .pagination {
        margin-top: 30px;
        gap: 4px;
      }
    }
  `;

  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number }
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 0;
  }

  handlePageChange(newPage) {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page: newPage },
      bubbles: true
    }));
  }

  getVisiblePageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page, excluding first and last if they're shown separately
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, this.currentPage + 2);
      
      // Adjust to avoid showing first page twice
      if (this.currentPage > 3) {
        startPage = Math.max(2, this.currentPage - 1);
      }
      
      // Adjust to avoid showing last page twice  
      if (this.currentPage < this.totalPages - 2) {
        endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      }
      
      // Ensure we show at least 3 pages in the middle
      const pageCount = endPage - startPage + 1;
      if (pageCount < 3) {
        if (startPage === 2) {
          endPage = Math.min(this.totalPages - 1, startPage + 2);
        } else if (endPage === this.totalPages - 1) {
          startPage = Math.max(2, endPage - 2);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  render() {
    if (this.totalPages <= 1) {
      return html``;
    }

    const visiblePages = this.getVisiblePageNumbers();

    return html`
      <div class="pagination">
        <button 
          class="pagination-nav"
          @click="${() => this.handlePageChange(this.currentPage - 1)}"
          ?disabled="${this.currentPage === 1}"
          title="${this.t('employeeList.previous')}"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        ${this.totalPages > 5 && this.currentPage > 3 ? html`
          <button 
            class="pagination-btn"
            @click="${() => this.handlePageChange(1)}"
          >
            1
          </button>
          <span class="pagination-ellipsis">...</span>
        ` : ''}

        ${visiblePages.map(page => html`
          <button 
            class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
            @click="${() => this.handlePageChange(page)}"
          >
            ${page}
          </button>
        `)}

        ${this.totalPages > 5 && this.currentPage < this.totalPages - 2 ? html`
          <span class="pagination-ellipsis">...</span>
          <button 
            class="pagination-btn"
            @click="${() => this.handlePageChange(this.totalPages)}"
          >
            ${this.totalPages}
          </button>
        ` : ''}

        <button 
          class="pagination-nav"
          @click="${() => this.handlePageChange(this.currentPage + 1)}"
          ?disabled="${this.currentPage === this.totalPages}"
          title="${this.t('employeeList.next')}"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    `;
  }
}

customElements.define('employee-list-pagination', EmployeeListPagination);