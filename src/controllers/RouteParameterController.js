import { Router } from '@vaadin/router';

/**
 * Route Parameter Controller - Handles route parameter extraction and management
 * Following Lit's Reactive Controller pattern
 */
export class RouteParameterController {
  constructor(host) {
    this.host = host;
    this.host.addController(this);
    
    this.location = null;
    this.routeParams = {};
  }

  // Reactive Controller lifecycle
  hostConnected() {
    // Extract route parameters on connection
    this.updateRouteParameters();
  }

  hostDisconnected() {
    // No cleanup needed
  }

  // Route parameter methods
  updateRouteParameters() {
    const location = Router.getLocation();
    this.location = location;
    
    if (location.params) {
      this.routeParams = { ...location.params };
    } else {
      // Fallback: parse from URL path
      this.routeParams = this.parseParametersFromPath(location.pathname);
    }
    
    this.host.requestUpdate();
  }

  parseParametersFromPath(pathname) {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const params = {};
    
    // For routes like /edit/123, extract ID parameter
    if (pathSegments.length >= 2) {
      const [route, id] = pathSegments;
      if (route === 'edit' && id) {
        params.id = id;
      }
    }
    
    return params;
  }

  setRouteParameter(key, value) {
    this.routeParams = {
      ...this.routeParams,
      [key]: value
    };
    this.host.requestUpdate();
  }

  onBeforeEnter(location) {
    this.location = location;
    
    if (location.params) {
      this.routeParams = { ...location.params };
    }
    
    this.host.requestUpdate();
    return true;
  }

  // Computed properties
  get employeeId() {
    return this.routeParams.id || null;
  }

  get hasEmployeeId() {
    return this.employeeId !== null;
  }

  get currentPath() {
    return this.location?.pathname || '';
  }

  get isEditRoute() {
    return this.currentPath.includes('/edit/');
  }

  get isAddRoute() {
    return this.currentPath.includes('/add');
  }
}