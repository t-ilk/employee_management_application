import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-view.js';

describe('employee-list-view component', () => {
  let element;
  let mockEmployees;

  beforeEach(async () => {
    mockEmployees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20',
        phoneNumber: '5551234567',
        emailAddress: 'john.doe@example.com',
        department: 'Tech',
        position: 'Senior'
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfEmployment: '2023-03-10',
        dateOfBirth: '1985-08-15',
        phoneNumber: '5559876543',
        emailAddress: 'jane.smith@example.com',
        department: 'Analytics',
        position: 'Medior'
      }
    ];

    element = await fixture(html`<employee-list-view></employee-list-view>`);
    element.employees = mockEmployees;
    await element.updateComplete;
  });

  it('should render with default properties', () => {
    expect(element.employees).to.deep.equal(mockEmployees);
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    expect(employeeList).to.exist;
  });

  it('should render empty array when no employees provided', async () => {
    element = await fixture(html`<employee-list-view></employee-list-view>`);
    expect(element.employees).to.deep.equal([]);
  });

  it('should display empty state when no employees', async () => {
    element.employees = [];
    await element.updateComplete;
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    
    expect(emptyState).to.exist;
    expect(employeeList).to.be.null;
    expect(emptyState.textContent).to.include('No employees');
  });

  it('should display employee list when employees exist', () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    
    expect(employeeList).to.exist;
    expect(emptyState).to.be.null;
  });

  it('should render employee-list-item components for each employee', () => {
    const employeeItems = element.shadowRoot.querySelectorAll('employee-list-item');
    expect(employeeItems).to.have.length(2);
    
    expect(employeeItems[0].employee).to.deep.equal(mockEmployees[0]);
    expect(employeeItems[1].employee).to.deep.equal(mockEmployees[1]);
  });

  it('should update employee list when employees property changes', async () => {
    const newEmployees = [
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Wilson',
        department: 'Marketing',
        position: 'Manager'
      }
    ];
    
    element.employees = newEmployees;
    await element.updateComplete;
    
    const employeeItems = element.shadowRoot.querySelectorAll('employee-list-item');
    expect(employeeItems).to.have.length(1);
    expect(employeeItems[0].employee).to.deep.equal(newEmployees[0]);
  });

  it('should dispatch employee-delete event when item delete is triggered', async () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    
    // Create a mock event from employee-list-item
    const mockEvent = new CustomEvent('employee-item-delete', {
      detail: { employee: mockEmployees[0] },
      bubbles: true
    });
    
    setTimeout(() => employeeList.dispatchEvent(mockEvent));
    
    const event = await oneEvent(element, 'employee-delete');
    expect(event.type).to.equal('employee-delete');
    expect(event.detail.employee).to.deep.equal(mockEmployees[0]);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch employee-edit event when item edit is triggered', async () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    
    // Create a mock event from employee-list-item
    const mockEvent = new CustomEvent('employee-item-edit', {
      detail: { employee: mockEmployees[1] },
      bubbles: true
    });
    
    setTimeout(() => employeeList.dispatchEvent(mockEvent));
    
    const event = await oneEvent(element, 'employee-edit');
    expect(event.type).to.equal('employee-edit');
    expect(event.detail.employee).to.deep.equal(mockEmployees[1]);
    expect(event.bubbles).to.be.true;
  });

  it('should handle empty employees array gracefully', async () => {
    element.employees = [];
    await element.updateComplete;
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    const employeeItems = element.shadowRoot.querySelectorAll('employee-list-item');
    
    expect(emptyState).to.exist;
    expect(employeeItems).to.have.length(0);
  });

  it('should display link to add first employee in empty state', async () => {
    element.employees = [];
    await element.updateComplete;
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    const addLink = emptyState.querySelector('a');
    
    expect(addLink).to.exist;
    expect(addLink.getAttribute('href')).to.equal('/add');
    expect(addLink.textContent).to.include('Add');
  });

  it('should have proper CSS classes for styling', () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    expect(employeeList.classList.contains('employee-list')).to.be.true;
  });

  it('should handle large number of employees', async () => {
    const largeEmployeeList = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      firstName: `Employee${i + 1}`,
      lastName: `Last${i + 1}`,
      department: 'Tech',
      position: 'Developer'
    }));
    
    element.employees = largeEmployeeList;
    await element.updateComplete;
    
    const employeeItems = element.shadowRoot.querySelectorAll('employee-list-item');
    expect(employeeItems).to.have.length(50);
  });

  it('should maintain grid layout structure', () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    const computedStyle = window.getComputedStyle(employeeList);
    
    expect(computedStyle.display).to.equal('grid');
  });

  it('should handle employees with missing data gracefully', async () => {
    const incompleteEmployees = [
      {
        id: 1,
        firstName: 'John'
        // Missing other properties
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith'
        // Missing other properties
      }
    ];
    
    element.employees = incompleteEmployees;
    await element.updateComplete;
    
    const employeeItems = element.shadowRoot.querySelectorAll('employee-list-item');
    expect(employeeItems).to.have.length(2);
    expect(employeeItems[0].employee).to.deep.equal(incompleteEmployees[0]);
    expect(employeeItems[1].employee).to.deep.equal(incompleteEmployees[1]);
  });

  it('should re-render when switching between empty and populated states', async () => {
    // Start with employees
    expect(element.shadowRoot.querySelector('.employee-list')).to.exist;
    expect(element.shadowRoot.querySelector('.empty-state')).to.be.null;
    
    // Switch to empty
    element.employees = [];
    await element.updateComplete;
    
    expect(element.shadowRoot.querySelector('.employee-list')).to.be.null;
    expect(element.shadowRoot.querySelector('.empty-state')).to.exist;
    
    // Switch back to populated
    element.employees = mockEmployees;
    await element.updateComplete;
    
    expect(element.shadowRoot.querySelector('.employee-list')).to.exist;
    expect(element.shadowRoot.querySelector('.empty-state')).to.be.null;
  });

  it('should handle event listener registration correctly', () => {
    const employeeList = element.shadowRoot.querySelector('.employee-list');
    
    // Check that the element exists for event delegation
    expect(employeeList).to.exist;
    expect(employeeList.classList.contains('employee-list')).to.be.true;
  });
});