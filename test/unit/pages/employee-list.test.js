import { html, fixture, expect } from '@open-wc/testing';
import '../../../src/pages/employee-list.js';

describe('employee-list component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list></employee-list>`);
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