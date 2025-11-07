import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import { Router } from '@vaadin/router';
import '../../../../src/components/list/employee-list-item.js';

describe('employee-list-item component', () => {
  let element;
  let mockEmployee;

  beforeEach(async () => {
    mockEmployee = {
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

    element = await fixture(html`<employee-list-item .employee="${mockEmployee}"></employee-list-item>`);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render with default properties', () => {
    expect(element.employee).to.deep.equal(mockEmployee);
    const card = element.shadowRoot.querySelector('.employee-card');
    expect(card).to.exist;
  });

  it('should render with empty employee object by default', async () => {
    element = await fixture(html`<employee-list-item></employee-list-item>`);
    expect(element.employee).to.deep.equal({});
    
    const card = element.shadowRoot.querySelector('.employee-card');
    expect(card).to.exist; // Component renders even with empty employee object
  });

  it('should display employee card structure', () => {
    const card = element.shadowRoot.querySelector('.employee-card');
    const content = element.shadowRoot.querySelector('.card-content');
    const actions = element.shadowRoot.querySelector('.actions');
    
    expect(card).to.exist;
    expect(content).to.exist;
    expect(actions).to.exist;
  });

  it('should render employee left and right columns', () => {
    const leftColumn = element.shadowRoot.querySelector('employee-left-column');
    const rightColumn = element.shadowRoot.querySelector('employee-right-column');
    
    expect(leftColumn).to.exist;
    expect(rightColumn).to.exist;
    expect(leftColumn.employee).to.deep.equal(mockEmployee);
    expect(rightColumn.employee).to.deep.equal(mockEmployee);
  });

  it('should display edit and delete buttons', () => {
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    
    expect(editBtn).to.exist;
    expect(deleteBtn).to.exist;
    expect(editBtn.textContent.trim()).to.include('Edit');
    expect(deleteBtn.textContent.trim()).to.include('Delete');
  });

  it('should display SVG icons in action buttons', () => {
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    
    const editIcon = editBtn.querySelector('svg');
    const deleteIcon = deleteBtn.querySelector('svg');
    
    expect(editIcon).to.exist;
    expect(deleteIcon).to.exist;
    expect(editIcon.classList.contains('button-icon')).to.be.true;
    expect(deleteIcon.classList.contains('button-icon')).to.be.true;
  });

  it('should navigate to edit page on edit button click', () => {
    const routerStub = sinon.stub(Router, 'go');
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    
    editBtn.click();
    
    expect(routerStub.calledWith('/edit/1')).to.be.true;
  });

  it('should dispatch employee-item-delete event on delete button click', async () => {
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    
    setTimeout(() => deleteBtn.click());
    
    const event = await oneEvent(element, 'employee-item-delete');
    expect(event.type).to.equal('employee-item-delete');
    expect(event.detail.employee).to.deep.equal(mockEmployee);
    expect(event.bubbles).to.be.true;
  });

  it('should handle edit with different employee IDs', () => {
    const routerStub = sinon.stub(Router, 'go');
    
    element.employee = { ...mockEmployee, id: 42 };
    
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    editBtn.click();
    
    expect(routerStub.calledWith('/edit/42')).to.be.true;
  });

  it('should update employee data when property changes', async () => {
    const newEmployee = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      department: 'Analytics',
      position: 'Manager'
    };
    
    element.employee = newEmployee;
    await element.updateComplete;
    
    const leftColumn = element.shadowRoot.querySelector('employee-left-column');
    const rightColumn = element.shadowRoot.querySelector('employee-right-column');
    
    expect(leftColumn.employee).to.deep.equal(newEmployee);
    expect(rightColumn.employee).to.deep.equal(newEmployee);
  });

  it('should have proper CSS classes for styling', () => {
    const card = element.shadowRoot.querySelector('.employee-card');
    const content = element.shadowRoot.querySelector('.card-content');
    const actions = element.shadowRoot.querySelector('.actions');
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    
    expect(card.classList.contains('employee-card')).to.be.true;
    expect(content.classList.contains('card-content')).to.be.true;
    expect(actions.classList.contains('actions')).to.be.true;
    expect(editBtn.classList.contains('edit-btn')).to.be.true;
    expect(deleteBtn.classList.contains('delete-btn')).to.be.true;
  });

  it('should maintain responsive layout structure', () => {
    const content = element.shadowRoot.querySelector('.card-content');
    const leftColumn = element.shadowRoot.querySelector('employee-left-column');
    const rightColumn = element.shadowRoot.querySelector('employee-right-column');
    
    expect(content).to.exist;
    expect(leftColumn.parentElement).to.equal(content);
    expect(rightColumn.parentElement).to.equal(content);
  });

  it('should render empty when employee is explicitly null', async () => {
    element.employee = null;
    await element.updateComplete;
    
    const card = element.shadowRoot.querySelector('.employee-card');
    expect(card).to.be.null;
  });

  it('should dispatch delete event with correct employee data', async () => {
    const customEmployee = {
      id: 999,
      firstName: 'Test',
      lastName: 'User',
      department: 'QA'
    };
    
    element.employee = customEmployee;
    await element.updateComplete;
    
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    setTimeout(() => deleteBtn.click());
    
    const event = await oneEvent(element, 'employee-item-delete');
    expect(event.detail.employee).to.deep.equal(customEmployee);
  });

  it('should render correctly without crashing when employee has missing fields', async () => {
    const incompleteEmployee = {
      id: 3,
      firstName: 'Incomplete'
      // Missing other fields
    };
    
    element.employee = incompleteEmployee;
    await element.updateComplete;
    
    const card = element.shadowRoot.querySelector('.employee-card');
    const leftColumn = element.shadowRoot.querySelector('employee-left-column');
    const rightColumn = element.shadowRoot.querySelector('employee-right-column');
    
    expect(card).to.exist;
    expect(leftColumn).to.exist;
    expect(rightColumn).to.exist;
    expect(leftColumn.employee).to.deep.equal(incompleteEmployee);
  });
});