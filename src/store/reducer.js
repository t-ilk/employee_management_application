import {
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  SET_EMPLOYEES
} from './actions.js';
import { initialEmployees } from './initial-employees.js';

const STORAGE_KEY = 'employee_management_app';

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getInitialState = () => {
  const stored = loadFromStorage();
  if (stored) {
    return stored;
  }
  
  return {
    employees: initialEmployees,
    loading: false,
    error: null
  };
};

const INITIAL_STATE = getInitialState();

export const reducer = (state = INITIAL_STATE, action) => {
  let newState;
  switch (action.type) {
    case ADD_EMPLOYEE:
      newState = {
        ...state,
        employees: [...state.employees, action.employee]
      };
      saveToStorage(newState);
      return newState;
    
    case UPDATE_EMPLOYEE:
      newState = {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.employee.id ? action.employee : emp
        )
      };
      saveToStorage(newState);
      return newState;
    
    case DELETE_EMPLOYEE:
      newState = {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.employeeId)
      };
      saveToStorage(newState);
      return newState;
    
    case SET_EMPLOYEES:
      newState = {
        ...state,
        employees: action.employees
      };
      saveToStorage(newState);
      return newState;
    
    default:
      return state;
  }
};