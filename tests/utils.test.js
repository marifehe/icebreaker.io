'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const utils = require('../src/utils');

describe('Utils tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  describe('hookSingleHandler()', () => {
    it('shoud register the event handler a single time', () => {
      // Arrange
      const eventName = 'test-event-name';
      const testSocket = {
        on: () => { },
        listenerCount: () => (0)
      };
      const onSpy = sinonSandbox.spy(testSocket, 'on');

      // Act
      utils.hookSingleHandler(testSocket);
      testSocket.on(eventName);

      // Assert
      expect(onSpy).to.have.been.calledOnce;
    });

    it('shoud not register the event handler if another handler exists already', () => {
      // Arrange
      const eventName = 'test-event-name';
      const testSocket = {
        on: () => { },
        listenerCount: () => (1)
      };
      const onSpy = sinonSandbox.spy(testSocket, 'on');

      // Act
      utils.hookSingleHandler(testSocket);
      testSocket.on(eventName);

      // Assert
      expect(onSpy).to.have.callCount(0);
    });
  });
});
