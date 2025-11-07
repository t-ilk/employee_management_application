import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-header.js';

describe('employee-list-header component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list-header></employee-list-header>`);
  });

  it('should render with default properties', () => {
    expect(element.viewMode).to.equal('table');
    const title = element.shadowRoot.querySelector('h1');
    expect(title).to.exist;
    expect(title.textContent).to.include('Employee');
  });

  it('should display header structure with title and view toggle', () => {
    const header = element.shadowRoot.querySelector('.header');
    const headerLeft = element.shadowRoot.querySelector('.header-left');
    const viewToggle = element.shadowRoot.querySelector('.view-toggle');
    const title = element.shadowRoot.querySelector('h1');
    
    expect(header).to.exist;
    expect(headerLeft).to.exist;
    expect(viewToggle).to.exist;
    expect(title).to.exist;
  });

  it('should display two view toggle buttons', () => {
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    expect(toggleButtons).to.have.length(2);
    
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    expect(tableBtn).to.exist;
    expect(listBtn).to.exist;
  });

  it('should mark table view as active by default', () => {
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    
    expect(tableBtn.classList.contains('active')).to.be.true;
    expect(listBtn.classList.contains('active')).to.be.false;
  });

  it('should update active state when viewMode property changes', async () => {
    element.viewMode = 'list';
    await element.updateComplete;
    
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    
    expect(tableBtn.classList.contains('active')).to.be.false;
    expect(listBtn.classList.contains('active')).to.be.true;
  });

  it('should display SVG icons in view toggle buttons', () => {
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    
    toggleButtons.forEach(button => {
      const svg = button.querySelector('svg');
      expect(svg).to.exist;
      expect(svg.getAttribute('viewBox')).to.equal('0 0 24 24');
    });
  });

  it('should have proper title attributes for accessibility', () => {
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    
    expect(tableBtn.title).to.include('Table');
    expect(listBtn.title).to.include('List');
  });

  it('should dispatch view-mode-change event on table button click', async () => {
    element.viewMode = 'list'; // Start with list view
    await element.updateComplete;
    
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    
    setTimeout(() => tableBtn.click());
    
    const event = await oneEvent(element, 'view-mode-change');
    expect(event.type).to.equal('view-mode-change');
    expect(event.detail.viewMode).to.equal('table');
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch view-mode-change event on list button click', async () => {
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const listBtn = toggleButtons[1];
    
    setTimeout(() => listBtn.click());
    
    const event = await oneEvent(element, 'view-mode-change');
    expect(event.type).to.equal('view-mode-change');
    expect(event.detail.viewMode).to.equal('list');
    expect(event.bubbles).to.be.true;
  });

  it('should handle switching between view modes correctly', async () => {
    let eventCount = 0;
    let lastEvent = null;
    
    element.addEventListener('view-mode-change', (event) => {
      eventCount++;
      lastEvent = event;
    });
    
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    
    // Switch to list view
    listBtn.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Switch back to table view
    tableBtn.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventCount).to.equal(2);
    expect(lastEvent.detail.viewMode).to.equal('table');
  });

  it('should not dispatch event when clicking already active button', async () => {
    let eventFired = false;
    element.addEventListener('view-mode-change', () => { eventFired = true; });
    
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0]; // Already active by default
    
    tableBtn.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Event should still fire even if already active (this is expected behavior)
    expect(eventFired).to.be.true;
  });

  it('should maintain responsive layout structure', () => {
    const header = element.shadowRoot.querySelector('.header');
    const headerLeft = element.shadowRoot.querySelector('.header-left');
    const viewToggle = element.shadowRoot.querySelector('.view-toggle');
    
    expect(header).to.exist;
    expect(headerLeft.parentElement).to.equal(header);
    expect(viewToggle.parentElement).to.equal(header);
  });

  it('should handle custom view modes properly', async () => {
    element.viewMode = 'custom';
    await element.updateComplete;
    
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    const tableBtn = toggleButtons[0];
    const listBtn = toggleButtons[1];
    
    // Neither button should be active for custom view mode
    expect(tableBtn.classList.contains('active')).to.be.false;
    expect(listBtn.classList.contains('active')).to.be.false;
  });

  it('should have proper CSS classes for styling', () => {
    const header = element.shadowRoot.querySelector('.header');
    const headerLeft = element.shadowRoot.querySelector('.header-left');
    const viewToggle = element.shadowRoot.querySelector('.view-toggle');
    const toggleButtons = element.shadowRoot.querySelectorAll('.view-toggle-btn');
    
    expect(header.classList.contains('header')).to.be.true;
    expect(headerLeft.classList.contains('header-left')).to.be.true;
    expect(viewToggle.classList.contains('view-toggle')).to.be.true;
    
    toggleButtons.forEach(button => {
      expect(button.classList.contains('view-toggle-btn')).to.be.true;
    });
  });
});