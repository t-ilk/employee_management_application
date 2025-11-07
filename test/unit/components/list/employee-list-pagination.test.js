import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-pagination.js';

describe('employee-list-pagination component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list-pagination></employee-list-pagination>`);
  });

  it('should render with default properties', () => {
    expect(element.currentPage).to.equal(1);
    expect(element.totalPages).to.equal(0);
  });

  it('should not render pagination when totalPages is 1 or less', async () => {
    element.totalPages = 1;
    await element.updateComplete;
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.be.null;
  });

  it('should render pagination when totalPages is greater than 1', async () => {
    element.totalPages = 3;
    await element.updateComplete;
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
  });

  it('should display navigation arrows and page numbers', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-btn');
    
    expect(prevBtn).to.exist;
    expect(nextBtn).to.exist;
    expect(pageButtons.length).to.be.greaterThan(0);
  });

  it('should mark current page as active', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;
    
    const activeBtn = element.shadowRoot.querySelector('.pagination-btn.active');
    expect(activeBtn).to.exist;
    expect(activeBtn.textContent.trim()).to.equal('3');
  });

  it('should disable previous button on first page', async () => {
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    expect(prevBtn.disabled).to.be.true;
  });

  it('should disable next button on last page', async () => {
    element.totalPages = 5;
    element.currentPage = 5;
    await element.updateComplete;
    
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    expect(nextBtn.disabled).to.be.true;
  });

  it('should dispatch page-change event on previous button click', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    setTimeout(() => prevBtn.click());
    
    const event = await oneEvent(element, 'page-change');
    expect(event.type).to.equal('page-change');
    expect(event.detail.page).to.equal(2);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch page-change event on next button click', async () => {
    element.totalPages = 5;
    element.currentPage = 3;
    await element.updateComplete;
    
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    setTimeout(() => nextBtn.click());
    
    const event = await oneEvent(element, 'page-change');
    expect(event.type).to.equal('page-change');
    expect(event.detail.page).to.equal(4);
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch page-change event on page number click', async () => {
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;
    
    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-btn');
    const page3Btn = Array.from(pageButtons).find(btn => btn.textContent.trim() === '3');
    
    setTimeout(() => page3Btn.click());
    
    const event = await oneEvent(element, 'page-change');
    expect(event.detail.page).to.equal(3);
  });

  it('should show all pages when total pages is 5 or less', async () => {
    element.totalPages = 4;
    await element.updateComplete;
    
    const pageButtons = element.shadowRoot.querySelectorAll('.pagination-btn');
    expect(pageButtons).to.have.length(4);
    
    for (let i = 0; i < pageButtons.length; i++) {
      expect(pageButtons[i].textContent.trim()).to.equal(String(i + 1));
    }
  });

  it('should show ellipsis for large page counts', async () => {
    element.totalPages = 10;
    element.currentPage = 6;
    await element.updateComplete;
    
    const ellipsis = element.shadowRoot.querySelectorAll('.pagination-ellipsis');
    expect(ellipsis.length).to.be.greaterThan(0);
  });

  it('should handle edge case with current page at beginning', async () => {
    element.totalPages = 10;
    element.currentPage = 1;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    
    expect(prevBtn.disabled).to.be.true;
    expect(nextBtn.disabled).to.be.false;
  });

  it('should handle edge case with current page at end', async () => {
    element.totalPages = 10;
    element.currentPage = 10;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    
    expect(prevBtn.disabled).to.be.false;
    expect(nextBtn.disabled).to.be.true;
  });

  it('should display SVG icons in navigation buttons', async () => {
    element.totalPages = 5;
    await element.updateComplete;
    
    const navButtons = element.shadowRoot.querySelectorAll('.pagination-nav');
    
    navButtons.forEach(button => {
      const svg = button.querySelector('svg');
      expect(svg).to.exist;
      expect(svg.getAttribute('viewBox')).to.equal('0 0 24 24');
    });
  });

  it('should have proper title attributes for accessibility', async () => {
    element.totalPages = 5;
    await element.updateComplete;
    
    const prevBtn = element.shadowRoot.querySelector('.pagination-nav:first-child');
    const nextBtn = element.shadowRoot.querySelector('.pagination-nav:last-child');
    
    expect(prevBtn.title).to.include('Previous');
    expect(nextBtn.title).to.include('Next');
  });

  it('should update page buttons when currentPage changes', async () => {
    element.totalPages = 5;
    element.currentPage = 1;
    await element.updateComplete;
    
    let activeBtn = element.shadowRoot.querySelector('.pagination-btn.active');
    expect(activeBtn.textContent.trim()).to.equal('1');
    
    element.currentPage = 4;
    await element.updateComplete;
    
    activeBtn = element.shadowRoot.querySelector('.pagination-btn.active');
    expect(activeBtn.textContent.trim()).to.equal('4');
  });

  it('should handle zero total pages gracefully', async () => {
    element.totalPages = 0;
    await element.updateComplete;
    
    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.be.null;
  });
});