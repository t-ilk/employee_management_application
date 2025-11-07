import { html, fixture, expect } from '@open-wc/testing';
import '../../../src/pages/employee-add-page.js';

describe('employee-add-page component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-add-page></employee-add-page>`);
  });

  it('should render correctly', () => {
    expect(element).to.exist;
    expect(element.shadowRoot).to.exist;
  });

  it('should contain an employee-form component', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm).to.exist;
  });

  it('should set employee-form mode to "add"', () => {
    const employeeForm = element.shadowRoot.querySelector('employee-form');
    expect(employeeForm.getAttribute('mode')).to.equal('add');
  });

  it('should be a custom element', () => {
    expect(customElements.get('employee-add-page')).to.exist;
    expect(element).to.be.instanceOf(customElements.get('employee-add-page'));
  });

  it('should have the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('employee-add-page');
  });
});