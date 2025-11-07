export const employees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
    phoneNumber: '1234567890',
    emailAddress: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfEmployment: '2023-02-01',
    dateOfBirth: '1988-11-12',
    phoneNumber: '0987654321',
    emailAddress: 'jane.smith@example.com',
    department: 'Analytics',
    position: 'Medior'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    dateOfEmployment: '2023-03-10',
    dateOfBirth: '1995-07-30',
    phoneNumber: '5555551234',
    emailAddress: 'bob.johnson@example.com',
    department: 'Tech',
    position: 'Junior'
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    dateOfEmployment: '2022-12-05',
    dateOfBirth: '1987-03-15',
    phoneNumber: '4444445678',
    emailAddress: 'alice.williams@example.com',
    department: 'Analytics',
    position: 'Senior'
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    dateOfEmployment: '2023-04-20',
    dateOfBirth: '1992-09-08',
    phoneNumber: '3333339999',
    emailAddress: 'charlie.brown@example.com',
    department: 'Tech',
    position: 'Medior'
  }
];

/**
 * Form validation test cases
 */
export const validationTestCases = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfEmployment: '2023-01-15',
    dateOfBirth: '1990-05-20',
    phoneNumber: '1234567890',
    emailAddress: 'john.doe@example.com',
    department: 'Tech',
    position: 'Senior'
  },
  
  invalid: {
    empty: {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phoneNumber: '',
      emailAddress: '',
      department: '',
      position: ''
    },
    
    invalidEmail: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-20',
      phoneNumber: '1234567890',
      emailAddress: 'invalid-email',
      department: 'Tech',
      position: 'Senior'
    },
    
    invalidPhone: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfEmployment: '2023-01-15',
      dateOfBirth: '1990-05-20',
      phoneNumber: 'not-a-phone',
      emailAddress: 'john.doe@example.com',
      department: 'Tech',
      position: 'Senior'
    }
  }
};

/**
 * Mock Redux store states
 */
export const reduxStates = {
  empty: {
    employees: []
  },
  
  withEmployees: {
    employees: employees
  },
  
  singleEmployee: {
    employees: [employees[0]]
  }
};

/**
 * Mock route parameters
 */
export const routeParams = {
  editEmployee: {
    pathname: '/edit/1',
    params: { id: '1' }
  },
  
  addEmployee: {
    pathname: '/add',
    params: {}
  },
  
  employeeList: {
    pathname: '/',
    params: {}
  }
};

/**
 * Mock API responses
 */
export const apiResponses = {
  success: {
    status: 200,
    data: employees[0]
  },
  
  error: {
    status: 500,
    error: 'Internal Server Error'
  },
  
  notFound: {
    status: 404,
    error: 'Employee not found'
  }
};

/**
 * Event test data
 */
export const eventData = {
  formInput: {
    firstName: { field: 'firstName', value: 'John' },
    lastName: { field: 'lastName', value: 'Doe' },
    email: { field: 'emailAddress', value: 'john.doe@example.com' }
  },
  
  employeeActions: {
    delete: { employee: employees[0] },
    edit: { employee: employees[0] },
    bulkDelete: { employeeIds: [1, 2, 3] }
  },
  
  pagination: {
    nextPage: { page: 2 },
    previousPage: { page: 1 },
    pageSize: { pageSize: 25 }
  },
  
  search: {
    query: { value: 'John' },
    clear: {}
  }
};

/**
 * CSS selector constants for testing
 */
export const selectors = {
  // Form selectors
  form: {
    container: '.form-container',
    submitButton: '.submit-btn',
    cancelButton: '.cancel-btn',
    fields: {
      firstName: '[name="firstName"]',
      lastName: '[name="lastName"]',
      email: '[name="emailAddress"]',
      phone: '[name="phoneNumber"]',
      department: '[name="department"]',
      position: '[name="position"]'
    }
  },
  
  // List selectors
  list: {
    container: '.employee-list',
    items: '.employee-item',
    tableRows: 'tr[data-employee-id]',
    pagination: '.pagination',
    search: '.search-input',
    clearButton: '.clear-search'
  },
  
  // Modal selectors
  modal: {
    container: '.modal',
    confirmButton: '.confirm-button',
    cancelButton: '.cancel-button',
    title: '.modal-title',
    message: '.modal-message'
  },
  
  // Button selectors
  buttons: {
    primary: '.btn-primary',
    secondary: '.btn-secondary',
    delete: '.delete-button',
    edit: '.edit-button'
  }
};

/**
 * Timeout constants for testing
 */
export const timeouts = {
  short: 100,
  medium: 500,
  long: 1000,
  veryLong: 3000
};

export default {
  employees,
  validationTestCases,
  reduxStates,
  routeParams,
  apiResponses,
  eventData,
  selectors,
  timeouts
};