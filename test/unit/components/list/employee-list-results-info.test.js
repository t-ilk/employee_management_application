import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-results-info.js';

describe('employee-list-results-info component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list-results-info></employee-list-results-info>`);
  });

  it('should render with default properties', () => {
    expect(element.startItem).to.equal(0);
    expect(element.endItem).to.equal(0);
    expect(element.totalItems).to.equal(0);
    expect(element.pageSize).to.equal(10);
    expect(element.showResults).to.be.false;
  });

  it('should not render when showResults is false', () => {
    const container = element.shadowRoot.querySelector('.results-container');
    expect(container).to.be.null;
  });

  it('should render when showResults is true', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('.results-container');
    expect(container).to.exist;
  });

  it('should display results info and page size selector', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    const pageSizeSelector = element.shadowRoot.querySelector('.page-size-selector');
    
    expect(resultsInfo).to.exist;
    expect(pageSizeSelector).to.exist;
  });

  it('should display showing results text with proper values', async () => {
    element.showResults = true;
    element.startItem = 11;
    element.endItem = 20;
    element.totalItems = 100;
    await element.updateComplete;
    
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    expect(resultsInfo.textContent).to.include('11');
    expect(resultsInfo.textContent).to.include('20');
    expect(resultsInfo.textContent).to.include('100');
  });

  it('should render page size select with options', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('.page-size-select');
    const options = select.querySelectorAll('option');
    
    expect(select).to.exist;
    expect(options).to.have.length(5);
    
    const expectedValues = ['1', '5', '10', '25', '50'];
    options.forEach((option, index) => {
      expect(option.value).to.equal(expectedValues[index]);
      expect(option.textContent).to.equal(expectedValues[index]);
    });
  });

  it('should select current pageSize option', async () => {
    element.showResults = true;
    element.pageSize = 25;
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('.page-size-select');
    expect(select.value).to.equal('25');
  });

  it('should dispatch page-size-change event on select change', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('.page-size-select');
    
    select.value = '50';
    setTimeout(() => {
      const changeEvent = new Event('change', { bubbles: true });
      select.dispatchEvent(changeEvent);
    });
    
    const event = await oneEvent(element, 'page-size-change');
    expect(event.type).to.equal('page-size-change');
    expect(event.detail.pageSize).to.equal(50);
    expect(event.bubbles).to.be.true;
  });

  it('should handle different page size changes', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('.page-size-select');
    let eventCount = 0;
    let lastPageSize = null;
    
    element.addEventListener('page-size-change', (event) => {
      eventCount++;
      lastPageSize = event.detail.pageSize;
    });
    
    // Test multiple page size changes
    select.value = '5';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    select.value = '25';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventCount).to.equal(2);
    expect(lastPageSize).to.equal(25);
  });

  it('should parse string value to integer in event detail', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const select = element.shadowRoot.querySelector('.page-size-select');
    
    select.value = '10';
    setTimeout(() => {
      const changeEvent = new Event('change', { bubbles: true });
      select.dispatchEvent(changeEvent);
    });
    
    const event = await oneEvent(element, 'page-size-change');
    expect(typeof event.detail.pageSize).to.equal('number');
    expect(event.detail.pageSize).to.equal(10);
  });

  it('should update results info when properties change', async () => {
    element.showResults = true;
    element.startItem = 1;
    element.endItem = 10;
    element.totalItems = 50;
    await element.updateComplete;
    
    let resultsInfo = element.shadowRoot.querySelector('.results-info');
    const initialText = resultsInfo.textContent;
    
    element.startItem = 21;
    element.endItem = 30;
    element.totalItems = 100;
    await element.updateComplete;
    
    resultsInfo = element.shadowRoot.querySelector('.results-info');
    const updatedText = resultsInfo.textContent;
    
    expect(updatedText).to.not.equal(initialText);
    expect(updatedText).to.include('21');
    expect(updatedText).to.include('30');
    expect(updatedText).to.include('100');
  });

  it('should display items per page label', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const pageSizeSelector = element.shadowRoot.querySelector('.page-size-selector');
    const label = pageSizeSelector.querySelector('span');
    
    expect(label).to.exist;
    expect(label.textContent).to.include('per page');
  });

  it('should have proper CSS classes for styling', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('.results-container');
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    const pageSizeSelector = element.shadowRoot.querySelector('.page-size-selector');
    const select = element.shadowRoot.querySelector('.page-size-select');
    
    expect(container.classList.contains('results-container')).to.be.true;
    expect(resultsInfo.classList.contains('results-info')).to.be.true;
    expect(pageSizeSelector.classList.contains('page-size-selector')).to.be.true;
    expect(select.classList.contains('page-size-select')).to.be.true;
  });

  it('should maintain responsive layout structure', async () => {
    element.showResults = true;
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('.results-container');
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    const pageSizeSelector = element.shadowRoot.querySelector('.page-size-selector');
    
    expect(container).to.exist;
    expect(resultsInfo.parentElement).to.equal(container);
    expect(pageSizeSelector.parentElement).to.equal(container);
  });

  it('should handle zero items correctly', async () => {
    element.showResults = true;
    element.startItem = 0;
    element.endItem = 0;
    element.totalItems = 0;
    await element.updateComplete;
    
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    expect(resultsInfo.textContent).to.include('0');
  });

  it('should handle single item correctly', async () => {
    element.showResults = true;
    element.startItem = 1;
    element.endItem = 1;
    element.totalItems = 1;
    await element.updateComplete;
    
    const resultsInfo = element.shadowRoot.querySelector('.results-info');
    const text = resultsInfo.textContent;
    expect(text).to.include('1');
  });
});