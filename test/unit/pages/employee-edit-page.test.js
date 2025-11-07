import { expect } from '@open-wc/testing';

describe('employee-edit-page component', () => {
  it('should be registered as a custom element', () => {
    // Just import the module to register the element
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      expect(customElements.get('employee-edit-page')).to.exist;
    });
  });

  it('should have the correct tag name registered', () => {
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      const elementClass = customElements.get('employee-edit-page');
      expect(elementClass).to.exist;
      expect(elementClass.name).to.equal('EmployeeEditPage');
    });
  });
});