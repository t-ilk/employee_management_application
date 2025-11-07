import { html, fixture, expect } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import '../../../src/pages/employee-list.js';

describe('employee-list component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list></employee-list>`);
    
    // Mock controller methods to avoid errors and enable full execution
    if (element.modalController) {
      element.modalController.openDeleteModal = stub();
      element.modalController.closeDeleteModal = stub();
      element.modalController.openEditModal = stub();
      element.modalController.closeEditModal = stub();
      element.modalController.confirmEdit = stub();
      element.modalController.openBulkDeleteModal = stub();
      element.modalController.closeBulkDeleteModal = stub();
    }
    
    if (element.listController) {
      element.listController.deleteEmployee = stub();
      element.listController.bulkDeleteEmployees = stub();
      element.listController.setSearchQuery = stub();
      element.listController.clearSearch = stub();
      element.listController.changePage = stub();
      element.listController.changePageSize = stub();
    }
    
    if (element.viewController) {
      element.viewController.setViewMode = stub();
    }
  });

  it('should render correctly', () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('should contain a content wrapper', () => {
    const contentWrapper = element.shadowRoot.querySelector('.content-wrapper');
    expect(contentWrapper).to.exist;
  });

  it('should contain employee-list-header component', () => {
    const header = element.shadowRoot.querySelector('employee-list-header');
    expect(header).to.exist;
  });

  it('should contain employee-list-controls component', () => {
    const controls = element.shadowRoot.querySelector('employee-list-controls');
    expect(controls).to.exist;
  });

  it('should contain employee-list-results-info component', () => {
    const resultsInfo = element.shadowRoot.querySelector('employee-list-results-info');
    expect(resultsInfo).to.exist;
  });

  it('should contain employee-list-pagination component', () => {
    const pagination = element.shadowRoot.querySelector('employee-list-pagination');
    expect(pagination).to.exist;
  });

  it('should contain employee-list-modals component', () => {
    const modals = element.shadowRoot.querySelector('employee-list-modals');
    expect(modals).to.exist;
  });

  it('should initialize with controllers', () => {
    expect(element.listController).to.exist;
    expect(element.modalController).to.exist;
    expect(element.viewController).to.exist;
  });

  it('should have event handler methods', () => {
    expect(element.handleEmployeeDelete).to.be.a('function');
    expect(element.handleEmployeeEdit).to.be.a('function');
    expect(element.handleBulkDelete).to.be.a('function');
    expect(element.handleSearchInputEvent).to.be.a('function');
    expect(element.handlePageChangeEvent).to.be.a('function');
    expect(element.handleViewModeChangeEvent).to.be.a('function');
  });

  it('should handle employee delete events with controller call', () => {
    const mockEvent = { detail: { employee: { id: '123', name: 'Test User' } } };
    element.handleEmployeeDelete(mockEvent);
    expect(element.modalController.openDeleteModal.calledWith(mockEvent.detail.employee)).to.be.true;
  });

  it('should handle employee edit events with controller call', () => {
    const mockEvent = { detail: { employee: { id: '123', name: 'Test User' } } };
    element.handleEmployeeEdit(mockEvent);
    expect(element.modalController.openEditModal.calledWith(mockEvent.detail.employee)).to.be.true;
  });

  it('should handle bulk delete events with controller call', () => {
    const mockEvent = { detail: { employeeIds: ['123', '456'] } };
    element.handleBulkDelete(mockEvent);
    expect(element.modalController.openBulkDeleteModal.calledWith(mockEvent.detail.employeeIds)).to.be.true;
  });

  it('should handle search input events with controller call', () => {
    const mockEvent = { detail: { value: 'test' } };
    element.handleSearchInputEvent(mockEvent);
    expect(element.listController.setSearchQuery.calledWith('test')).to.be.true;
  });

  it('should handle clear search events with controller call', () => {
    element.handleClearSearchEvent();
    expect(element.listController.clearSearch.calledOnce).to.be.true;
  });

  it('should handle page change events with controller call', () => {
    const mockEvent = { detail: { page: 2 } };
    element.handlePageChangeEvent(mockEvent);
    expect(element.listController.changePage.calledWith(2)).to.be.true;
  });

  it('should handle page size change events with controller call', () => {
    const mockEvent = { detail: { pageSize: 20 } };
    element.handlePageSizeChangeEvent(mockEvent);
    expect(element.listController.changePageSize.calledWith(20)).to.be.true;
  });

  it('should handle view mode change events with controller call', () => {
    const mockEvent = { detail: { viewMode: 'card' } };
    element.handleViewModeChangeEvent(mockEvent);
    expect(element.viewController.setViewMode.calledWith('card')).to.be.true;
  });

  it('should handle delete confirmation events with controller calls', () => {
    const mockEvent = { detail: { employee: { id: '123', name: 'Test User' } } };
    element.handleDeleteConfirmEvent(mockEvent);
    expect(element.listController.deleteEmployee.calledWith('123')).to.be.true;
    expect(element.modalController.closeDeleteModal.calledOnce).to.be.true;
  });

  it('should handle delete cancel events with controller call', () => {
    element.handleDeleteCancelEvent();
    expect(element.modalController.closeDeleteModal.calledOnce).to.be.true;
  });

  it('should handle edit confirmation events with controller call', () => {
    const mockEvent = { detail: { employee: { id: '123', name: 'Test User' } } };
    element.handleEditConfirmEvent(mockEvent);
    expect(element.modalController.confirmEdit.calledOnce).to.be.true;
  });

  it('should handle edit cancel events with controller call', () => {
    element.handleEditCancelEvent();
    expect(element.modalController.closeEditModal.calledOnce).to.be.true;
  });

  it('should handle bulk delete confirmation events with controller calls', () => {
    const mockEvent = { detail: { employeeIds: ['123', '456'] } };
    element.handleBulkDeleteConfirmEvent(mockEvent);
    expect(element.listController.bulkDeleteEmployees.calledWith(['123', '456'])).to.be.true;
    expect(element.modalController.closeBulkDeleteModal.calledOnce).to.be.true;
  });

  it('should handle bulk delete cancel events with controller call', () => {
    element.handleBulkDeleteCancelEvent();
    expect(element.modalController.closeBulkDeleteModal.calledOnce).to.be.true;
  });

  it('should be a custom element', () => {
    expect(customElements.get('employee-list')).to.exist;
    expect(element).to.be.instanceOf(customElements.get('employee-list'));
  });

  it('should have the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('employee-list');
  });

  it('should use LocalizationMixin', () => {
    expect(element.t).to.be.a('function');
  });
});