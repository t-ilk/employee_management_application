import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { i18n } from '../../../../src/services/i18n.js';
import '../../../../src/components/employee/employee-right-column.js';

describe('EmployeeRightColumn', () => {
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
    it('should render 4 detail items for complete employee', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
    });

    it('should render lastName detail item correctly', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const lastNameItem = detailItems[0];
      expect(lastNameItem.value).to.equal('Doe');
    });

    it('should render empty template when employee is null', async () => {
      const element = await fixture(html`<employee-right-column></employee-right-column>`);
      element.employee = null;
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(0);
    });

    it('should render empty template when employee is undefined', async () => {
      const element = await fixture(html`<employee-right-column></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
    });

    it('should handle employee with missing properties gracefully', async () => {
      const partialEmployee = { id: 1, lastName: 'Smith' };
      const element = await fixture(html`<employee-right-column .employee="${partialEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
      
      const lastNameItem = detailItems[0];
      expect(lastNameItem.value).to.equal('Smith');
    });
  });

  describe('Date Formatting', () => {
    it('should format valid date string', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.formatDate('1990-05-20');
      expect(result).to.be.a('string').and.not.be.empty;
      expect(result).to.not.equal('1990-05-20');
    });

    it('should handle null date', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.formatDate(null);
      expect(result).to.equal('');
    });

    it('should handle undefined date', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.formatDate(undefined);
      expect(result).to.equal('');
    });

    it('should handle empty string date', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.formatDate('');
      expect(result).to.equal('');
    });

    it('should handle invalid date string', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.formatDate('invalid-date');
      expect(result).to.be.a('string');
    });

    it('should display formatted date in birth detail item', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const birthItem = detailItems[1];
      expect(birthItem.value).to.not.equal('1990-05-20');
    });
  });

  describe('Email Address Display', () => {
    it('should display email address correctly', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const emailItem = detailItems[2];
      expect(emailItem.value).to.equal('john.doe@example.com');
    });

    it('should handle missing email address', async () => {
      const employeeWithoutEmail = { ...testEmployee, emailAddress: undefined };
      const element = await fixture(html`<employee-right-column .employee="${employeeWithoutEmail}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const emailItem = detailItems[2];
      expect(emailItem.value).to.equal('');
    });

    it('should handle null email address', async () => {
      const employeeWithNullEmail = { ...testEmployee, emailAddress: null };
      const element = await fixture(html`<employee-right-column .employee="${employeeWithNullEmail}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const emailItem = detailItems[2];
      expect(emailItem.value).to.equal('');
    });

    it('should handle empty string email address', async () => {
      const employeeWithEmptyEmail = { ...testEmployee, emailAddress: '' };
      const element = await fixture(html`<employee-right-column .employee="${employeeWithEmptyEmail}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const emailItem = detailItems[2];
      expect(emailItem.value).to.equal('');
    });
  });

  describe('Position Translation', () => {
    it('should translate Senior position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition('Senior');
      expect(result).to.be.a('string').and.not.be.empty;
    });

    it('should translate Junior position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition('Junior');
      expect(result).to.be.a('string').and.not.be.empty;
    });

    it('should translate Medior position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition('Medior');
      expect(result).to.be.a('string').and.not.be.empty;
    });

    it('should handle null position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition(null);
      expect(result).to.equal('');
    });

    it('should handle undefined position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition(undefined);
      expect(result).to.equal('');
    });

    it('should handle empty string position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getTranslatedPosition('');
      expect(result).to.equal('');
    });

    it('should display translated position in detail item', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      const positionItem = detailItems[3];
      expect(positionItem.value).to.be.a('string').and.not.be.empty;
      expect(positionItem.value).to.equal('Senior');
    });
  });

  describe('Position Class Generation', () => {
    it('should generate lowercase class for position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getPositionClass('Senior');
      expect(result).to.equal('senior');
    });

    it('should handle mixed case position', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getPositionClass('MEDIOR');
      expect(result).to.equal('medior');
    });

    it('should handle null position class', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getPositionClass(null);
      expect(result).to.equal('');
    });

    it('should handle undefined position class', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getPositionClass(undefined);
      expect(result).to.equal('');
    });

    it('should handle empty string position class', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      const result = element.getPositionClass('');
      expect(result).to.equal('');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle completely empty employee object', async () => {
      const element = await fixture(html`<employee-right-column .employee="${{}}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
      
      detailItems.forEach(item => {
        expect(item.value).to.equal('');
      });
    });

    it('should update when employee property changes', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const newEmployee = {
        ...testEmployee,
        lastName: 'Smith',
        emailAddress: 'jane.smith@example.com'
      };
      
      element.employee = newEmployee;
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems[0].value).to.equal('Smith');
      expect(detailItems[2].value).to.equal('jane.smith@example.com');
    });

    it('should handle employee with all null values', async () => {
      const nullEmployee = {
        lastName: null,
        dateOfBirth: null,
        emailAddress: null,
        position: null
      };
      const element = await fixture(html`<employee-right-column .employee="${nullEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      const detailItems = element.shadowRoot.querySelectorAll('employee-detail-item');
      expect(detailItems).to.have.lengthOf(4);
      
      detailItems.forEach(item => {
        expect(item.value).to.equal('');
      });
    });
  });

  describe('LocalizationMixin Integration', () => {
    it('should use localization service for labels', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      await elementUpdated(element);
      
      expect(element.t).to.be.a('function');
      expect(element.t('table.lastName')).to.be.a('string').and.not.be.empty;
    });

    it('should have access to localization methods', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      expect(element.t).to.be.a('function');
      expect(element.getCurrentLanguage).to.be.a('function');
    });
  });

  describe('Component Properties', () => {
    it('should have employee property defined', async () => {
      const element = await fixture(html`<employee-right-column></employee-right-column>`);
      
      expect(element.constructor.properties.employee).to.exist;
      expect(element.constructor.properties.employee.type).to.equal(Object);
    });

    it('should initialize with empty employee object', async () => {
      const element = await fixture(html`<employee-right-column></employee-right-column>`);
      
      expect(element.employee).to.deep.equal({});
    });

    it('should accept employee property via attribute', async () => {
      const element = await fixture(html`<employee-right-column .employee="${testEmployee}"></employee-right-column>`);
      
      expect(element.employee).to.deep.equal(testEmployee);
    });
  });
});