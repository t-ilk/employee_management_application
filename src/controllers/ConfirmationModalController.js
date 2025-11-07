/**
 * Confirmation Modal Controller - Handles confirmation modal state
 * Following Lit's Reactive Controller pattern
 */
export class ConfirmationModalController {
  constructor(host) {
    this.host = host;
    this.host.addController(this);
    
    this.showConfirmModal = false;
    this.pendingAction = null;
    this.pendingData = null;
  }

  // Reactive Controller lifecycle
  hostConnected() {
    // No subscription needed
  }

  hostDisconnected() {
    // No cleanup needed
  }

  // Modal methods
  showConfirmation(action, data = null) {
    this.pendingAction = action;
    this.pendingData = data;
    this.showConfirmModal = true;
    this.host.requestUpdate();
  }

  hideConfirmation() {
    this.showConfirmModal = false;
    this.pendingAction = null;
    this.pendingData = null;
    this.host.requestUpdate();
  }

  executeConfirmedAction() {
    if (this.pendingAction && typeof this.pendingAction === 'function') {
      this.pendingAction(this.pendingData);
    }
    this.hideConfirmation();
  }

  // Computed properties
  get hasConfirmation() {
    return this.showConfirmModal;
  }

  get hasPendingAction() {
    return this.pendingAction !== null;
  }
}