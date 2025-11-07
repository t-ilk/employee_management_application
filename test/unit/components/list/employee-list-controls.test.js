import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import '../../../../src/components/list/employee-list-controls.js';

describe('employee-list-controls component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-list-controls></employee-list-controls>`);
  });

  it('should render with default properties', () => {
    expect(element.searchQuery).to.equal('');
    const searchInput = element.shadowRoot.querySelector('.search-input');
    expect(searchInput).to.exist;
    expect(searchInput.value).to.equal('');
  });

  it('should display search input and clear button', () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    
    expect(searchInput).to.exist;
    expect(clearBtn).to.exist;
    expect(searchInput.placeholder).to.include('Search');
    expect(clearBtn.textContent.trim()).to.include('Clear');
  });

  it('should disable clear button when search is empty', () => {
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    expect(clearBtn.disabled).to.be.true;
  });

  it('should enable clear button when search has value', async () => {
    element.searchQuery = 'test';
    await element.updateComplete;
    
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    expect(clearBtn.disabled).to.be.false;
  });

  it('should update search input value when searchQuery property changes', async () => {
    element.searchQuery = 'John Doe';
    await element.updateComplete;
    
    const searchInput = element.shadowRoot.querySelector('.search-input');
    expect(searchInput.value).to.equal('John Doe');
  });

  it('should dispatch search-input event on input', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    
    searchInput.value = 'test query';
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(inputEvent);
    });
    
    const event = await oneEvent(element, 'search-input');
    expect(event.type).to.equal('search-input');
    expect(event.detail.value).to.equal('test query');
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch clear-search event on clear button click', async () => {
    element.searchQuery = 'test';
    await element.updateComplete;
    
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    setTimeout(() => clearBtn.click());
    
    const event = await oneEvent(element, 'clear-search');
    expect(event.type).to.equal('clear-search');
    expect(event.detail).to.deep.equal({});
    expect(event.bubbles).to.be.true;
  });

  it('should not dispatch clear-search when button is disabled', async () => {
    let eventFired = false;
    element.addEventListener('clear-search', () => { eventFired = true; });
    
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    expect(clearBtn.disabled).to.be.true;
    
    clearBtn.click();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventFired).to.be.false;
  });

  it('should handle multiple search inputs correctly', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    let eventCount = 0;
    let lastEvent = null;
    
    element.addEventListener('search-input', (event) => {
      eventCount++;
      lastEvent = event;
    });
    
    // Simulate multiple inputs
    searchInput.value = 'a';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    searchInput.value = 'ab';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    searchInput.value = 'abc';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(eventCount).to.equal(3);
    expect(lastEvent.detail.value).to.equal('abc');
  });

  it('should handle empty string input correctly', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    
    searchInput.value = '';
    setTimeout(() => {
      const inputEvent = new Event('input', { bubbles: true });
      searchInput.dispatchEvent(inputEvent);
    });
    
    const event = await oneEvent(element, 'search-input');
    expect(event.detail.value).to.equal('');
  });

  it('should maintain responsive layout structure', () => {
    const controlsRow = element.shadowRoot.querySelector('.controls-row');
    const searchAndClear = element.shadowRoot.querySelector('.search-and-clear');
    
    expect(controlsRow).to.exist;
    expect(searchAndClear).to.exist;
    expect(searchAndClear.parentElement).to.equal(controlsRow);
  });

  it('should have proper CSS classes for styling', () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    const clearBtn = element.shadowRoot.querySelector('.clear-btn');
    
    expect(searchInput.classList.contains('search-input')).to.be.true;
    expect(clearBtn.classList.contains('clear-btn')).to.be.true;
  });

  it('should handle focus and blur events properly', async () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    
    searchInput.focus();
    expect(document.activeElement).to.equal(element);
    
    searchInput.blur();
    expect(document.activeElement).to.not.equal(element);
  });
});