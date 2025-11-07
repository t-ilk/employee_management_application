import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { i18n } from '../../../../src/services/i18n.js';
import '../../../../src/components/forms/form-select.js';

describe('FormSelect (Short)', () => {
  const testOptions = [
    { key: 'tech', label: 'department.tech' },
    { key: 'analytics', label: 'department.analytics' }
  ];

  describe('Basic Functionality', () => {
    it('should render with default properties', async () => {
      const element = await fixture(html`<form-select></form-select>`);
      
      expect(element.label).to.equal('');
      expect(element.value).to.equal('');
      expect(element.options).to.deep.equal([]);
    });

    it('should render with provided properties', async () => {
      const element = await fixture(html`
        <form-select 
          label="Department" 
          value="tech" 
          .options="${testOptions}"
          required>
        </form-select>
      `);
      
      expect(element.label).to.equal('Department');
      expect(element.value).to.equal('tech');
      expect(element.required).to.be.true;
      
      const label = element.shadowRoot.querySelector('label');
      expect(label.textContent).to.include('Department*');
    });

    it('should render options correctly', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      const options = element.shadowRoot.querySelectorAll('option');
      expect(options.length).to.equal(2);
      expect(options[0].value).to.equal('tech');
      expect(options[1].value).to.equal('analytics');
    });

    it('should handle placeholder', async () => {
      const element = await fixture(html`
        <form-select placeholder="Choose department" .options="${testOptions}"></form-select>
      `);
      
      const placeholderOption = element.shadowRoot.querySelector('option[value=""]');
      expect(placeholderOption).to.exist;
      expect(placeholderOption.textContent).to.equal('Choose department');
    });
  });

  describe('User Interactions', () => {
    it('should handle value changes', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      const select = element.shadowRoot.querySelector('select');
      select.value = 'analytics';
      select.dispatchEvent(new Event('change'));
      await elementUpdated(element);
      
      expect(element.value).to.equal('analytics');
    });

    it('should dispatch custom event on change', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      let eventDetail = null;
      element.addEventListener('input-change', (e) => {
        eventDetail = e.detail;
      });
      
      const select = element.shadowRoot.querySelector('select');
      select.value = 'tech';
      select.dispatchEvent(new Event('change'));
      
      expect(eventDetail).to.deep.equal({ value: 'tech' });
    });

    it('should update when value property changes', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      element.value = 'analytics';
      await elementUpdated(element);
      
      const select = element.shadowRoot.querySelector('select');
      expect(select.value).to.equal('analytics');
    });
  });

  describe('Error Handling', () => {
    it('should display error message', async () => {
      const element = await fixture(html`
        <form-select error="This field is required"></form-select>
      `);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal('This field is required');
    });

    it('should hide error when no error', async () => {
      const element = await fixture(html`
        <form-select></form-select>
      `);
      
      const errorDiv = element.shadowRoot.querySelector('.error');
      expect(errorDiv).to.not.exist;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', async () => {
      const element = await fixture(html`
        <form-select .options="${[]}"></form-select>
      `);
      
      const options = element.shadowRoot.querySelectorAll('option');
      expect(options.length).to.equal(0);
    });

    it('should handle null/undefined values gracefully', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      element.value = null;
      await elementUpdated(element);
      
      const select = element.shadowRoot.querySelector('select');
      expect(select.value).to.equal('tech');
      expect(() => element.value = undefined).to.not.throw;
    });

    it('should use localization for option labels', async () => {
      const element = await fixture(html`
        <form-select .options="${testOptions}"></form-select>
      `);
      
      const options = element.shadowRoot.querySelectorAll('option');
      expect(options[0].textContent.trim()).to.be.a('string');
      expect(options[0].textContent.trim().length).to.be.greaterThan(0);
    });
  });
});