/**
 * View State Controller - Handles UI view state management
 * Following Lit's Reactive Controller pattern
 */
export class ViewStateController {
  constructor(host, initialViewMode = 'table') {
    this.host = host;
    this.host.addController(this);
    
    this.viewMode = initialViewMode;
  }

  // Reactive Controller lifecycle methods
  hostConnected() {
    // Load view mode from localStorage if available
    const savedViewMode = localStorage.getItem('employee-list-view-mode');
    if (savedViewMode && ['table', 'list'].includes(savedViewMode)) {
      this.viewMode = savedViewMode;
      this.host.requestUpdate();
    }
  }

  hostDisconnected() {
    // Save view mode to localStorage
    localStorage.setItem('employee-list-view-mode', this.viewMode);
  }

  setViewMode(newViewMode) {
    if (['table', 'list'].includes(newViewMode)) {
      this.viewMode = newViewMode;
      localStorage.setItem('employee-list-view-mode', this.viewMode);
      this.host.requestUpdate();
    }
  }

  toggleViewMode() {
    this.setViewMode(this.viewMode === 'table' ? 'list' : 'table');
  }

  // Computed properties
  get isTableView() {
    return this.viewMode === 'table';
  }

  get isListView() {
    return this.viewMode === 'list';
  }
}