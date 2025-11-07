import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { i18n } from '../../../../src/services/i18n.js';
import '../../../../src/components/forms/form-date-input.js';

describe('FormDateInput', () => {
  let localizationService;

  before(async () => {
    localizationService = i18n;
  });

  describe('Component Initialization', () => {
    it('should render with default properties', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      expect(element.label).to.equal('');
      expect(element.value).to.equal('');
      expect(element.id).to.equal('');
      expect(element.error).to.equal('');
      expect(element.required).to.be.false;
    });

    it('should have correct static properties defined', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      expect(element.constructor.properties.label).to.exist;
      expect(element.constructor.properties.label.type).to.equal(String);
      expect(element.constructor.properties.value).to.exist;
      expect(element.constructor.properties.value.type).to.equal(String);
      expect(element.constructor.properties.id).to.exist;
      expect(element.constructor.properties.id.type).to.equal(String);
      expect(element.constructor.properties.error).to.exist;
      expect(element.constructor.properties.error.type).to.equal(String);
      expect(element.constructor.properties.required).to.exist;
      expect(element.constructor.properties.required.type).to.equal(Boolean);
    });

    it('should be defined as custom element', async () => {
      expect(customElements.get('form-date-input')).to.exist;
    });
  });

  describe('Rendering and DOM Structure', () => {
    it('should render form group structure', async () => {
      const element = await fixture(html`<form-date-input label="Test Date"></form-date-input>`);
      
      const formGroup = element.shadowRoot.querySelector('.form-group');
      expect(formGroup).to.exist;
      
      const label = formGroup.querySelector('label');
      const input = formGroup.querySelector('input[type="date"]');
      
      expect(label).to.exist;
      expect(input).to.exist;
    });

    it('should render label with correct text', async () => {
      const element = await fixture(html`<form-date-input label="Birth Date"></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Birth Date');
    });

    it('should render label with required asterisk when required', async () => {
      const element = await fixture(html`<form-date-input label="Birth Date" required></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Birth Date*');
    });

    it('should render label without asterisk when not required', async () => {
      const element = await fixture(html`<form-date-input label="Birth Date"></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Birth Date');
    });

    it('should render input with correct type', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('date');
    });

    it('should set input id correctly', async () => {
      const element = await fixture(html`<form-date-input id="birth-date"></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      
      expect(label.getAttribute('for')).to.equal('birth-date');
      expect(input.id).to.equal('birth-date');
    });
  });

  describe('Value Handling', () => {
    it('should display initial value', async () => {
      const element = await fixture(html`<form-date-input value="2023-05-20"></form-date-input>`);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('2023-05-20');
    });

    it('should handle empty value', async () => {
      const element = await fixture(html`<form-date-input value=""></form-date-input>`);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('');
    });

    it('should handle null value', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      element.value = null;
      await elementUpdated(element);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('');
    });

    it('should handle undefined value', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      element.value = undefined;
      await elementUpdated(element);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('');
    });

    it('should update input when value property changes', async () => {
      const element = await fixture(html`<form-date-input value="2023-01-01"></form-date-input>`);
      
      element.value = '2023-12-31';
      await elementUpdated(element);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('2023-12-31');
    });
  });

  describe('Input Event Handling', () => {
    it('should handle input events and update value', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      const input = element.shadowRoot.querySelector('input');
      input.value = '2023-06-15';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(element.value).to.equal('2023-06-15');
    });

    it('should dispatch custom input-change event', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      let eventDetail = null;
      
      element.addEventListener('input-change', (event) => {
        eventDetail = event.detail;
      });
      
      const input = element.shadowRoot.querySelector('input');
      input.value = '2023-08-10';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(eventDetail).to.exist;
      expect(eventDetail.value).to.equal('2023-08-10');
    });

    it('should dispatch bubbling events', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      let eventCaught = false;
      
      element.addEventListener('input-change', (event) => {
        expect(event.bubbles).to.be.true;
        eventCaught = true;
      });
      
      const input = element.shadowRoot.querySelector('input');
      input.value = '2023-03-25';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(eventCaught).to.be.true;
    });

    it('should handle multiple input changes', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      const events = [];
      
      element.addEventListener('input-change', (event) => {
        events.push(event.detail.value);
      });
      
      const input = element.shadowRoot.querySelector('input');
      
      input.value = '2023-01-01';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      input.value = '2023-02-02';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      input.value = '2023-03-03';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(events).to.have.lengthOf(3);
      expect(events[0]).to.equal('2023-01-01');
      expect(events[1]).to.equal('2023-02-02');
      expect(events[2]).to.equal('2023-03-03');
    });
  });

  describe('Error Handling', () => {
    it('should not render error message when no error', async () => {
      const element = await fixture(html`<form-date-input label="Test"></form-date-input>`);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });

    it('should render error message when error exists', async () => {
      const element = await fixture(html`<form-date-input error="Invalid date"></form-date-input>`);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('Invalid date');
    });

    it('should update error message dynamically', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      let errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
      
      element.error = 'Date is required';
      await elementUpdated(element);
      
      errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('Date is required');
      
      element.error = '';
      await elementUpdated(element);
      
      errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });

    it('should handle empty string error', async () => {
      const element = await fixture(html`<form-date-input error=""></form-date-input>`);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });

    it('should handle null error', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      element.error = null;
      await elementUpdated(element);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });

    it('should handle error with special characters', async () => {
      const element = await fixture(html`<form-date-input error="Error: Date must be in format YYYY-MM-DD & valid!"></form-date-input>`);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('Error: Date must be in format YYYY-MM-DD & valid!');
    });
  });

  describe('Required Property', () => {
    it('should handle required property as boolean true', async () => {
      const element = await fixture(html`<form-date-input label="Date" required></form-date-input>`);
      
      expect(element.required).to.be.true;
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.include('*');
    });

    it('should handle required property as boolean false', async () => {
      const element = await fixture(html`<form-date-input label="Date"></form-date-input>`);
      
      expect(element.required).to.be.false;
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.not.include('*');
    });

    it('should update required indicator dynamically', async () => {
      const element = await fixture(html`<form-date-input label="Date"></form-date-input>`);
      

      let label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Date');
      
      element.required = true;
      await elementUpdated(element);
      
      label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Date*');
      
      element.required = false;
      await elementUpdated(element);
      
      label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Date');
    });
  });

  describe('Property Updates', () => {
    it('should update label dynamically', async () => {
      const element = await fixture(html`<form-date-input label="Initial Label"></form-date-input>`);
      
      element.label = 'Updated Label';
      await elementUpdated(element);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('Updated Label');
    });

    it('should update id dynamically', async () => {
      const element = await fixture(html`<form-date-input id="old-id"></form-date-input>`);
      
      element.id = 'new-id';
      await elementUpdated(element);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      
      expect(label.getAttribute('for')).to.equal('new-id');
      expect(input.id).to.equal('new-id');
    });

    it('should handle all properties together', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      element.label = 'Complete Test';
      element.value = '2023-07-04';
      element.id = 'complete-test';
      element.error = 'Test error';
      element.required = true;
      
      await elementUpdated(element);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      const errorDiv = element.shadowRoot.querySelector('.error');
      
      expect(label.textContent).to.equal('Complete Test*');
      expect(input.value).to.equal('2023-07-04');
      expect(input.id).to.equal('complete-test');
      expect(errorDiv.textContent).to.equal('Test error');
    });
  });

  describe('LocalizationMixin Integration', () => {
    it('should have access to localization methods', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      expect(element.t).to.be.a('function');
      expect(element.getCurrentLanguage).to.be.a('function');
    });

    it('should use localization service', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      expect(element.t('table.firstName')).to.be.a('string').and.not.be.empty;
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle rapid consecutive value changes', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      element.value = '2023-01-01';
      element.value = '2023-01-02';
      element.value = '2023-01-03';
      
      await elementUpdated(element);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('2023-01-03');
    });

    it('should handle empty label gracefully', async () => {
      const element = await fixture(html`<form-date-input label=""></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('');
    });

    it('should handle empty id gracefully', async () => {
      const element = await fixture(html`<form-date-input id=""></form-date-input>`);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      
      expect(label.getAttribute('for')).to.equal('');
      expect(input.id).to.equal('');
    });

    it('should handle date format edge cases', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      const events = [];
      
      element.addEventListener('input-change', (event) => {
        events.push(event.detail.value);
      });
      
      const input = element.shadowRoot.querySelector('input');
      
      input.value = '2023-12-31';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      input.value = '2023-01-01';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      expect(events).to.have.lengthOf(2);
      expect(element.value).to.equal('2023-01-01');
    });

    it('should maintain component integrity with complex updates', async () => {
      const element = await fixture(html`<form-date-input label="Test" required></form-date-input>`);
      
      element.value = '2023-05-15';
      element.error = 'Initial error';
      await elementUpdated(element);
      
      element.error = '';
      element.label = 'Updated Test';
      element.required = false;
      await elementUpdated(element);
      
      element.value = '2023-06-20';
      element.id = 'final-id';
      await elementUpdated(element);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      const errorDiv = element.shadowRoot.querySelector('.error');
      
      expect(label.textContent).to.equal('Updated Test');
      expect(input.value).to.equal('2023-06-20');
      expect(input.id).to.equal('final-id');
      expect(errorDiv).to.not.exist;
      expect(element.required).to.be.false;
    });
  });

  describe('CSS Classes and Structure', () => {
    it('should have correct CSS class structure', async () => {
      const element = await fixture(html`<form-date-input></form-date-input>`);
      
      const formGroup = element.shadowRoot.querySelector('.form-group');
      expect(formGroup).to.exist;
      
      const label = formGroup.querySelector('label');
      const input = formGroup.querySelector('input[type="date"]');
      
      expect(label).to.exist;
      expect(input).to.exist;
    });

    it('should apply error class when error exists', async () => {
      const element = await fixture(html`<form-date-input error="Test error"></form-date-input>`);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.classList.contains('error')).to.be.true;
    });
  });
});