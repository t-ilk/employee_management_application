import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { createMockHost, createRealHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

// We'll import the controller and test it with actual dependencies, 
// but spy on the methods that have side effects
import { EmployeeFormController } from '../../../src/controllers/EmployeeFormController.js';

/**
 * Unit tests for EmployeeFormController
 * Tests form business logic, validation, and state management
 */
describe('EmployeeFormController', () => {
  let controller;
  let mockHost;
  let requestUpdateSpy;

  beforeEach(() => {
    // Setup mock host
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    // Create controller
    controller = new EmployeeFormController(mockHost);
  });

  afterEach(() => {
    // Reset all spies
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with default add mode', () => {
      expect(controller.host).to.equal(mockHost);
      expect(controller.mode).to.equal('add');
      expect(controller.employeeId).to.be.null;
      expect(controller.errors).to.deep.equal({});
      assertControllerIntegration(controller, mockHost);
    });

    it('should initialize with edit mode when specified', () => {
      const editController = new EmployeeFormController(mockHost, 'edit');
      expect(editController.mode).to.equal('edit');
    });

    it('should initialize form data with empty values', () => {
      controller = new EmployeeFormController(mockHost);
      
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
      
      expect(controller.formData).to.deep.equal(expectedFormData);
    });

    it('should have correct departments data', () => {
      controller = new EmployeeFormController(mockHost);
      
      const expectedDepartments = [
        { key: 'Analytics', label: 'department.analytics' },
        { key: 'Tech', label: 'department.tech' }
      ];
      
      expect(controller.departments).to.deep.equal(expectedDepartments);
    });

    it('should have correct positions data', () => {
      controller = new EmployeeFormController(mockHost);
      
      const expectedPositions = [
        { key: 'Junior', label: 'position.junior' },
        { key: 'Medior', label: 'position.medior' },
        { key: 'Senior', label: 'position.senior' }
      ];
      
      expect(controller.positions).to.deep.equal(expectedPositions);
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle hostConnected', () => {
      // Test that hostConnected doesn't throw
      expect(() => controller.hostConnected()).to.not.throw();
      expect(controller.unsubscribe).to.be.a('function');
    });

    it('should handle hostDisconnected without subscription', () => {
      // Should not throw when unsubscribe is undefined
      expect(() => controller.hostDisconnected()).to.not.throw();
    });

    it('should unsubscribe on hostDisconnected when subscription exists', () => {
      controller.hostConnected();
      const unsubscribeSpy = sinon.spy(controller, 'unsubscribe');
      
      controller.hostDisconnected();
      
      expect(unsubscribeSpy).to.have.been.calledOnce;
    });
  });

  describe('setMode()', () => {
    it('should set add mode and reset form', () => {
      const resetFormSpy = sinon.spy(controller, 'resetForm');
      
      controller.setMode('add');
      
      expect(controller.mode).to.equal('add');
      expect(controller.employeeId).to.be.null;
      expect(resetFormSpy).to.have.been.called;
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should set edit mode and attempt to load data when ID provided', () => {
      const loadDataSpy = sinon.spy(controller, 'loadEmployeeData');
      
      controller.setMode('edit', 123);
      
      expect(controller.mode).to.equal('edit');
      expect(controller.employeeId).to.equal(123);
      expect(loadDataSpy).to.have.been.called;
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should not load data in edit mode without employeeId', () => {
      const loadDataSpy = sinon.spy(controller, 'loadEmployeeData');
      
      controller.setMode('edit');
      
      expect(controller.mode).to.equal('edit');
      expect(loadDataSpy).to.not.have.been.called;
    });
  });

  describe('resetForm()', () => {
    it('should reset form data to empty values', () => {
      // Set some data first
      controller.formData = createTestData.employee();
      controller.errors = { firstName: 'Some error' };
      
      controller.resetForm();
      
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
      
      expect(controller.formData).to.deep.equal(expectedFormData);
    });

    it('should clear all errors', () => {
      controller.errors = { firstName: 'Some error' };
      controller.resetForm();
      
      expect(controller.errors).to.deep.equal({});
    });
  });

  describe('loadEmployeeData()', () => {
    it('should handle loading employee data', () => {
      // Test basic functionality without store mocking
      controller.mode = 'edit';
      controller.employeeId = 1;
      
      // This will use the real store, but we're just testing the method exists and doesn't crash
      expect(() => controller.loadEmployeeData()).to.not.throw();
    });
  });

  describe('updateField()', () => {
    it('should update form field value', () => {
      controller.updateField('firstName', 'John');
      
      expect(controller.formData.firstName).to.equal('John');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should clear error for updated field', () => {
      controller.errors = { firstName: 'Required field' };
      
      controller.updateField('firstName', 'John');
      
      expect(controller.errors.firstName).to.be.undefined;
    });

    it('should not affect errors for other fields', () => {
      controller.errors = { firstName: 'Required field', lastName: 'Another error' };
      
      controller.updateField('firstName', 'John');
      
      expect(controller.errors.lastName).to.equal('Another error');
    });

    it('should maintain immutability of formData', () => {
      const originalFormData = { ...controller.formData };
      
      controller.updateField('firstName', 'John');
      
      expect(controller.formData).to.not.equal(originalFormData);
      expect(controller.formData.firstName).to.equal('John');
    });
  });

  describe('validateForm()', () => {
    let mockTranslator;

    beforeEach(() => {
      mockTranslator = sinon.stub();
      mockTranslator.withArgs('validation.required').returns('Field is required');
      mockTranslator.withArgs('validation.invalidEmail').returns('Invalid email format');
      mockTranslator.withArgs('validation.invalidPhone').returns('Invalid phone number');
      mockTranslator.returns('Translated text');
    });

    it('should validate required fields', () => {
      // Empty form data
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.false;
      expect(Object.keys(controller.errors)).to.have.length(8); // All fields required
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should pass validation with complete valid data', () => {
      controller.formData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '1234567890',
        emailAddress: 'john@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.true;
      expect(controller.errors).to.deep.equal({});
    });

    it('should validate email format', () => {
      controller.formData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '1234567890',
        emailAddress: 'invalid-email',
        department: 'Tech',
        position: 'Senior'
      };
      
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.false;
      expect(controller.errors.emailAddress).to.equal('Invalid email format');
    });

    it('should validate phone number format', () => {
      controller.formData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '123', // Too short
        emailAddress: 'john@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.false;
      expect(controller.errors.phoneNumber).to.equal('Invalid phone number');
    });

    it('should accept phone numbers with spaces', () => {
      controller.formData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '123 456 7890',
        emailAddress: 'john@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.true;
      expect(controller.errors.phoneNumber).to.be.undefined;
    });

    it('should validate fields with only whitespace as empty', () => {
      controller.formData = {
        firstName: '   ',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '1234567890',
        emailAddress: 'john@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      const isValid = controller.validateForm(mockTranslator);
      
      expect(isValid).to.be.false;
      expect(controller.errors.firstName).to.equal('Field is required');
    });
  });

  describe('saveEmployee() and cancelForm()', () => {
    it('should call saveEmployee without errors', () => {
      controller.formData = createTestData.employee();
      
      // Test that the method exists and runs
      expect(() => controller.saveEmployee()).to.not.throw();
    });

    it('should call cancelForm without errors', () => {
      expect(() => controller.cancelForm()).to.not.throw();
    });
  });

  describe('Error Management', () => {
    it('should clear all errors', () => {
      controller.errors = {
        firstName: 'Required',
        lastName: 'Required',
        emailAddress: 'Invalid'
      };
      
      controller.clearErrors();
      
      expect(controller.errors).to.deep.equal({});
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should clear specific field error', () => {
      controller.errors = {
        firstName: 'Required',
        lastName: 'Required',
        emailAddress: 'Invalid'
      };
      
      controller.clearFieldError('firstName');
      
      expect(controller.errors.firstName).to.be.undefined;
      expect(controller.errors.lastName).to.equal('Required');
      expect(controller.errors.emailAddress).to.equal('Invalid');
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should not affect other errors when clearing non-existent error', () => {
      const initialErrors = {
        firstName: 'Required',
        lastName: 'Required',
        emailAddress: 'Invalid'
      };
      controller.errors = { ...initialErrors };
      
      controller.clearFieldError('nonExistentField');
      
      expect(controller.errors).to.deep.equal(initialErrors);
    });
  });

  describe('Computed Properties', () => {
    describe('isEditMode', () => {
      it('should return true in edit mode', () => {
        controller.setMode('edit', 1);
        expect(controller.isEditMode).to.be.true;
      });

      it('should return false in add mode', () => {
        controller.setMode('add');
        expect(controller.isEditMode).to.be.false;
      });
    });

    describe('isAddMode', () => {
      it('should return true in add mode', () => {
        controller.setMode('add');
        expect(controller.isAddMode).to.be.true;
      });

      it('should return false in edit mode', () => {
        controller.setMode('edit', 1);
        expect(controller.isAddMode).to.be.false;
      });
    });

    describe('hasErrors', () => {
      it('should return true when errors exist', () => {
        controller.errors = { firstName: 'Required' };
        expect(controller.hasErrors).to.be.true;
      });

      it('should return false when no errors', () => {
        controller.errors = {};
        expect(controller.hasErrors).to.be.false;
      });
    });

    describe('isFormValid', () => {
      it('should return true when no errors', () => {
        controller.errors = {};
        expect(controller.isFormValid).to.be.true;
      });

      it('should return false when errors exist', () => {
        controller.errors = { firstName: 'Required' };
        expect(controller.isFormValid).to.be.false;
      });
    });

    describe('errorCount', () => {
      it('should return correct error count', () => {
        controller.errors = {
          firstName: 'Required',
          lastName: 'Required',
          emailAddress: 'Invalid'
        };
        expect(controller.errorCount).to.equal(3);
      });

      it('should return zero when no errors', () => {
        controller.errors = {};
        expect(controller.errorCount).to.equal(0);
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete workflow from empty form to validation', () => {
      const mockTranslator = sinon.stub().returns('Translation');
      
      // Start with empty form
      expect(controller.isFormValid).to.be.true; // No validation run yet
      
      // Validate empty form
      const isValid = controller.validateForm(mockTranslator);
      expect(isValid).to.be.false;
      expect(controller.hasErrors).to.be.true;
      expect(controller.errorCount).to.equal(8);
      
      // Fill form with valid data
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2020-01-01',
        dateOfBirth: '1990-01-01',
        phoneNumber: '1234567890',
        emailAddress: 'john@example.com',
        department: 'Tech',
        position: 'Senior'
      };
      
      Object.keys(validData).forEach(field => {
        controller.updateField(field, validData[field]);
      });
      
      // Validate again
      const isValidNow = controller.validateForm(mockTranslator);
      expect(isValidNow).to.be.true;
      expect(controller.hasErrors).to.be.false;
    });

    it('should handle real host integration', () => {
      const realHost = createRealHost();
      const realController = new EmployeeFormController(realHost);
      
      expect(realController.host).to.be.instanceOf(LitElement);
      expect(realHost.updateComplete).to.be.a('promise');
    });
  });
});