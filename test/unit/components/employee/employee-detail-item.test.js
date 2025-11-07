import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import sinon from 'sinon';
import '../../../../src/components/employee/employee-detail-item.js';
import { EmployeeDetailItem } from '../../../../src/components/employee/employee-detail-item.js';

describe('EmployeeDetailItem', () => {
  let element;
  let localStorageStub;

  beforeEach(async () => {
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    };
    sinon.stub(window, 'localStorage').value(localStorageStub);
    
    element = await fixture(html`<employee-detail-item></employee-detail-item>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Component Registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('employee-detail-item')).to.equal(EmployeeDetailItem);
    });

    it('should create an instance', () => {
      expect(element).to.be.instanceOf(EmployeeDetailItem);
    });
  });

  describe('Properties', () => {
    it('should have default empty properties', () => {
      expect(element.label).to.equal('');
      expect(element.value).to.equal('');
    });

    it('should update label property', async () => {
      element.label = 'Test Label';
      await elementUpdated(element);
      expect(element.label).to.equal('Test Label');
    });

    it('should update value property', async () => {
      element.value = 'Test Value';
      await elementUpdated(element);
      expect(element.value).to.equal('Test Value');
    });

    it('should update both properties together', async () => {
      element.label = 'Name';
      element.value = 'John Doe';
      await elementUpdated(element);
      
      expect(element.label).to.equal('Name');
      expect(element.value).to.equal('John Doe');
    });
  });

  describe('Rendering', () => {
    it('should render label and value elements', () => {
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement).to.exist;
      expect(valueElement).to.exist;
    });

    it('should render label text content', async () => {
      element.label = 'Employee Name';
      await elementUpdated(element);
      
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      expect(labelElement.textContent).to.equal('Employee Name');
    });

    it('should render value text content', async () => {
      element.value = 'Jane Smith';
      await elementUpdated(element);
      
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      expect(valueElement.textContent).to.equal('Jane Smith');
    });

    it('should update rendered content when properties change', async () => {
      element.label = 'Initial Label';
      element.value = 'Initial Value';
      await elementUpdated(element);
      
      element.label = 'Updated Label';
      element.value = 'Updated Value';
      await elementUpdated(element);
      
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement.textContent).to.equal('Updated Label');
      expect(valueElement.textContent).to.equal('Updated Value');
    });
  });

  describe('CSS Styles', () => {
    it('should apply correct CSS classes', () => {
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement.className).to.equal('detail-label');
      expect(valueElement.className).to.equal('detail-value');
    });

    it('should have host display flex styling', () => {
      const hostStyles = getComputedStyle(element);
      expect(hostStyles.display).to.equal('flex');
    });
  });

  describe('LocalizationMixin Integration', () => {
    it('should extend LocalizationMixin', () => {
      expect(element._handleLanguageChange).to.be.a('function');
    });

    it('should have localization methods available', () => {
      expect(element.t).to.be.a('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', async () => {
      element.label = '';
      element.value = '';
      await elementUpdated(element);
      
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement.textContent).to.equal('');
      expect(valueElement.textContent).to.equal('');
    });

    it('should handle null and undefined values', async () => {
      element.label = null;
      element.value = undefined;
      await elementUpdated(element);
      
      expect(element.label).to.be.null;
      expect(element.value).to.be.undefined;
    });

    it('should handle special characters', async () => {
      const specialLabel = 'Label with @#$%^&*()';
      const specialValue = 'Value with émojis 🚀 and ñoñó';
      
      element.label = specialLabel;
      element.value = specialValue;
      await elementUpdated(element);
      
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement.textContent).to.equal(specialLabel);
      expect(valueElement.textContent).to.equal(specialValue);
    });

    it('should handle very long text values', async () => {
      const longText = 'A'.repeat(1000);
      
      element.label = longText;
      element.value = longText;
      await elementUpdated(element);
      
      const labelElement = element.shadowRoot.querySelector('.detail-label');
      const valueElement = element.shadowRoot.querySelector('.detail-value');
      
      expect(labelElement.textContent).to.equal(longText);
      expect(valueElement.textContent).to.equal(longText);
    });

    it('should handle numeric values', async () => {
      element.label = 123;
      element.value = 456.78;
      await elementUpdated(element);
      
      expect(element.label).to.equal(123);
      expect(element.value).to.equal(456.78);
    });

    it('should handle boolean values', async () => {
      element.label = true;
      element.value = false;
      await elementUpdated(element);
      
      expect(element.label).to.be.true;
      expect(element.value).to.be.false;
    });
  });
});