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

  it('should have onBeforeEnter method', () => {
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      const elementClass = customElements.get('employee-edit-page');
      const instance = new elementClass();
      expect(instance.onBeforeEnter).to.be.a('function');
    });
  });

  it('should have render method', () => {
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      const elementClass = customElements.get('employee-edit-page');
      const instance = new elementClass();
      expect(instance.render).to.be.a('function');
    });
  });

  it('should call onBeforeEnter method with location', () => {
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      const elementClass = customElements.get('employee-edit-page');
      const instance = new elementClass();
      const mockLocation = { params: { id: '123' } };
      
      // Should not throw when calling the method
      expect(() => instance.onBeforeEnter(mockLocation)).to.not.throw;
    });
  });

  it('should call render method', () => {
    return import('../../../src/pages/employee-edit-page.js').then(() => {
      const elementClass = customElements.get('employee-edit-page');
      const instance = new elementClass();
      
      // Should not throw when calling render
      expect(() => instance.render()).to.not.throw;
    });
  });
});