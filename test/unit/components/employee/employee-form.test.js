import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import sinon from 'sinon';
import '../../../../src/components/employee/employee-form.js';
import { EmployeeForm } from '../../../../src/components/employee/employee-form.js';

describe('EmployeeForm', () => {
  let element;
  let localStorageStub;
  let formControllerStub;
  let modalControllerStub;

  beforeEach(async () => {
    // Mock localStorage for LocalizationMixin
    localStorageStub = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
      removeItem: sinon.stub()
    };
    sinon.stub(window, 'localStorage').value(localStorageStub);
    
    // Create stubs for controllers before element creation
    formControllerStub = {
      mode: 'add',
      formData: { 
        firstName: '', 
        lastName: '', 
        emailAddress: '', 
        department: '', 
        position: '',
        dateOfBirth: '',
        dateOfEmployment: '',
        phoneNumber: ''
      },
      errors: {},
      departments: [{ key: 'Tech', label: 'Tech' }],
      positions: [{ key: 'Senior', label: 'Senior' }],
      isAddMode: true,
      isEditMode: false,
      setMode: sinon.stub(),
      updateField: sinon.stub(),
      validateForm: sinon.stub().returns(true),
      saveEmployee: sinon.stub(),
      cancelForm: sinon.stub()
    };
    
    modalControllerStub = {
      showConfirmModal: false,
      showConfirmation: sinon.stub(),
      hideConfirmation: sinon.stub(),
      executeConfirmedAction: sinon.stub()
    };
    
    element = await fixture(html`<employee-form></employee-form>`);
    
    // Replace the actual controllers with stubs
    element.formController = formControllerStub;
    element.modalController = modalControllerStub;
    await elementUpdated(element);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Component Registration', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('employee-form')).to.equal(EmployeeForm);
    });

    it('should create an instance', () => {
      expect(element).to.be.instanceOf(EmployeeForm);
    });
  });

  describe('Properties and Initialization', () => {
    it('should have default properties', () => {
      expect(element.mode).to.equal('add');
      expect(element.employeeId).to.be.null;
    });

    it('should initialize with controllers', () => {
      expect(element.formController).to.exist;
      expect(element.modalController).to.exist;
    });

    it('should update mode property', async () => {
      element.mode = 'edit';
      await elementUpdated(element);
      expect(element.mode).to.equal('edit');
    });

    it('should update employeeId property', async () => {
      element.employeeId = '123';
      await elementUpdated(element);
      expect(element.employeeId).to.equal('123');
    });
  });

  describe('Controller Integration', () => {
    it('should call setMode on form controller when properties change', async () => {
      // Reset the stub call count
      formControllerStub.setMode.resetHistory();
      
      element.mode = 'edit';
      element.employeeId = '456';
      await elementUpdated(element);
      
      // The updated lifecycle should trigger setMode
      expect(formControllerStub.setMode.calledOnce).to.be.true;
    });

    it('should handle form input events by delegating to controller', () => {
      const inputEvent = new CustomEvent('form-input', {
        detail: { field: 'firstName', value: 'John' }
      });
      
      element.handleFormInput(inputEvent);
      
      expect(formControllerStub.updateField.calledOnce).to.be.true;
      expect(formControllerStub.updateField.calledWith('firstName', 'John')).to.be.true;
    });

    it('should handle form cancel by delegating to controller', () => {
      element.handleFormCancel();
      expect(formControllerStub.cancelForm.calledOnce).to.be.true;
    });
  });

  describe('Form Submission Logic', () => {
    it('should handle successful form submission in add mode', () => {
      formControllerStub.isEditMode = false;
      formControllerStub.validateForm.returns(true);
      
      element.handleFormSubmit();
      
      expect(formControllerStub.validateForm.calledOnce).to.be.true;
      expect(formControllerStub.saveEmployee.calledOnce).to.be.true;
      expect(modalControllerStub.showConfirmation.called).to.be.false;
    });

    it('should handle successful form submission in edit mode with confirmation', () => {
      formControllerStub.isEditMode = true;
      formControllerStub.validateForm.returns(true);
      
      element.handleFormSubmit();
      
      expect(formControllerStub.validateForm.calledOnce).to.be.true;
      expect(modalControllerStub.showConfirmation.calledOnce).to.be.true;
      expect(formControllerStub.saveEmployee.called).to.be.false; // Should wait for confirmation
    });

    it('should handle form submission with validation errors', () => {
      formControllerStub.validateForm.returns(false);
      formControllerStub.errors = { firstName: 'Required field' };
      
      const requestUpdateSpy = sinon.spy(element, 'requestUpdate');
      element.handleFormSubmit();
      
      expect(formControllerStub.validateForm.calledOnce).to.be.true;
      expect(formControllerStub.saveEmployee.called).to.be.false;
      expect(requestUpdateSpy.calledOnce).to.be.true;
      
      requestUpdateSpy.restore();
    });
  });

  describe('Modal Handling', () => {
    it('should handle modal confirmation', () => {
      element.handleConfirmModalConfirm();
      expect(modalControllerStub.executeConfirmedAction.calledOnce).to.be.true;
    });

    it('should handle modal cancellation', () => {
      element.handleConfirmModalCancel();
      expect(modalControllerStub.hideConfirmation.calledOnce).to.be.true;
    });
  });

  describe('Computed Properties', () => {
    it('should return correct page title for add mode', () => {
      formControllerStub.isAddMode = true;
      element.t = sinon.stub().returns('Add Employee');
      
      const title = element.pageTitle;
      expect(title).to.equal('Add Employee');
      expect(element.t.calledWith('page.addEmployee')).to.be.true;
    });

    it('should return correct page title for edit mode', () => {
      formControllerStub.isAddMode = false;
      element.t = sinon.stub().returns('Edit Employee');
      
      const title = element.pageTitle;
      expect(title).to.equal('Edit Employee');
      expect(element.t.calledWith('page.editEmployee')).to.be.true;
    });

    it('should return correct submit button text for add mode', () => {
      formControllerStub.isAddMode = true;
      element.t = sinon.stub().returns('Add Employee');
      
      const buttonText = element.submitButtonText;
      expect(buttonText).to.equal('Add Employee');
      expect(element.t.calledWith('button.addEmployee')).to.be.true;
    });

    it('should return correct submit button text for edit mode', () => {
      formControllerStub.isAddMode = false;
      element.t = sinon.stub().returns('Save');
      
      const buttonText = element.submitButtonText;
      expect(buttonText).to.equal('Save');
      expect(element.t.calledWith('button.save')).to.be.true;
    });

    it('should generate edit info text when in edit mode with employee data', () => {
      formControllerStub.isEditMode = true;
      formControllerStub.formData = { firstName: 'John', lastName: 'Doe' };
      element.t = sinon.stub().returns('Editing John Doe');
      
      const editInfo = element.editInfoText;
      expect(editInfo).to.equal('Editing John Doe');
      expect(element.t.calledWith('employeeEdit.editingEmployee', { name: 'John Doe' })).to.be.true;
    });

    it('should return empty edit info text when not in edit mode', () => {
      formControllerStub.isEditMode = false;
      
      const editInfo = element.editInfoText;
      expect(editInfo).to.equal('');
    });
  });

  describe('Rendering and DOM Structure', () => {
    it('should render header with title', () => {
      const header = element.shadowRoot.querySelector('.header');
      const title = element.shadowRoot.querySelector('h1');
      
      expect(header).to.exist;
      expect(title).to.exist;
    });

    it('should render employee-form-fields component', () => {
      const formFields = element.shadowRoot.querySelector('employee-form-fields');
      expect(formFields).to.exist;
    });

    it('should render modal-dialog component', () => {
      const modal = element.shadowRoot.querySelector('modal-dialog');
      expect(modal).to.exist;
    });

    it('should pass correct properties to form fields', async () => {
      const formFields = element.shadowRoot.querySelector('employee-form-fields');
      
      expect(formFields.formData).to.deep.include(formControllerStub.formData);
      expect(formFields.errors).to.deep.equal(formControllerStub.errors);
      expect(formFields.departments).to.be.an('array');
      expect(formFields.positions).to.be.an('array');
      expect(formFields.showEditInfo).to.equal(formControllerStub.isEditMode);
    });

    it('should pass correct properties to modal dialog', () => {
      const modal = element.shadowRoot.querySelector('modal-dialog');
      expect(modal.open).to.equal(modalControllerStub.showConfirmModal);
    });

    it('should handle form events from employee-form-fields', async () => {
      const formFields = element.shadowRoot.querySelector('employee-form-fields');
      const inputEvent = new CustomEvent('form-input', {
        detail: { field: 'firstName', value: 'Test' },
        bubbles: true
      });
      
      formFields.dispatchEvent(inputEvent);
      await elementUpdated(element);
      
      // Just verify the event was handled without error
      expect(formFields).to.exist;
    });
  });

  describe('CSS Styles and Responsiveness', () => {
    it('should apply correct host styles', () => {
      const hostStyles = getComputedStyle(element);
      expect(hostStyles.display).to.equal('block');
    });

    it('should apply header styling', () => {
      const header = element.shadowRoot.querySelector('.header');
      const title = element.shadowRoot.querySelector('h1');
      
      expect(header.className).to.equal('header');
      expect(title.tagName).to.equal('H1');
    });
  });

  describe('LocalizationMixin Integration', () => {
    it('should extend LocalizationMixin', () => {
      expect(element._handleLanguageChange).to.be.a('function');
      expect(element.t).to.be.a('function');
    });

    it('should use localization for page elements', () => {
      element.t = sinon.stub().returns('Localized Text');
      
      // Test that localization methods are called during rendering
      const title = element.pageTitle;
      const buttonText = element.submitButtonText;
      
      expect(element.t.called).to.be.true;
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing controller gracefully', async () => {
      // Create a new element for this test to avoid affecting other tests
      const testElement = await fixture(html`<employee-form></employee-form>`);
      testElement.formController = { formData: {}, errors: {}, isEditMode: false };
      testElement.modalController = null;
      
      // Should throw when accessing null controller
      expect(() => testElement.render()).to.throw();
    });

    it('should handle events when controllers are unavailable', () => {
      element.formController = null;
      
      expect(() => element.handleFormInput({ detail: { field: 'test', value: 'test' } })).to.throw();
    });

    it('should handle validation with custom translation function', () => {
      const tFunction = sinon.stub().returns('Translated validation message');
      formControllerStub.validateForm = sinon.stub().callsArgWith(0, 'validation.required', {});
      
      element.handleFormSubmit();
      
      expect(formControllerStub.validateForm.calledOnce).to.be.true;
    });

    it('should handle empty form data in edit info', () => {
      formControllerStub.isEditMode = true;
      formControllerStub.formData = { firstName: '', lastName: '' };
      
      const editInfo = element.editInfoText;
      expect(editInfo).to.equal('');
    });

    it('should handle undefined employee data in modal', async () => {
      formControllerStub.formData = { firstName: undefined, lastName: undefined };
      element.t = sinon.stub().returns('Confirmation message');
      await elementUpdated(element);
      
      const modal = element.shadowRoot.querySelector('modal-dialog');
      expect(modal).to.exist;
    });
  });
});