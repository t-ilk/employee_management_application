import { expect } from '@open-wc/testing';
import { LitElement } from 'lit-element';
import sinon from 'sinon';
import { ConfirmationModalController } from '../../../src/controllers/ConfirmationModalController.js';
import { createMockHost, createRealHost, assertControllerIntegration, createTestData } from '../../helpers/controller-helpers.js';

/**
 * Unit tests for ConfirmationModalController
 * Tests the controller's functionality for managing confirmation modal state
 */

describe('ConfirmationModalController', () => {
  let mockHost;
  let controller;
  let requestUpdateSpy;

  beforeEach(() => {
    // Create a mock host element using helper
    mockHost = createMockHost();
    requestUpdateSpy = mockHost.requestUpdate;
    
    controller = new ConfirmationModalController(mockHost);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Constructor', () => {
    it('should initialize with correct default values', () => {
      expect(controller.showConfirmModal).to.be.false;
      expect(controller.pendingAction).to.be.null;
      expect(controller.pendingData).to.be.null;
      expect(controller.host).to.equal(mockHost);
    });

    it('should register itself with the host element', () => {
      assertControllerIntegration(controller, mockHost);
    });
  });

  describe('Lifecycle Methods', () => {
    it('should have hostConnected method', () => {
      expect(controller.hostConnected).to.be.a('function');
      // Should not throw when called
      expect(() => controller.hostConnected()).to.not.throw();
    });

    it('should have hostDisconnected method', () => {
      expect(controller.hostDisconnected).to.be.a('function');
      // Should not throw when called
      expect(() => controller.hostDisconnected()).to.not.throw();
    });
  });

  describe('showConfirmation()', () => {
    it('should set modal state correctly with action only', () => {
      const mockAction = sinon.spy();
      
      controller.showConfirmation(mockAction);
      
      expect(controller.showConfirmModal).to.be.true;
      expect(controller.pendingAction).to.equal(mockAction);
      expect(controller.pendingData).to.be.null;
      expect(requestUpdateSpy).to.have.been.calledOnce;
    });

    it('should set modal state correctly with action and data', () => {
      const mockAction = sinon.spy();
      const testData = { id: 123, name: 'test' };
      
      controller.showConfirmation(mockAction, testData);
      
      expect(controller.showConfirmModal).to.be.true;
      expect(controller.pendingAction).to.equal(mockAction);
      expect(controller.pendingData).to.equal(testData);
      expect(requestUpdateSpy).to.have.been.calledOnce;
    });

    it('should overwrite previous pending action and data', () => {
      const firstAction = sinon.spy();
      const secondAction = sinon.spy();
      const firstData = { id: 1 };
      const secondData = { id: 2 };
      
      controller.showConfirmation(firstAction, firstData);
      controller.showConfirmation(secondAction, secondData);
      
      expect(controller.pendingAction).to.equal(secondAction);
      expect(controller.pendingData).to.equal(secondData);
      expect(requestUpdateSpy).to.have.been.calledTwice;
    });

    it('should handle null data parameter correctly', () => {
      const mockAction = sinon.spy();
      
      controller.showConfirmation(mockAction, null);
      
      expect(controller.pendingData).to.be.null;
      expect(controller.showConfirmModal).to.be.true;
    });
  });

  describe('hideConfirmation()', () => {
    it('should reset all modal state', () => {
      const mockAction = sinon.spy();
      const testData = { id: 123 };
      
      // First show confirmation
      controller.showConfirmation(mockAction, testData);
      expect(controller.showConfirmModal).to.be.true;
      
      // Then hide it
      controller.hideConfirmation();
      
      expect(controller.showConfirmModal).to.be.false;
      expect(controller.pendingAction).to.be.null;
      expect(controller.pendingData).to.be.null;
      expect(requestUpdateSpy).to.have.been.calledTwice; // Once for show, once for hide
    });

    it('should work when called without prior showConfirmation', () => {
      expect(() => controller.hideConfirmation()).to.not.throw();
      
      expect(controller.showConfirmModal).to.be.false;
      expect(controller.pendingAction).to.be.null;
      expect(controller.pendingData).to.be.null;
      expect(requestUpdateSpy).to.have.been.calledOnce;
    });
  });

  describe('executeConfirmedAction()', () => {
    it('should execute pending action with data and then hide confirmation', () => {
      const mockAction = sinon.spy();
      const testData = { id: 123, name: 'test' };
      
      controller.showConfirmation(mockAction, testData);
      controller.executeConfirmedAction();
      
      expect(mockAction).to.have.been.calledOnce;
      expect(mockAction).to.have.been.calledWith(testData);
      expect(controller.showConfirmModal).to.be.false;
      expect(controller.pendingAction).to.be.null;
      expect(controller.pendingData).to.be.null;
    });

    it('should execute pending action without data', () => {
      const mockAction = sinon.spy();
      
      controller.showConfirmation(mockAction);
      controller.executeConfirmedAction();
      
      expect(mockAction).to.have.been.calledOnce;
      expect(mockAction).to.have.been.calledWith(null);
    });

    it('should not throw when no pending action exists', () => {
      expect(() => controller.executeConfirmedAction()).to.not.throw();
      expect(controller.showConfirmModal).to.be.false;
    });

    it('should not execute if pendingAction is not a function', () => {
      controller.pendingAction = 'not a function';
      controller.pendingData = { test: true };
      controller.showConfirmModal = true;
      
      expect(() => controller.executeConfirmedAction()).to.not.throw();
      expect(controller.showConfirmModal).to.be.false; // Should still hide
    });

    it('should handle action that throws an error gracefully', () => {
      const throwingAction = sinon.stub().throws(new Error('Test error'));
      const testData = createTestData.employee();
      
      controller.showConfirmation(throwingAction, testData);
      
      // Action should throw and hideConfirmation won't be called due to error
      expect(() => controller.executeConfirmedAction()).to.throw('Test error');
      
      // State should remain unchanged because hideConfirmation() wasn't reached
      expect(controller.hasConfirmation).to.be.true;
      expect(controller.hasPendingAction).to.be.true;
      expect(throwingAction).to.have.been.calledWith(testData);
    });
  });

  describe('Computed Properties', () => {
    describe('hasConfirmation', () => {
      it('should return false initially', () => {
        expect(controller.hasConfirmation).to.be.false;
      });

      it('should return true when modal is shown', () => {
        controller.showConfirmation(() => {});
        expect(controller.hasConfirmation).to.be.true;
      });

      it('should return false after hiding confirmation', () => {
        controller.showConfirmation(() => {});
        controller.hideConfirmation();
        expect(controller.hasConfirmation).to.be.false;
      });
    });

    describe('hasPendingAction', () => {
      it('should return false initially', () => {
        expect(controller.hasPendingAction).to.be.false;
      });

      it('should return true when action is set', () => {
        controller.showConfirmation(() => {});
        expect(controller.hasPendingAction).to.be.true;
      });

      it('should return false after hiding confirmation', () => {
        controller.showConfirmation(() => {});
        controller.hideConfirmation();
        expect(controller.hasPendingAction).to.be.false;
      });

      it('should return false after executing action', () => {
        controller.showConfirmation(() => {});
        controller.executeConfirmedAction();
        expect(controller.hasPendingAction).to.be.false;
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle multiple show/hide cycles correctly', () => {
      const action1 = sinon.spy();
      const action2 = sinon.spy();
      const data1 = { id: 1 };
      const data2 = { id: 2 };
      
      // First cycle
      controller.showConfirmation(action1, data1);
      expect(controller.hasConfirmation).to.be.true;
      expect(controller.hasPendingAction).to.be.true;
      
      controller.executeConfirmedAction();
      expect(action1).to.have.been.calledWith(data1);
      expect(controller.hasConfirmation).to.be.false;
      expect(controller.hasPendingAction).to.be.false;
      
      // Second cycle
      controller.showConfirmation(action2, data2);
      expect(controller.hasConfirmation).to.be.true;
      
      controller.hideConfirmation();
      expect(action2).to.not.have.been.called;
      expect(controller.hasConfirmation).to.be.false;
    });

    it('should handle rapid show/hide/execute sequence', () => {
      const mockAction = sinon.spy();
      const testData = { test: true };
      
      controller.showConfirmation(mockAction, testData);
      controller.hideConfirmation();
      controller.executeConfirmedAction(); // Should not execute since hidden
      
      expect(mockAction).to.not.have.been.called;
      expect(controller.hasConfirmation).to.be.false;
    });
  });

  describe('Host Integration', () => {
    it('should call requestUpdate on host when state changes', () => {
      const mockAction = sinon.spy();
      
      // Reset spy to count only our operations
      requestUpdateSpy.resetHistory();
      
      controller.showConfirmation(mockAction);
      expect(requestUpdateSpy).to.have.been.calledOnce;
      
      controller.hideConfirmation();
      expect(requestUpdateSpy).to.have.been.calledTwice;
      
      controller.showConfirmation(mockAction);
      controller.executeConfirmedAction();
      expect(requestUpdateSpy).to.have.callCount(4); // showConfirmation + hideConfirmation + showConfirmation + executeConfirmedAction->hideConfirmation
    });

    it('should work with a real LitElement host', async () => {
      const realHost = createRealHost();
      const realController = new ConfirmationModalController(realHost);
      
      // Should not throw
      expect(() => {
        realController.showConfirmation(() => {});
        realController.hideConfirmation();
      }).to.not.throw();
      
      expect(realController.hasConfirmation).to.be.false;
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined action parameter', () => {
      expect(() => controller.showConfirmation(undefined)).to.not.throw();
      expect(controller.pendingAction).to.be.undefined;
      expect(controller.showConfirmModal).to.be.true;
    });

    it('should handle non-function action parameter', () => {
      const nonFunction = 'not a function';
      controller.showConfirmation(nonFunction);
      
      expect(controller.pendingAction).to.equal(nonFunction);
      expect(() => controller.executeConfirmedAction()).to.not.throw();
    });

    it('should handle very large data objects', () => {
      const largeData = {
        array: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `item-${i}` })),
        nested: { deep: { very: { nested: { object: true } } } }
      };
      
      const mockAction = sinon.spy();
      controller.showConfirmation(mockAction, largeData);
      controller.executeConfirmedAction();
      
      expect(mockAction).to.have.been.calledWith(largeData);
    });
  });
});