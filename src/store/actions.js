const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const SET_EMPLOYEES = 'SET_EMPLOYEES';

export const addEmployee = (employeeData) => {
  return {
    type: ADD_EMPLOYEE,
    employee: {
      id: generateId(),
      ...employeeData
    }
  };
};

export const updateEmployee = (employee) => {
  return {
    type: UPDATE_EMPLOYEE,
    employee
  };
};

export const deleteEmployee = (employeeId) => {
  return {
    type: DELETE_EMPLOYEE,
    employeeId
  };
};

export const setEmployees = (employees) => {
  return {
    type: SET_EMPLOYEES,
    employees
  };
};