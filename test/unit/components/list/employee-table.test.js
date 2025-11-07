import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-table.js';

describe('employee-table component', () => {
  let element;

  const mockEmployees = [
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

  beforeEach(async () => {
    element = await fixture(html`
      <employee-table .employees="${mockEmployees}"></employee-table>
    `);
    await element.updateComplete;
  });

  it('should render table with correct structure', () => {
    const table = element.shadowRoot.querySelector('.employee-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    expect(table).to.exist;
    expect(thead).to.exist;
    expect(tbody).to.exist;
  });

  it('should render correct table headers', () => {
    const headers = element.shadowRoot.querySelectorAll('th');
    
    expect(headers).to.have.length(10); // Including checkbox and actions columns
    expect(headers[0].querySelector('input[type="checkbox"]')).to.exist;
    expect(headers[9]).to.exist; // Actions column
  });

  it('should render employee rows', () => {
    const rows = element.shadowRoot.querySelectorAll('employee-table-row');
    
    expect(rows).to.have.length(2);
  });

  it('should show empty state when no employees', async () => {
    element.employees = [];
    await element.updateComplete;
    
    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).to.exist;
  });

  it('should handle select all checkbox', async () => {
    const selectAllCheckbox = element.shadowRoot.querySelector('.select-all-checkbox');
    
    selectAllCheckbox.click();
    await element.updateComplete;
    
    expect(element.selectedEmployees).to.have.length(2);
    expect(element.isAllSelected).to.be.true;
  });

  it('should handle row selection', () => {
    const event = new CustomEvent('employee-row-select', {
      detail: { employeeId: 1, isSelected: true }
    });
    
    element.handleRowSelect(event);
    
    expect(element.selectedEmployees).to.include(1);
  });

  it('should handle row deselection', () => {
    element.selectedEmployees = [1, 2];
    
    const event = new CustomEvent('employee-row-select', {
      detail: { employeeId: 1, isSelected: false }
    });
    
    element.handleRowSelect(event);
    
    expect(element.selectedEmployees).to.not.include(1);
    expect(element.selectedEmployees).to.include(2);
  });

  it('should show bulk actions when employees selected', async () => {
    element.selectedEmployees = [1];
    await element.updateComplete;
    
    const bulkActions = element.shadowRoot.querySelector('.bulk-actions');
    expect(bulkActions.classList.contains('hidden')).to.be.false;
  });

  it('should hide bulk actions when no employees selected', async () => {
    element.selectedEmployees = [];
    await element.updateComplete;
    
    const bulkActions = element.shadowRoot.querySelector('.bulk-actions');
    expect(bulkActions.classList.contains('hidden')).to.be.true;
  });

  it('should handle bulk delete', async () => {
    element.selectedEmployees = [1, 2];
    const listener = oneEvent(element, 'bulk-delete');
    
    const bulkDeleteBtn = element.shadowRoot.querySelector('.bulk-delete-btn');
    bulkDeleteBtn.click();
    
    const { detail } = await listener;
    expect(detail.employeeIds).to.deep.equal([1, 2]);
  });

  it('should clear selection', () => {
    element.selectedEmployees = [1, 2];
    
    element.handleClearSelection();
    
    expect(element.selectedEmployees).to.have.length(0);
  });

  it('should handle employee delete event', async () => {
    const mockEmployee = mockEmployees[0];
    const listener = oneEvent(element, 'employee-delete');
    
    const deleteEvent = new CustomEvent('employee-row-delete', {
      detail: { employee: mockEmployee }
    });
    
    element.handleRowDelete(deleteEvent);
    
    const { detail } = await listener;
    expect(detail.employee).to.deep.equal(mockEmployee);
  });

  it('should handle employee edit event', async () => {
    const mockEmployee = mockEmployees[0];
    const listener = oneEvent(element, 'employee-edit');
    
    const editEvent = new CustomEvent('employee-row-edit', {
      detail: { employee: mockEmployee }
    });
    
    element.handleRowEdit(editEvent);
    
    const { detail } = await listener;
    expect(detail.employee).to.deep.equal(mockEmployee);
  });

  it('should calculate indeterminate state correctly', () => {
    element.selectedEmployees = [1]; // Only one of two selected
    
    expect(element.isIndeterminate).to.be.true;
    expect(element.isAllSelected).to.be.false;
  });

  it('should clean up selection when employees list changes', async () => {
    element.selectedEmployees = [1, 2, 99]; // 99 doesn't exist
    
    // Simulate employees property change
    element.employees = [mockEmployees[0]]; // Only employee 1 remains
    await element.updateComplete;
    
    expect(element.selectedEmployees).to.deep.equal([1]);
  });

  it('should have responsive design classes', async () => {
    const element = await fixture(html`
      <employee-table .employees=${mockEmployees}></employee-table>
    `);
    
    const styles = element.constructor.styles;
    const stylesArray = Array.isArray(styles) ? styles : [styles];
    const cssText = stylesArray.map(style => style.cssText).join('');
    
    expect(cssText).to.include('@media (min-width: 1200px)');
    expect(cssText).to.include('@media (max-width: 480px)');
  });

  it('should handle empty employees array gracefully', async () => {
    element.employees = [];
    await element.updateComplete;
    
    const selectAllCheckbox = element.shadowRoot.querySelector('.select-all-checkbox');
    expect(selectAllCheckbox).to.not.exist; // Should be in empty state
  });
});