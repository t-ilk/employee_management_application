import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { i18n } from '../../../../src/services/i18n.js';
import '../../../../src/components/employee/employee-left-column.js';

describe('EmployeeLeftColumn', () => {
  let localizationService;

  before(async () => {
    localizationService = i18n;
  });

  const testEmployee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
    phoneNumber: '5551234567',
    emailAddress: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior'
  };

  describe('Rendering and DOM Structure', () => {
    it('should render all employee detail items', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
    });

    it('should render firstName detail item correctly', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const firstNameItem = detailItems[0];
      expect(firstNameItem.value).to.equal('John');
    });

    it('should render empty template when employee is null', async () => {
      const element = await fixture(html`<employee-left-column></employee-left-column>`);
      element.employee = null;
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(0);
    });

    it('should apply host styles correctly', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal('flex');
      expect(styles.flexDirection).to.equal('column');
    });
  });

  describe('Property Handling', () => {
    it('should handle employee property updates', async () => {
      const element = await fixture(html`<employee-left-column></employee-left-column>`);
      
      element.employee = testEmployee;
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
    });

    it('should handle empty employee object', async () => {
      const element = await fixture(html`<employee-left-column .employee="${{}}"></employee-left-column>`);
      
      const firstNameItem = element.shadowRoot.querySelector('employee-detail-item');
      expect(firstNameItem.value).to.equal('');
    });

    it('should handle partial employee data', async () => {
      const partialEmployee = { firstName: 'Jane' };
      const element = await fixture(html`<employee-left-column .employee="${partialEmployee}"></employee-left-column>`);
      
      const firstNameItem = element.shadowRoot.querySelector('employee-detail-item');
      expect(firstNameItem.value).to.equal('Jane');
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatDate('2023-01-15');
      expect(result).to.match(/1\/15\/2023|15\/1\/2023|2023-01-15/);
    });

    it('should handle empty date string', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatDate('');
      expect(result).to.equal('');
    });

    it('should handle null date', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatDate(null);
      expect(result).to.equal('');
    });

    it('should display formatted date in employment detail item', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const employmentItem = detailItems[1];
      expect(employmentItem.value).to.not.equal('2023-01-15');
    });
  });

  describe('Phone Number Formatting', () => {
    it('should format standard 10-digit phone number', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatPhoneNumber('5551234567');
      expect(result).to.equal('(555) 123-4567');
    });

    it('should handle phone number with existing formatting', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatPhoneNumber('(555) 123-4567');
      expect(result).to.equal('(555) 123-4567');
    });

    it('should handle phone number with dashes and spaces', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatPhoneNumber('555-123-4567');
      expect(result).to.equal('(555) 123-4567');
    });

    it('should return original for invalid phone number', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatPhoneNumber('123');
      expect(result).to.equal('123');
    });

    it('should handle empty phone number', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.formatPhoneNumber('');
      expect(result).to.equal('');
    });

    it('should display formatted phone in detail item', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const phoneItem = detailItems[2];
      expect(phoneItem).to.exist;
      expect(phoneItem.value).to.equal('(555) 123-4567');
    });
  });

  describe('Department Translation', () => {
    it('should translate department correctly', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.getTranslatedDepartment('Tech');
      expect(result).to.be.a('string').and.not.be.empty;
    });

    it('should handle empty department', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.getTranslatedDepartment('');
      expect(result).to.equal('');
    });

    it('should handle null department', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result = element.getTranslatedDepartment(null);
      expect(result).to.equal('');
    });

    it('should handle case insensitive department names', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const result1 = element.getTranslatedDepartment('TECH');
      const result2 = element.getTranslatedDepartment('tech');
      expect(result1).to.equal(result2);
    });
  });

  describe('Integration Tests', () => {
    it('should render complete employee information', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      
      expect(detailItems).to.have.lengthOf(4);
      
      const values = Array.from(detailItems).map(item => item.value);
      expect(values).to.include('John');
      expect(values.some(val => val.includes('(555)'))).to.be.true;
      expect(values.some(val => val.includes('/'))).to.be.true;
    });

    it('should handle employee updates correctly', async () => {
      const element = await fixture(html`<employee-left-column .employee="${testEmployee}"></employee-left-column>`);
      
      const updatedEmployee = { ...testEmployee, firstName: 'Jane', phoneNumber: '5559876543' };
      element.employee = updatedEmployee;
      await elementUpdated(element);
      
      const firstNameItem = element.shadowRoot.querySelector('employee-detail-item');
      expect(firstNameItem.value).to.equal('Jane');
    });
  });
});