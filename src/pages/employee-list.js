import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../mixins/LocalizationMixin.js';
import { EmployeeListController } from '../controllers/EmployeeListController.js';
import { ModalController } from '../controllers/ModalController.js';
import { ViewStateController } from '../controllers/ViewStateController.js';
import '../components/list/employee-table.js';
import '../components/list/employee-list-view.js';
import '../components/list/employee-list-header.js';
import '../components/list/employee-list-controls.js';
import '../components/list/employee-list-pagination.js';
import '../components/list/employee-list-results-info.js';
import '../components/list/employee-list-modals.js';

export class EmployeeList extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: block;
      padding: 15px;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }

    .content-wrapper {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .results-info {
      margin: 20px 0;
      padding: 20px;
      text-align: center;
      color: #666;
      font-style: italic;
    }

    /* Mobile First - Base styles for mobile */
    @media (max-width: 767px) {
      :host {
        padding: 10px;
      }

      .content-wrapper {
        padding: 15px;
      }
    }

    /* Tablet styles */
    @media (min-width: 768px) and (max-width: 1023px) {
      :host {
        padding: 15px;
      }

      .content-wrapper {
        padding: 20px;
      }
    }

    /* Desktop styles */
    @media (min-width: 1024px) {
      :host {
        padding: 20px;
      }

      .content-wrapper {
        padding: 24px;
      }
    }
  `;

  constructor() {
    super();
    
    this.listController = new EmployeeListController(this);
    this.modalController = new ModalController(this);
    this.viewController = new ViewStateController(this);
  }

  handleEmployeeDelete(event) {
    this.modalController.openDeleteModal(event.detail.employee);
  }

  handleDeleteConfirmEvent(event) {
    if (event.detail.employee) {
      this.listController.deleteEmployee(event.detail.employee.id);
      this.modalController.closeDeleteModal();
    }
  }

  handleDeleteCancelEvent() {
    this.modalController.closeDeleteModal();
  }

  handleEmployeeEdit(event) {
    this.modalController.openEditModal(event.detail.employee);
  }

  handleEditConfirmEvent(event) {
    if (event.detail.employee) {
      this.modalController.confirmEdit();
    }
  }

  handleEditCancelEvent() {
    this.modalController.closeEditModal();
  }

  handleBulkDelete(event) {
    this.modalController.openBulkDeleteModal(event.detail.employeeIds);
  }

  handleBulkDeleteConfirmEvent(event) {
    if (event.detail.employeeIds.length > 0) {
      this.listController.bulkDeleteEmployees(event.detail.employeeIds);
      this.modalController.closeBulkDeleteModal();
    }
  }

  handleBulkDeleteCancelEvent() {
    this.modalController.closeBulkDeleteModal();
  }

  handleSearchInputEvent(event) {
    this.listController.setSearchQuery(event.detail.value);
  }

  handleClearSearchEvent() {
    this.listController.clearSearch();
  }

  handlePageChangeEvent(event) {
    this.listController.changePage(event.detail.page);
  }

  handlePageSizeChangeEvent(event) {
    this.listController.changePageSize(event.detail.pageSize);
  }

  handleViewModeChangeEvent(event) {
    this.viewController.setViewMode(event.detail.viewMode);
  }

  render() {
    return html`
      <div class="content-wrapper">
        <employee-list-header 
          .viewMode="${this.viewController.viewMode}"
          @view-mode-change="${this.handleViewModeChangeEvent}">
        </employee-list-header>

        <employee-list-controls
          .searchQuery="${this.listController.searchQuery}"
          @search-input="${this.handleSearchInputEvent}"
          @clear-search="${this.handleClearSearchEvent}">
        </employee-list-controls>

        <employee-list-results-info
          .startItem="${this.listController.startItem}"
          .endItem="${this.listController.endItem}"
          .totalItems="${this.listController.filteredEmployees.length}"
          .pageSize="${this.listController.pageSize}"
          .showResults="${this.listController.hasResults}"
          @page-size-change="${this.handlePageSizeChangeEvent}">
        </employee-list-results-info>

        ${this.viewController.isTableView ? html`
        <employee-table 
          .employees="${this.listController.paginatedEmployees}"
          @employee-delete="${this.handleEmployeeDelete}"
          @employee-edit="${this.handleEmployeeEdit}"
          @bulk-delete="${this.handleBulkDelete}">
        </employee-table>
      ` : html`
        <employee-list-view 
          .employees="${this.listController.paginatedEmployees}"
          @employee-delete="${this.handleEmployeeDelete}"
          @employee-edit="${this.handleEmployeeEdit}">
        </employee-list-view>
        `}

        ${this.listController.showNoResults ? html`
        <div class="results-info">
          ${this.t('employeeList.noResults')}
        </div>
        ` : ''}

        <employee-list-pagination
          .currentPage="${this.listController.currentPage}"
          .totalPages="${this.listController.totalPages}"
          @page-change="${this.handlePageChangeEvent}">
        </employee-list-pagination>

        <employee-list-modals
          .showDeleteModal="${this.modalController.showDeleteModal}"
          .employeeToDelete="${this.modalController.employeeToDelete}"
          .showEditModal="${this.modalController.showEditModal}"
          .employeeToEdit="${this.modalController.employeeToEdit}"
          .showBulkDeleteModal="${this.modalController.showBulkDeleteModal}"
          .employeeIdsToDelete="${this.modalController.employeeIdsToDelete}"
          @delete-confirm="${this.handleDeleteConfirmEvent}"
          @delete-cancel="${this.handleDeleteCancelEvent}"
          @edit-confirm="${this.handleEditConfirmEvent}"
          @edit-cancel="${this.handleEditCancelEvent}"
          @bulk-delete-confirm="${this.handleBulkDeleteConfirmEvent}"
          @bulk-delete-cancel="${this.handleBulkDeleteCancelEvent}">
        </employee-list-modals>
      </div>
    `;
  }
}

customElements.define('employee-list', EmployeeList);