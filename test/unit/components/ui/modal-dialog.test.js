import { html } from 'lit';
import { fixture, expect, waitUntil, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import '../../../../src/components/ui/modal-dialog.js';

describe('modal-dialog component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<modal-dialog></modal-dialog>`);
  });

  afterEach(() => {
    sinon.restore();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', element.handleKeyDown);
  });

  it('should render with default properties', () => {
    expect(element.title).to.equal('');
    expect(element.message).to.equal('');
    expect(element.primaryLabel).to.equal('OK');
    expect(element.secondaryLabel).to.equal('Cancel');
    expect(element.open).to.be.false;
  });

  it('should not render modal when closed', () => {
    const modal = element.shadowRoot.querySelector('.modal');
    expect(modal).to.be.null;
  });

  it('should render modal when open', async () => {
    element.open = true;
    await element.updateComplete;
    
    const modal = element.shadowRoot.querySelector('.modal');
    expect(modal).to.exist;
    expect(element.hasAttribute('open')).to.be.true;
  });

  it('should display custom title and message', async () => {
    element.title = 'Test Title';
    element.message = 'Test Message';
    element.open = true;
    await element.updateComplete;
    
    const title = element.shadowRoot.querySelector('.title');
    const content = element.shadowRoot.querySelector('.content');
    expect(title.textContent).to.equal('Test Title');
    expect(content.textContent.trim()).to.equal('Test Message');
  });

  it('should display custom button labels', async () => {
    element.primaryLabel = 'Confirm';
    element.secondaryLabel = 'Abort';
    element.open = true;
    await element.updateComplete;
    
    const primaryBtn = element.shadowRoot.querySelector('.btn-primary');
    const secondaryBtn = element.shadowRoot.querySelector('.btn-secondary');
    expect(primaryBtn.textContent.trim()).to.equal('Confirm');
    expect(secondaryBtn.textContent.trim()).to.equal('Abort');
  });

  it('should set body overflow when opened', async () => {
    element.open = true;
    await element.updateComplete;
    
    expect(document.body.style.overflow).to.equal('hidden');
  });

  it('should restore body overflow when closed', async () => {
    element.open = true;
    await element.updateComplete;
    element.open = false;
    await element.updateComplete;
    
    expect(document.body.style.overflow).to.equal('');
  });

  it('should dispatch modal-cancel event on close button click', async () => {
    element.open = true;
    await element.updateComplete;
    
    const closeBtn = element.shadowRoot.querySelector('.close-btn');
    setTimeout(() => closeBtn.click());
    
    const event = await oneEvent(element, 'modal-cancel');
    expect(event.type).to.equal('modal-cancel');
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch modal-cancel event on secondary button click', async () => {
    element.open = true;
    await element.updateComplete;
    
    const secondaryBtn = element.shadowRoot.querySelector('.btn-secondary');
    setTimeout(() => secondaryBtn.click());
    
    const event = await oneEvent(element, 'modal-cancel');
    expect(event.type).to.equal('modal-cancel');
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch modal-confirm event on primary button click', async () => {
    element.open = true;
    await element.updateComplete;
    
    const primaryBtn = element.shadowRoot.querySelector('.btn-primary');
    setTimeout(() => primaryBtn.click());
    
    const event = await oneEvent(element, 'modal-confirm');
    expect(event.type).to.equal('modal-confirm');
    expect(event.bubbles).to.be.true;
  });

  it('should dispatch modal-cancel event on backdrop click', async () => {
    element.open = true;
    await element.updateComplete;
    
    const backdrop = element.shadowRoot.querySelector('.backdrop');
    setTimeout(() => {
      const clickEvent = new MouseEvent('click', { bubbles: true });
      backdrop.dispatchEvent(clickEvent);
    });
    
    const event = await oneEvent(element, 'modal-cancel');
    expect(event.type).to.equal('modal-cancel');
    expect(event.bubbles).to.be.true;
  });

  it('should not close modal when clicking on modal content', async () => {
    element.open = true;
    await element.updateComplete;
    
    let eventFired = false;
    element.addEventListener('modal-cancel', () => { eventFired = true; });
    
    const modal = element.shadowRoot.querySelector('.modal');
    modal.click();
    
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(eventFired).to.be.false;
  });

  it('should handle Escape key to close modal', async () => {
    element.open = true;
    await element.updateComplete;
    
    setTimeout(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(escapeEvent);
    });
    
    const event = await oneEvent(element, 'modal-cancel');
    expect(event.type).to.equal('modal-cancel');
  });

  it('should add and remove keydown listener based on open state', async () => {
    const addSpy = sinon.spy(document, 'addEventListener');
    const removeSpy = sinon.spy(document, 'removeEventListener');
    
    element.open = true;
    await element.updateComplete;
    
    expect(addSpy.calledWith('keydown', element.handleKeyDown)).to.be.true;
    
    element.open = false;
    await element.updateComplete;
    
    expect(removeSpy.calledWith('keydown', element.handleKeyDown)).to.be.true;
  });
});