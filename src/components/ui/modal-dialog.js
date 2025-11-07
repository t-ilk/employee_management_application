import { LitElement, html, css } from 'lit-element';
import { LocalizationMixin } from '../../mixins/LocalizationMixin.js';

export class ModalDialog extends LocalizationMixin(LitElement) {
  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      display: flex !important;
      align-items: center;
      justify-content: center;
    }

    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal {
      background: white;
      border-radius: 6px;
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1001;
      animation: modalSlideIn 0.2s ease-out;
      margin: auto;
    }

    @keyframes modalSlideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #FF6200;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 32px;
      font-weight: 600;
      color: #FF6200;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background-color: #fff2eb;
      color: #e55a00;
      transform: scale(1.1);
    }

    .content {
      margin-bottom: 24px;
      color: #333;
      line-height: 1.5;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      padding: 16px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn-primary {
      background-color: #FF6200;
      color: white;
      box-shadow: 0 2px 4px rgba(255, 98, 0, 0.2);
    }

    .btn-primary:hover {
      background-color: #e55a00;
      box-shadow: 0 4px 8px rgba(255, 98, 0, 0.3);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background-color: white;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
      color: #374151;
    }
  `;

  static properties = {
    title: { type: String },
    message: { type: String },
    primaryLabel: { type: String },
    secondaryLabel: { type: String },
    open: { type: Boolean }
  };

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.primaryLabel = 'OK';
    this.secondaryLabel = 'Cancel';
    this.open = false;
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      if (this.open) {
        document.addEventListener('keydown', this.handleKeyDown);
        document.body.style.overflow = 'hidden';
      } else {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.body.style.overflow = '';
      }
    }
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.handleCancel();
    }
  }

  handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      this.handleCancel();
    }
  }

  handleCancel() {
    this.dispatchEvent(new CustomEvent('modal-cancel', {
      bubbles: true
    }));
  }

  handlePrimary() {
    this.dispatchEvent(new CustomEvent('modal-confirm', {
      bubbles: true
    }));
  }

  render() {
    // Set the open attribute on the host element for CSS targeting
    if (this.open) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
      return html``;
    }

    return html`
      <div class="backdrop" @click="${this.handleBackdropClick}">
        <div class="modal">
          <div class="header">
            <h3 class="title">${this.title}</h3>
            <button class="close-btn" @click="${this.handleCancel}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div class="content">
            ${this.message}
          </div>
          <div class="actions">
            <button class="btn btn-secondary" @click="${this.handleCancel}">
              ${this.secondaryLabel}
            </button>
            <button class="btn btn-primary" @click="${this.handlePrimary}">
              ${this.primaryLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('modal-dialog', ModalDialog);