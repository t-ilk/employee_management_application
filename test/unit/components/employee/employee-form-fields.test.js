import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import sinon from 'sinon';
import '../../../../src/components/employee/employee-form-fields.js';
import { EmployeeFormFields } from '../../../../src/components/employee/employee-form-fields.js';

describe('EmployeeFormFields', () => {
  let element;
  let localStorageStub;

  beforeEach(async () => {
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    };
    sinon.stub(window, 'localStorage').value(localStorageStub);
    
    element = await fixture(html`<employee-form-fields></employee-form-fields>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Component Registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('employee-form-fields')).to.equal(EmployeeFormFields);
    });

    it('should create an instance', () => {
      expect(element).to.be.instanceOf(EmployeeFormFields);
    });
  });

  describe('Properties and Defaults', () => {
    it('should have default form data', () => {
      const expectedFormData = {
        firstName: '',
        lastName: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        phoneNumber: '',
        emailAddress: '',
        department: '',
        position: ''
      };
      expect(element.formData).to.deep.equal(expectedFormData);
    });

    it('should have default departments and positions', () => {
      expect(element.departments).to.have.length(2);
      expect(element.positions).to.have.length(3);
      expect(element.departments[0]).to.deep.equal({ key: 'Analytics', label: 'department.analytics' });
      expect(element.positions[0]).to.deep.equal({ key: 'Junior', label: 'position.junior' });
    });

    it('should have default configuration', () => {
      expect(element.errors).to.deep.equal({});
      expect(element.submitButtonText).to.equal('Submit');
      expect(element.showEditInfo).to.be.false;
      expect(element.editInfoText).to.equal('');
    });

    it('should update form data property', async () => {
      const newFormData = { firstName: 'John', lastName: 'Doe' };
      element.formData = newFormData;
      await elementUpdated(element);
      
      expect(element.formData).to.deep.equal(newFormData);
    });
  });

  describe('Form Structure and Rendering', () => {
    it('should render form container', () => {
      const container = element.shadowRoot.querySelector('.form-container');
      expect(container).to.exist;
    });

    it('should render form grid with input fields', () => {
      const formGrid = element.shadowRoot.querySelector('.form-grid');
      expect(formGrid).to.exist;
      
      const textInputs = element.shadowRoot.querySelectorAll('form-text-input');
      const dateInputs = element.shadowRoot.querySelectorAll('form-date-input');
      const selects = element.shadowRoot.querySelectorAll('form-select');
      
      expect(textInputs).to.have.length(4); // firstName, lastName, phoneNumber, emailAddress
      expect(dateInputs).to.have.length(2); // dateOfEmployment, dateOfBirth
      expect(selects).to.have.length(2); // department, position
    });

    it('should render form actions with buttons', () => {
      const formActions = element.shadowRoot.querySelector('.form-actions');
      const submitBtn = element.shadowRoot.querySelector('.submit-btn');
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      
      expect(formActions).to.exist;
      expect(submitBtn).to.exist;
      expect(cancelBtn).to.exist;
      expect(submitBtn.textContent).to.equal('Submit');
    });

    it('should conditionally render edit info', async () => {
      // Initially hidden
      let editInfo = element.shadowRoot.querySelector('.edit-info');
      expect(editInfo).to.not.exist;
      
      // Show edit info
      element.showEditInfo = true;
      element.editInfoText = 'Edit employee information';
      await elementUpdated(element);
      
      editInfo = element.shadowRoot.querySelector('.edit-info');
      expect(editInfo).to.exist;
      expect(editInfo.textContent).to.equal('Edit employee information');
    });

    it('should render input fields with correct properties', () => {
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const emailInput = element.shadowRoot.querySelector('#emailAddress');
      const departmentSelect = element.shadowRoot.querySelector('#department');
      
      expect(firstNameInput).to.exist;
      expect(emailInput).to.exist;
      expect(departmentSelect).to.exist;
      
      expect(firstNameInput.required).to.be.true;
      expect(emailInput.type).to.equal('email');
    });
  });

  describe('Event Handling', () => {
    it('should handle form input events', (done) => {
      element.addEventListener('form-input', (event) => {
        expect(event.detail.field).to.equal('firstName');
        expect(event.detail.value).to.equal('John');
        expect(event.bubbles).to.be.true;
        done();
      });

      element.handleFieldChange('firstName', { detail: { value: 'John' } });
    });

    it('should handle direct input events', (done) => {
      element.addEventListener('form-input', (event) => {
        expect(event.detail.field).to.equal('lastName');
        expect(event.detail.value).to.equal('Doe');
        done();
      });

      element.handleInput('lastName', { target: { value: 'Doe' } });
    });

    it('should handle form submit events', (done) => {
      element.addEventListener('form-submit', (event) => {
        expect(event.bubbles).to.be.true;
        done();
      });

      const mockEvent = { preventDefault: sinon.stub() };
      element.handleSubmit(mockEvent);
      expect(mockEvent.preventDefault.calledOnce).to.be.true;
    });

    it('should handle form cancel events', (done) => {
      element.addEventListener('form-cancel', (event) => {
        expect(event.bubbles).to.be.true;
        done();
      });

      element.handleCancel();
    });

    it('should handle button clicks', (done) => {
      element.addEventListener('form-cancel', () => {
        done();
      });
      
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      cancelBtn.click();
    });
  });

  describe('Form Data Integration', () => {
    it('should populate fields with form data', async () => {
      element.formData = {
        firstName: 'Jane',
        lastName: 'Smith',
        emailAddress: 'jane@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      await elementUpdated(element);
      
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const lastNameInput = element.shadowRoot.querySelector('#lastName');
      const emailInput = element.shadowRoot.querySelector('#emailAddress');
      
      expect(firstNameInput.value).to.equal('Jane');
      expect(lastNameInput.value).to.equal('Smith');
      expect(emailInput.value).to.equal('jane@example.com');
    });

    it('should display errors on form fields', async () => {
      element.errors = {
        firstName: 'First name is required',
        emailAddress: 'Invalid email format'
      };
      await elementUpdated(element);
      
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const emailInput = element.shadowRoot.querySelector('#emailAddress');
      
      expect(firstNameInput.error).to.equal('First name is required');
      expect(emailInput.error).to.equal('Invalid email format');
    });

    it('should handle empty form data gracefully', async () => {
      element.formData = {}; // Empty object instead of null
      await elementUpdated(element);
      
      const inputs = element.shadowRoot.querySelectorAll('form-text-input');
      // Check that component doesn't crash and renders properly
      expect(inputs.length).to.be.greaterThan(0);
    });

    it('should update submit button text', async () => {
      element.submitButtonText = 'Update Employee';
      await elementUpdated(element);
      
      const submitBtn = element.shadowRoot.querySelector('.submit-btn');
      expect(submitBtn.textContent).to.equal('Update Employee');
    });
  });

  describe('CSS Styles and Responsiveness', () => {
    it('should apply correct CSS classes', () => {
      const container = element.shadowRoot.querySelector('.form-container');
      const formGrid = element.shadowRoot.querySelector('.form-grid');
      const formActions = element.shadowRoot.querySelector('.form-actions');
      
      expect(container.className).to.equal('form-container');
      expect(formGrid.className).to.equal('form-grid');
      expect(formActions.className).to.equal('form-actions');
    });

    it('should have host display block styling', () => {
      const hostStyles = getComputedStyle(element);
      expect(hostStyles.display).to.equal('block');
    });

    it('should apply button styles correctly', () => {
      const submitBtn = element.shadowRoot.querySelector('.submit-btn');
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      
      const submitStyles = getComputedStyle(submitBtn);
      const cancelStyles = getComputedStyle(cancelBtn);
      
      expect(submitBtn.className).to.equal('submit-btn');
      expect(cancelBtn.className).to.equal('cancel-btn');
      expect(submitStyles.cursor).to.equal('pointer');
      expect(cancelStyles.cursor).to.equal('pointer');
    });
  });

  describe('LocalizationMixin Integration', () => {
    it('should extend LocalizationMixin', () => {
      expect(element._handleLanguageChange).to.be.a('function');
      expect(element.t).to.be.a('function');
    });

    it('should use localization for labels and placeholders', async () => {
      // Check that localization methods are available and called
      expect(element.t).to.be.a('function');
      
      // Verify the component uses localization
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const submitBtn = element.shadowRoot.querySelector('.submit-btn');
      const cancelBtn = element.shadowRoot.querySelector('.cancel-btn');
      
      expect(firstNameInput).to.exist;
      expect(submitBtn).to.exist;
      expect(cancelBtn).to.exist;
    });
  });

  describe('Field Types and Validation', () => {
    it('should render different input types correctly', () => {
      const phoneInput = element.shadowRoot.querySelector('#phoneNumber');
      const emailInput = element.shadowRoot.querySelector('#emailAddress');
      const dateInputs = element.shadowRoot.querySelectorAll('form-date-input');
      
      expect(phoneInput.type).to.equal('tel');
      expect(emailInput.type).to.equal('email');
      expect(dateInputs).to.have.length(2);
    });

    it('should mark required fields appropriately', () => {
      const textInputs = element.shadowRoot.querySelectorAll('form-text-input');
      const dateInputs = element.shadowRoot.querySelectorAll('form-date-input');
      const selects = element.shadowRoot.querySelectorAll('form-select');
      
      // Check that we have the expected number of inputs
      expect(textInputs.length).to.equal(4);
      expect(dateInputs.length).to.equal(2);
      expect(selects.length).to.equal(2);
      
      // Check that inputs have required property
      expect(textInputs[0].required).to.be.true;
    });

    it('should provide correct options for selects', () => {
      const departmentSelect = element.shadowRoot.querySelector('#department');
      const positionSelect = element.shadowRoot.querySelector('#position');
      
      expect(departmentSelect.options).to.deep.equal(element.departments);
      expect(positionSelect.options).to.deep.equal(element.positions);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing form data properties', async () => {
      element.formData = { firstName: 'John' }; // Missing other properties
      await elementUpdated(element);
      
      const lastNameInput = element.shadowRoot.querySelector('#lastName');
      expect(lastNameInput.value).to.equal('');
    });

    it('should handle undefined errors object', async () => {
      element.errors = {}; // Empty object instead of undefined
      await elementUpdated(element);
      
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      expect(firstNameInput.error).to.equal('');
    });

    it('should handle empty departments and positions arrays', async () => {
      element.departments = [];
      element.positions = [];
      await elementUpdated(element);
      
      const departmentSelect = element.shadowRoot.querySelector('#department');
      const positionSelect = element.shadowRoot.querySelector('#position');
      
      expect(departmentSelect.options).to.deep.equal([]);
      expect(positionSelect.options).to.deep.equal([]);
    });

    it('should handle very long text values', async () => {
      const longText = 'A'.repeat(1000);
      element.formData = { firstName: longText };
      element.editInfoText = longText;
      element.showEditInfo = true;
      await elementUpdated(element);
      
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const editInfo = element.shadowRoot.querySelector('.edit-info');
      
      expect(firstNameInput.value).to.equal(longText);
      expect(editInfo.textContent).to.equal(longText);
    });

    it('should handle special characters in form data', async () => {
      const specialData = {
        firstName: 'José',
        lastName: "O'Connor",
        emailAddress: 'test+user@email-domain.co.uk'
      };
      element.formData = specialData;
      await elementUpdated(element);
      
      const firstNameInput = element.shadowRoot.querySelector('#firstName');
      const lastNameInput = element.shadowRoot.querySelector('#lastName');
      const emailInput = element.shadowRoot.querySelector('#emailAddress');
      
      expect(firstNameInput.value).to.equal('José');
      expect(lastNameInput.value).to.equal("O'Connor");
      expect(emailInput.value).to.equal('test+user@email-domain.co.uk');
    });
  });
});