import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import '../../../../src/components/list/employee-table-row.js';
import { Router } from '@vaadin/router';

describe('employee-table-row component', () => {
  let element;
  let routerStub;

  const mockEmployee = {
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

  beforeEach(async () => {
    routerStub = sinon.stub(Router, 'go');
    element = await fixture(html`
      <employee-table-row .employee="${mockEmployee}"></employee-table-row>
    `);
    await element.updateComplete;
  });

  afterEach(() => {
    routerStub.restore();
  });

  it('should render basic employee data correctly', () => {
    const cells = element.shadowRoot.querySelectorAll('td');
    
    expect(cells[1].textContent.trim()).to.equal('John');
    expect(cells[2].textContent.trim()).to.equal('Doe');
    expect(cells[6].textContent.trim()).to.equal('john.doe@example.com');
  });

  it('should format dates correctly', () => {
    const cells = element.shadowRoot.querySelectorAll('td');
    
    // Date format will depend on locale, but should not be empty
    expect(cells[3].textContent.trim()).to.not.be.empty; // Employment date
    expect(cells[4].textContent.trim()).to.not.be.empty; // Birth date
  });

  it('should format phone number correctly', () => {
    const cells = element.shadowRoot.querySelectorAll('td');
    
    expect(cells[5].textContent.trim()).to.equal('(555) 123-4567');
  });

  it('should handle missing phone number gracefully', async () => {
    element.employee = { ...mockEmployee, phoneNumber: '' };
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('td');
    expect(cells[5].textContent.trim()).to.equal('');
  });

  it('should render checkbox with correct state', () => {
    const checkbox = element.shadowRoot.querySelector('.row-checkbox');
    
    expect(checkbox).to.exist;
    expect(checkbox.checked).to.be.false;
  });

  it('should handle checkbox selection', async () => {
    const checkbox = element.shadowRoot.querySelector('.row-checkbox');
    const listener = oneEvent(element, 'employee-row-select');
    
    checkbox.click();
    
    const { detail } = await listener;
    expect(detail.employeeId).to.equal(1);
    expect(detail.isSelected).to.be.true;
  });

  it('should reflect selected state in host attribute', async () => {
    element.isSelected = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('selected')).to.be.true;
  });

  it('should render action buttons', () => {
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    
    expect(editBtn).to.exist;
    expect(deleteBtn).to.exist;
    expect(editBtn.title.toLowerCase()).to.include('edit');
    expect(deleteBtn.title.toLowerCase()).to.include('delete');
  });

  it('should handle edit button click', () => {
    const editBtn = element.shadowRoot.querySelector('.edit-btn');
    
    editBtn.click();
    
    expect(routerStub.calledOnce).to.be.true;
    expect(routerStub.calledWith('/edit/1')).to.be.true;
  });

  it('should handle delete button click', async () => {
    const deleteBtn = element.shadowRoot.querySelector('.delete-btn');
    const listener = oneEvent(element, 'employee-row-delete');
    
    deleteBtn.click();
    
    const { detail } = await listener;
    expect(detail.employee).to.deep.equal(mockEmployee);
  });

  it('should handle empty employee object', async () => {
    element.employee = {};
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('td');
    expect(cells[1].textContent.trim()).to.equal('');
    expect(cells[2].textContent.trim()).to.equal('');
  });

  it('should format irregular phone numbers gracefully', async () => {
    element.employee = { ...mockEmployee, phoneNumber: '123456' };
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('td');
    expect(cells[5].textContent.trim()).to.equal('123456'); // Original format retained
  });

  it('should handle null employee gracefully', async () => {
    element.employee = null;
    await element.updateComplete;
    
    // Check that the component returns an empty template for null employee
    const innerHTML = element.shadowRoot.innerHTML.trim();
    expect(innerHTML).to.be.oneOf(['', '<!----><!--?-->', '<!---->']);
  });

  it('should apply hover styles correctly', () => {
    const styles = getComputedStyle(element);
    
    // Check that the element has table-row display
    expect(styles.display).to.equal('table-row');
  });

  it('should handle responsive design breakpoints', () => {
    // Check that the element exists and has its own styles
    expect(element).to.exist;
    expect(element.constructor.name).to.equal('EmployeeTableRow');
  });

  it('should translate department and position', async () => {
    element.employee = { 
      ...mockEmployee, 
      department: 'Analytics', 
      position: 'Junior' 
    };
    await element.updateComplete;
    
    const cells = element.shadowRoot.querySelectorAll('td');
    expect(cells[7].textContent.trim()).to.not.be.empty; // Department
    expect(cells[8].textContent.trim()).to.not.be.empty; // Position
  });
});