// Employee Management Application Entry Point

class EmployeeManager {
  constructor() {
    this.employees = [];
  }

  addEmployee(employee) {
    this.employees.push(employee);
  }

  getEmployees() {
    return this.employees;
  }

  getEmployeeById(id) {
    return this.employees.find(emp => emp.id === id);
  }

  removeEmployee(id) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      const removed = this.employees.splice(index, 1)[0];
      return true;
    }
    return false;
  }
}

// Example usage
const manager = new EmployeeManager();

const sampleEmployee = {
  id: 1,
  name: "John Doe",
  email: "john.doe@company.com",
  department: "Engineering",
  position: "Software Developer",
  salary: 75000
};

manager.addEmployee(sampleEmployee);

module.exports = { EmployeeManager };