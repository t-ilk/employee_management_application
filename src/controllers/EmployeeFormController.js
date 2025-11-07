import { store } from '../store/store.js';
import { addEmployee, updateEmployee } from '../store/actions.js';
import { Router } from '@vaadin/router';

/**
 * Employee Form Controller - Handles form business logic and validation
 * Following Lit's Reactive Controller pattern
 */
export class EmployeeFormController {
  constructor(host, mode = 'add') {
    this.host = host;
    this.host.addController(this);
    
    this.mode = mode;
    this.employeeId = null;
    
    // Initialize form data
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: '',
      position: ''
    };
    
    this.errors = {};
    
    // Static data
    this.departments = [
      { key: 'Analytics', label: 'department.analytics' },
      { key: 'Tech', label: 'department.tech' }
    ];
    
    this.positions = [
      { key: 'Junior', label: 'position.junior' },
      { key: 'Medior', label: 'position.medior' },
      { key: 'Senior', label: 'position.senior' }
    ];
  }

  // Reactive Controller lifecycle
  hostConnected() {
    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (this.mode === 'edit' && this.employeeId && state.employees.length > 0) {
        this.loadEmployeeData();
      }
    });
  }

  hostDisconnected() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // Business logic methods
  setMode(mode, employeeId = null) {
    this.mode = mode;
    this.employeeId = employeeId;
    
    if (this.mode === 'edit' && this.employeeId) {
      this.loadEmployeeData();
    } else if (this.mode === 'add') {
      this.resetForm();
    }
    
    this.host.requestUpdate();
  }

  resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: '',
      position: ''
    };
    this.errors = {};
  }

  loadEmployeeData() {
    const state = store.getState();
    
    if (!state.employees || state.employees.length === 0) {
      return;
    }
    
    const employee = state.employees.find(emp => {
      const empIdStr = String(emp.id);
      const searchIdStr = String(this.employeeId);
      const empIdNum = Number(emp.id);
      const searchIdNum = Number(this.employeeId);
      
      return empIdStr === searchIdStr || empIdNum === searchIdNum;
    });
    
    if (employee) {
      this.formData = { ...employee };
      this.host.requestUpdate();
    } else {
      console.warn(`Employee with ID ${this.employeeId} not found`);
      Router.go('/');
    }
  }

  updateField(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value
    };

    // Clear any existing error for this field
    if (this.errors[field]) {
      const newErrors = { ...this.errors };
      delete newErrors[field];
      this.errors = newErrors;
    }

    this.host.requestUpdate();
  }

  validateForm(translator) {
    const errors = {};
    
    const requiredFields = [
      { field: 'firstName', label: 'form.firstName' },
      { field: 'lastName', label: 'form.lastName' },
      { field: 'dateOfEmployment', label: 'form.dateOfEmployment' },
      { field: 'dateOfBirth', label: 'form.dateOfBirth' },
      { field: 'phoneNumber', label: 'form.phoneNumber' },
      { field: 'emailAddress', label: 'form.emailAddress' },
      { field: 'department', label: 'form.department' },
      { field: 'position', label: 'form.position' }
    ];
    
    requiredFields.forEach(({ field, label }) => {
      if (!this.formData[field] || this.formData[field].trim() === '') {
        const fieldName = translator(label);
        errors[field] = translator('validation.required', { field: fieldName });
      }
    });

    // Email validation
    if (this.formData.emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.emailAddress)) {
        errors.emailAddress = translator('validation.invalidEmail');
      }
    }

    // Phone validation
    if (this.formData.phoneNumber) {
      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(this.formData.phoneNumber.replace(/\s+/g, ''))) {
        errors.phoneNumber = translator('validation.invalidPhone');
      }
    }

    this.errors = errors;
    
    // Ensure the host re-renders to show validation errors
    this.host.requestUpdate();
    
    return Object.keys(errors).length === 0;
  }

  saveEmployee() {
    const employeeData = {
      ...this.formData,
      ...(this.mode === 'add' && { id: Date.now() })
    };

    if (this.mode === 'add') {
      store.dispatch(addEmployee(employeeData));
    } else {
      store.dispatch(updateEmployee(employeeData));
    }

    // Navigate back to list
    Router.go('/');
  }

  cancelForm() {
    Router.go('/');
  }

  // Method to clear all errors
  clearErrors() {
    this.errors = {};
    this.host.requestUpdate();
  }

  // Method to clear specific field error
  clearFieldError(field) {
    if (this.errors[field]) {
      const newErrors = { ...this.errors };
      delete newErrors[field];
      this.errors = newErrors;
      this.host.requestUpdate();
    }
  }

  // Computed properties
  get isEditMode() {
    return this.mode === 'edit';
  }

  get isAddMode() {
    return this.mode === 'add';
  }

  get hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  get isFormValid() {
    return Object.keys(this.errors).length === 0;
  }

  get errorCount() {
    return Object.keys(this.errors).length;
  }
}