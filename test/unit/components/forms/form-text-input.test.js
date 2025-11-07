import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { i18n } from '../../../../src/services/i18n.js';
import '../../../../src/components/forms/form-text-input.js';

describe('FormTextInput', () => {
  describe('Basic Functionality', () => {
    it('should render with default properties', async () => {
      const element = await fixture(html`<form-text-input></form-text-input>`);
      
      expect(element.label).to.equal('');
      expect(element.value).to.equal('');
      expect(element.placeholder).to.equal('');
      expect(element.type).to.equal('text');
      expect(element.required).to.be.false;
    });

    it('should render with provided properties', async () => {
      const element = await fixture(html`
        <form-text-input 
          label="First Name" 
          value="John" 
          placeholder="Enter first name"
          type="text"
          id="firstName"
          required>
        </form-text-input>
      `);
      
      expect(element.label).to.equal('First Name');
      expect(element.value).to.equal('John');
      expect(element.placeholder).to.equal('Enter first name');
      expect(element.type).to.equal('text');
      expect(element.id).to.equal('firstName');
      expect(element.required).to.be.true;

      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.include('First Name*');
    });

    it('should render input with correct attributes', async () => {
      const element = await fixture(html`
        <form-text-input 
          type="email"
          id="email"
          placeholder="Enter email"
          value="test@example.com">
        </form-text-input>
      `);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('email');
      expect(input.id).to.equal('email');
      expect(input.placeholder).to.equal('Enter email');
      expect(input.value).to.equal('test@example.com');
    });

    it('should handle different input types', async () => {
      const element = await fixture(html`
        <form-text-input type="password" value="secret123"></form-text-input>
      `);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.type).to.equal('password');
      expect(input.value).to.equal('secret123');
    });
  });

  describe('User Interactions', () => {
    it('should handle input changes', async () => {
      const element = await fixture(html`
        <form-text-input value="initial"></form-text-input>
      `);
      
      const input = element.shadowRoot.querySelector('input');
      input.value = 'updated value';
      input.dispatchEvent(new Event('input'));
      await elementUpdated(element);
      
      expect(element.value).to.equal('updated value');
    });

    it('should dispatch custom event on input', async () => {
      const element = await fixture(html`
        <form-text-input></form-text-input>
      `);
      
      let eventDetail = null;
      element.addEventListener('input-change', (e) => {
        eventDetail = e.detail;
      });
      
      const input = element.shadowRoot.querySelector('input');
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));
      
      expect(eventDetail).to.deep.equal({ value: 'new value' });
    });

    it('should update when value property changes', async () => {
      const element = await fixture(html`
        <form-text-input value="original"></form-text-input>
      `);
      
      element.value = 'modified';
      await elementUpdated(element);
      
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('modified');
    });

    it('should handle empty and null values', async () => {
      const element = await fixture(html`
        <form-text-input value="test"></form-text-input>
      `);
      
      element.value = '';
      await elementUpdated(element);
      const input = element.shadowRoot.querySelector('input');
      expect(input.value).to.equal('');

      element.value = null;
      await elementUpdated(element);
      expect(input.value).to.equal('');
    });
  });

  describe('Error Handling', () => {
    it('should display error message', async () => {
      const element = await fixture(html`
        <form-text-input error="This field is required"></form-text-input>
      `);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('This field is required');
    });

    it('should hide error when no error', async () => {
      const element = await fixture(html`
        <form-text-input></form-text-input>
      `);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });

    it('should toggle error display', async () => {
      const element = await fixture(html`
        <form-text-input></form-text-input>
      `);
      
      expect(element.shadowRoot.querySelector('.error')).to.not.exist;
      
      element.error = 'Validation failed';
      await elementUpdated(element);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('Validation failed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle required field display', async () => {
      const element = await fixture(html`
        <form-text-input label="Username" required></form-text-input>
      `);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.include('Username*');
    });

    it('should handle missing label gracefully', async () => {
      const element = await fixture(html`
        <form-text-input required></form-text-input>
      `);
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.equal('*'); // Only asterisk when no label
    });

    it('should maintain DOM structure consistency', async () => {
      const element = await fixture(html`
        <form-text-input label="Test" value="value" error="error"></form-text-input>
      `);
      
      const formGroup = element.shadowRoot.querySelector('.form-group');
      const label = formGroup.querySelector('label');
      const input = formGroup.querySelector('input');
      const error = formGroup.querySelector('.error');
      
      expect(formGroup).to.exist;
      expect(label).to.exist;
      expect(input).to.exist;
      expect(error).to.exist;
    });

    it('should handle property updates correctly', async () => {
      const element = await fixture(html`
        <form-text-input></form-text-input>
      `);
      
      // Update multiple properties
      element.label = 'Updated Label';
      element.placeholder = 'Updated placeholder';
      element.type = 'email';
      element.required = true;
      await elementUpdated(element);
      
      const label = element.shadowRoot.querySelector('label');
      const input = element.shadowRoot.querySelector('input');
      
      expect(label.textContent).to.include('Updated Label*');
      expect(input.placeholder).to.equal('Updated placeholder');
      expect(input.type).to.equal('email');
    });
  });
});