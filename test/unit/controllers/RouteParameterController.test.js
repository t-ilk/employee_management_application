import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { RouteParameterController } from '../../../src/controllers/RouteParameterController.js';
import { createMockHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

/**
 * Unit tests for RouteParameterController
 * Tests parameter parsing, state management, and computed properties
 */
describe('RouteParameterController', () => {
  let controller;
  let mockHost;
  let requestUpdateSpy;

  beforeEach(() => {
    // Setup mock host
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    // Create controller
    controller = new RouteParameterController(mockHost);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      expect(controller.host).to.equal(mockHost);
      expect(controller.location).to.be.null;
      expect(controller.routeParams).to.deep.equal({});
      assertControllerIntegration(controller, mockHost);
    });

    it('should register with host correctly', () => {
      expect(mockHost.addController).to.have.been.calledWith(controller);
    });
  });

  describe('Lifecycle Methods', () => {
    describe('hostDisconnected()', () => {
      it('should handle disconnection without errors', () => {
        expect(() => controller.hostDisconnected()).to.not.throw();
      });
    });
  });

  describe('parseParametersFromPath()', () => {
    it('should extract ID from edit route path', () => {
      const params = controller.parseParametersFromPath('/edit/123');
      expect(params).to.deep.equal({ id: '123' });
    });

    it('should handle different ID types', () => {
      expect(controller.parseParametersFromPath('/edit/abc123')).to.deep.equal({ id: 'abc123' });
      expect(controller.parseParametersFromPath('/edit/999')).to.deep.equal({ id: '999' });
      expect(controller.parseParametersFromPath('/edit/uuid-abc-123')).to.deep.equal({ id: 'uuid-abc-123' });
      expect(controller.parseParametersFromPath('/edit/user_456')).to.deep.equal({ id: 'user_456' });
    });

    it('should return empty object for non-edit routes', () => {
      expect(controller.parseParametersFromPath('/add')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/list')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/home')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/dashboard')).to.deep.equal({});
    });

    it('should handle malformed paths gracefully', () => {
      expect(controller.parseParametersFromPath('')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/edit')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/edit/')).to.deep.equal({});
      expect(controller.parseParametersFromPath('edit/123')).to.deep.equal({ id: '123' });
      expect(controller.parseParametersFromPath('/edit///')).to.deep.equal({});
    });

    it('should filter out empty path segments', () => {
      expect(controller.parseParametersFromPath('/edit//123/')).to.deep.equal({ id: '123' });
      expect(controller.parseParametersFromPath('//edit/123//')).to.deep.equal({ id: '123' });
      expect(controller.parseParametersFromPath('//edit//123//')).to.deep.equal({ id: '123' });
    });

    it('should handle paths with multiple segments correctly', () => {
      expect(controller.parseParametersFromPath('/app/edit/123/details')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/edit/123/extra')).to.deep.equal({ id: '123' });
      expect(controller.parseParametersFromPath('/prefix/edit/123')).to.deep.equal({});
    });

    it('should handle special characters in ID', () => {
      expect(controller.parseParametersFromPath('/edit/123-abc')).to.deep.equal({ id: '123-abc' });
      expect(controller.parseParametersFromPath('/edit/user@domain.com')).to.deep.equal({ id: 'user@domain.com' });
      expect(controller.parseParametersFromPath('/edit/123+456')).to.deep.equal({ id: '123+456' });
      expect(controller.parseParametersFromPath('/edit/user#123')).to.deep.equal({ id: 'user#123' });
      expect(controller.parseParametersFromPath('/edit/123%20test')).to.deep.equal({ id: '123%20test' });
    });

    it('should handle very long paths', () => {
      const longId = 'a'.repeat(1000);
      const longPath = `/edit/${longId}`;
      expect(controller.parseParametersFromPath(longPath)).to.deep.equal({ id: longId });
    });

    it('should handle case sensitivity', () => {
      expect(controller.parseParametersFromPath('/Edit/123')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/EDIT/123')).to.deep.equal({});
      expect(controller.parseParametersFromPath('/edit/ABC')).to.deep.equal({ id: 'ABC' });
    });
  });

  describe('setRouteParameter()', () => {
    beforeEach(() => {
      requestUpdateSpy.resetHistory();
    });

    it('should set a single route parameter', () => {
      controller.setRouteParameter('id', '123');
      
      expect(controller.routeParams).to.deep.equal({ id: '123' });
      expect(requestUpdateSpy).to.have.been.called;
    });

    it('should add parameters to existing ones', () => {
      controller.routeParams = { existing: 'value' };
      
      controller.setRouteParameter('id', '456');
      
      expect(controller.routeParams).to.deep.equal({
        existing: 'value',
        id: '456'
      });
    });

    it('should overwrite existing parameter with same key', () => {
      controller.routeParams = { id: '123', mode: 'view' };
      
      controller.setRouteParameter('id', '789');
      
      expect(controller.routeParams).to.deep.equal({
        id: '789',
        mode: 'view'
      });
    });

    it('should handle different parameter value types', () => {
      controller.setRouteParameter('stringParam', 'value');
      controller.setRouteParameter('numberParam', 123);
      controller.setRouteParameter('booleanParam', true);
      controller.setRouteParameter('nullParam', null);
      controller.setRouteParameter('undefinedParam', undefined);
      
      expect(controller.routeParams).to.deep.equal({
        stringParam: 'value',
        numberParam: 123,
        booleanParam: true,
        nullParam: null,
        undefinedParam: undefined
      });
    });

    it('should handle special characters in keys and values', () => {
      controller.setRouteParameter('param-with-dash', 'value_with_underscore');
      controller.setRouteParameter('param.with.dots', 'value with spaces');
      controller.setRouteParameter('param@email', 'user@domain.com');
      
      expect(controller.routeParams['param-with-dash']).to.equal('value_with_underscore');
      expect(controller.routeParams['param.with.dots']).to.equal('value with spaces');
      expect(controller.routeParams['param@email']).to.equal('user@domain.com');
    });

    it('should trigger requestUpdate for each parameter set', () => {
      const initialCallCount = requestUpdateSpy.callCount;
      
      controller.setRouteParameter('param1', 'value1');
      controller.setRouteParameter('param2', 'value2');
      controller.setRouteParameter('param3', 'value3');
      
      expect(requestUpdateSpy.callCount - initialCallCount).to.equal(3);
    });

    it('should handle object and array values', () => {
      const objectValue = { nested: 'value', deep: { prop: 123 } };
      const arrayValue = [1, 2, 'three', { four: 4 }];
      
      controller.setRouteParameter('objectParam', objectValue);
      controller.setRouteParameter('arrayParam', arrayValue);
      
      expect(controller.routeParams.objectParam).to.equal(objectValue);
      expect(controller.routeParams.arrayParam).to.equal(arrayValue);
    });
  });

  describe('onBeforeEnter()', () => {
    beforeEach(() => {
      requestUpdateSpy.resetHistory();
    });

    it('should update location and params from provided location', () => {
      const testLocation = {
        pathname: '/edit/555',
        params: { id: '555', mode: 'edit' }
      };
      
      const result = controller.onBeforeEnter(testLocation);
      
      expect(controller.location).to.equal(testLocation);
      expect(controller.routeParams).to.deep.equal({ id: '555', mode: 'edit' });
      expect(requestUpdateSpy).to.have.been.called;
      expect(result).to.be.true;
    });

    it('should handle location without params', () => {
      const testLocation = {
        pathname: '/add',
        params: null
      };
      
      const result = controller.onBeforeEnter(testLocation);
      
      expect(controller.location).to.equal(testLocation);
      expect(controller.routeParams).to.deep.equal({});
      expect(result).to.be.true;
    });

    it('should handle location with undefined params', () => {
      const testLocation = {
        pathname: '/edit/999'
        // params is undefined
      };
      
      const result = controller.onBeforeEnter(testLocation);
      
      expect(controller.location).to.equal(testLocation);
      expect(controller.routeParams).to.deep.equal({});
      expect(result).to.be.true;
    });

    it('should always return true for navigation', () => {
      const testLocations = [
        { pathname: '/test' },
        { pathname: '/', params: {} },
        { pathname: '/complex/path', params: { complex: 'data' } }
      ];
      
      testLocations.forEach(location => {
        const result = controller.onBeforeEnter(location);
        expect(result).to.be.true;
      });
    });

    it('should preserve complex params object structure', () => {
      const testLocation = {
        pathname: '/complex',
        params: {
          id: '123',
          filter: 'active',
          sort: 'name',
          page: 1,
          metadata: {
            timestamp: '2023-01-01',
            user: 'admin'
          },
          tags: ['important', 'urgent']
        }
      };
      
      controller.onBeforeEnter(testLocation);
      
      expect(controller.routeParams).to.deep.equal({
        id: '123',
        filter: 'active',
        sort: 'name',
        page: 1,
        metadata: {
          timestamp: '2023-01-01',
          user: 'admin'
        },
        tags: ['important', 'urgent']
      });
    });

    it('should handle rapid successive calls', () => {
      const locations = [
        { pathname: '/page1', params: { id: '1' } },
        { pathname: '/page2', params: { id: '2' } },
        { pathname: '/page3', params: { id: '3' } }
      ];
      
      const initialCallCount = requestUpdateSpy.callCount;
      
      locations.forEach(location => {
        const result = controller.onBeforeEnter(location);
        expect(result).to.be.true;
      });
      
      expect(requestUpdateSpy.callCount - initialCallCount).to.equal(3);
      expect(controller.location).to.equal(locations[2]);
      expect(controller.routeParams).to.deep.equal({ id: '3' });
    });
  });

  describe('Computed Properties', () => {
    describe('employeeId', () => {
      it('should return ID from route params', () => {
        controller.routeParams = { id: '123' };
        expect(controller.employeeId).to.equal('123');
      });

      it('should return null when no ID in params', () => {
        controller.routeParams = {};
        expect(controller.employeeId).to.be.null;
      });

      it('should handle different ID types', () => {
        controller.routeParams = { id: 456 };
        expect(controller.employeeId).to.equal(456);
        
        controller.routeParams = { id: 'abc-123' };
        expect(controller.employeeId).to.equal('abc-123');
        
        controller.routeParams = { id: 0 };
        expect(controller.employeeId).to.be.null; // Because 0 is falsy, returns null
      });

      it('should handle ID with special values', () => {
        controller.routeParams = { id: '' };
        expect(controller.employeeId).to.be.null; // Because '' is falsy, returns null
        
        controller.routeParams = { id: false };
        expect(controller.employeeId).to.be.null; // Because false is falsy, returns null
        
        controller.routeParams = { id: null };
        expect(controller.employeeId).to.be.null;
      });
    });

    describe('hasEmployeeId', () => {
      it('should return true when employee ID exists and is truthy', () => {
        controller.routeParams = { id: '123' };
        expect(controller.hasEmployeeId).to.be.true;
        
        controller.routeParams = { id: 456 };
        expect(controller.hasEmployeeId).to.be.true;
        
        controller.routeParams = { id: 'abc' };
        expect(controller.hasEmployeeId).to.be.true;
      });

      it('should return false when no employee ID', () => {
        controller.routeParams = {};
        expect(controller.hasEmployeeId).to.be.false;
      });

      it('should return false for falsy ID values', () => {
        controller.routeParams = { id: 0 };
        expect(controller.hasEmployeeId).to.be.false;
        
        controller.routeParams = { id: '' };
        expect(controller.hasEmployeeId).to.be.false;
        
        controller.routeParams = { id: false };
        expect(controller.hasEmployeeId).to.be.false;
        
        controller.routeParams = { id: null };
        expect(controller.hasEmployeeId).to.be.false;
      });

      it('should update dynamically when ID changes', () => {
        expect(controller.hasEmployeeId).to.be.false;
        
        controller.routeParams = { id: '123' };
        expect(controller.hasEmployeeId).to.be.true;
        
        controller.routeParams = { id: null };
        expect(controller.hasEmployeeId).to.be.false;
      });
    });

    describe('currentPath', () => {
      it('should return pathname from location', () => {
        controller.location = { pathname: '/edit/123' };
        expect(controller.currentPath).to.equal('/edit/123');
      });

      it('should return empty string when no location', () => {
        controller.location = null;
        expect(controller.currentPath).to.equal('');
      });

      it('should return empty string when location has no pathname', () => {
        controller.location = {};
        expect(controller.currentPath).to.equal('');
        
        controller.location = { params: {} };
        expect(controller.currentPath).to.equal('');
      });

      it('should handle different path formats', () => {
        controller.location = { pathname: '/' };
        expect(controller.currentPath).to.equal('/');
        
        controller.location = { pathname: '/add' };
        expect(controller.currentPath).to.equal('/add');
        
        controller.location = { pathname: '/complex/path/here' };
        expect(controller.currentPath).to.equal('/complex/path/here');
        
        controller.location = { pathname: '/edit/123?query=value' };
        expect(controller.currentPath).to.equal('/edit/123?query=value');
      });
    });

    describe('isEditRoute', () => {
      it('should return true for edit routes', () => {
        controller.location = { pathname: '/edit/123' };
        expect(controller.isEditRoute).to.be.true;
        
        controller.location = { pathname: '/app/edit/456' };
        expect(controller.isEditRoute).to.be.true;
        
        controller.location = { pathname: '/edit/abc-123' };
        expect(controller.isEditRoute).to.be.true;
      });

      it('should return false for non-edit routes', () => {
        controller.location = { pathname: '/add' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/list' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/dashboard' };
        expect(controller.isEditRoute).to.be.false;
      });

      it('should return false when no location', () => {
        controller.location = null;
        expect(controller.isEditRoute).to.be.false;
      });

      it('should handle partial matches correctly', () => {
        controller.location = { pathname: '/edited' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/editing' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/pre-edit' };
        expect(controller.isEditRoute).to.be.false;
      });

      it('should be case sensitive', () => {
        controller.location = { pathname: '/Edit/123' };
        expect(controller.isEditRoute).to.be.false;
        
        controller.location = { pathname: '/EDIT/123' };
        expect(controller.isEditRoute).to.be.false;
      });
    });

    describe('isAddRoute', () => {
      it('should return true for add routes', () => {
        controller.location = { pathname: '/add' };
        expect(controller.isAddRoute).to.be.true;
        
        controller.location = { pathname: '/app/add' };
        expect(controller.isAddRoute).to.be.true;
        
        controller.location = { pathname: '/prefix/add/suffix' };
        expect(controller.isAddRoute).to.be.true;
      });

      it('should return false for non-add routes', () => {
        controller.location = { pathname: '/edit/123' };
        expect(controller.isAddRoute).to.be.false;
        
        controller.location = { pathname: '/list' };
        expect(controller.isAddRoute).to.be.false;
        
        controller.location = { pathname: '/' };
        expect(controller.isAddRoute).to.be.false;
      });

      it('should return false when no location', () => {
        controller.location = null;
        expect(controller.isAddRoute).to.be.false;
      });

      it('should handle partial matches correctly', () => {
        controller.location = { pathname: '/added' };
        expect(controller.isAddRoute).to.be.true; // '/added' contains '/add'
        
        controller.location = { pathname: '/adding' };
        expect(controller.isAddRoute).to.be.true; // '/adding' contains '/add'
        
        controller.location = { pathname: '/pre-add' };
        expect(controller.isAddRoute).to.be.false; // '/pre-add' doesn't contain '/add'
      });

      it('should be case sensitive', () => {
        controller.location = { pathname: '/Add' };
        expect(controller.isAddRoute).to.be.false;
        
        controller.location = { pathname: '/ADD' };
        expect(controller.isAddRoute).to.be.false;
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete route navigation flow', () => {
      // Simulate navigation to edit route
      const editLocation = {
        pathname: '/edit/123',
        params: { id: '123' }
      };
      
      controller.onBeforeEnter(editLocation);
      
      expect(controller.employeeId).to.equal('123');
      expect(controller.hasEmployeeId).to.be.true;
      expect(controller.isEditRoute).to.be.true;
      expect(controller.isAddRoute).to.be.false;
      expect(controller.currentPath).to.equal('/edit/123');
    });

    it('should handle navigation from edit to add route', () => {
      // Start with edit route
      const editLocation = { pathname: '/edit/123', params: { id: '123' } };
      controller.onBeforeEnter(editLocation);
      
      expect(controller.isEditRoute).to.be.true;
      expect(controller.hasEmployeeId).to.be.true;
      
      // Navigate to add route
      const addLocation = { pathname: '/add', params: {} };
      controller.onBeforeEnter(addLocation);
      
      expect(controller.employeeId).to.be.null;
      expect(controller.hasEmployeeId).to.be.false;
      expect(controller.isEditRoute).to.be.false;
      expect(controller.isAddRoute).to.be.true;
    });

    it('should handle parameter updates during navigation', () => {
      // Start with basic route
      controller.onBeforeEnter({ pathname: '/edit/123', params: { id: '123' } });
      
      // Update parameters manually
      controller.setRouteParameter('mode', 'advanced');
      controller.setRouteParameter('filter', 'active');
      
      expect(controller.routeParams).to.deep.equal({
        id: '123',
        mode: 'advanced',
        filter: 'active'
      });
      
      // Navigate to new route (should replace params)
      controller.onBeforeEnter({ pathname: '/add', params: { action: 'create' } });
      
      expect(controller.routeParams).to.deep.equal({ action: 'create' });
    });

    it('should handle rapid parameter changes', () => {
      const initialCallCount = requestUpdateSpy.callCount;
      
      controller.setRouteParameter('id', '1');
      controller.setRouteParameter('id', '2');
      controller.setRouteParameter('mode', 'edit');
      controller.setRouteParameter('id', '3');
      controller.setRouteParameter('filter', 'all');
      
      expect(requestUpdateSpy.callCount - initialCallCount).to.equal(5);
      expect(controller.routeParams).to.deep.equal({
        id: '3',
        mode: 'edit',
        filter: 'all'
      });
    });

    it('should work with mock host integration', () => {
      const mockHost2 = createMockHost();
      const testController = new RouteParameterController(mockHost2);
      
      expect(testController.host).to.equal(mockHost2);
      expect(() => {
        testController.setRouteParameter('test', 'value');
        testController.onBeforeEnter({ pathname: '/test', params: { test: 'value' } });
        testController.hostDisconnected();
      }).to.not.throw();
      
      expect(testController.routeParams.test).to.equal('value');
      expect(testController.location.pathname).to.equal('/test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long path names', () => {
      const longPath = '/edit/' + 'a'.repeat(10000);
      const params = controller.parseParametersFromPath(longPath);
      
      expect(params.id).to.have.length(10000);
      expect(params.id).to.equal('a'.repeat(10000));
    });

    it('should handle paths with special characters', () => {
      const specialPaths = [
        '/edit/123%20test',
        '/edit/user@domain.com',
        '/edit/123+456',
        '/edit/user#123',
        '/edit/path?query=value',
        '/edit/user&admin=true'
      ];
      
      specialPaths.forEach(path => {
        expect(() => controller.parseParametersFromPath(path)).to.not.throw();
        const result = controller.parseParametersFromPath(path);
        expect(result.id).to.be.a('string');
      });
    });

    it('should handle setting parameters with complex objects', () => {
      const complexObject = { 
        nested: { value: true, deep: { prop: [1, 2, 3] } }, 
        array: [1, 2, 3],
        circular: null
      };
      complexObject.circular = complexObject; // Create circular reference
      
      controller.setRouteParameter('complex', complexObject);
      
      expect(controller.routeParams.complex).to.equal(complexObject);
    });

    it('should handle malformed location objects', () => {
      const malformedLocations = [
        {},
        { pathname: null },
        { params: 'not an object' },
        { pathname: '/test', params: 'invalid' },
        { pathname: 123 }
      ];
      
      malformedLocations.forEach((location, index) => {
        expect(() => controller.onBeforeEnter(location)).to.not.throw();
        expect(controller.onBeforeEnter(location)).to.be.true;
      });
    });

    it('should maintain state consistency with repeated operations', () => {
      // Set initial state
      controller.routeParams = { id: '123', mode: 'edit' };
      controller.location = { pathname: '/edit/123' };
      
      // Perform multiple operations
      controller.setRouteParameter('filter', 'active');
      controller.onBeforeEnter({ pathname: '/add', params: {} });
      controller.setRouteParameter('id', '456');
      
      // Final state should be consistent
      expect(controller.routeParams).to.deep.equal({ id: '456' });
      expect(controller.location.pathname).to.equal('/add');
      expect(controller.isEditRoute).to.be.false;
      expect(controller.isAddRoute).to.be.true;
    });

    it('should handle concurrent parameter updates', () => {
      const updates = [
        { key: 'param1', value: 'value1' },
        { key: 'param2', value: 'value2' },
        { key: 'param3', value: 'value3' },
        { key: 'param1', value: 'updated1' }
      ];
      
      const startCallCount = requestUpdateSpy.callCount;
      
      updates.forEach(({ key, value }) => {
        controller.setRouteParameter(key, value);
      });
      
      expect(requestUpdateSpy.callCount - startCallCount).to.equal(4);
      expect(controller.routeParams).to.deep.equal({
        param1: 'updated1',
        param2: 'value2',
        param3: 'value3'
      });
    });
  });
});