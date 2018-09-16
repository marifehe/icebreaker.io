'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const proxyquire = require('proxyquire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

const socketMock = {
  id: 'icebreaker.io-test-socket-id',
  on: () => {}
};
const ioMock = (httpServer, opts) => {
  socketMock.httpServer = httpServer;
  socketMock.opts = opts;
  return socketMock;
};

const SignalingServer = proxyquire('../src/signaling-server', {
  'socket.io': ioMock
});
const DEFAULT_ADAPTER = require('../src/adapters/icebreaker.io-adapter');
const inboundEvents = require('../src/events/events').inbound;

describe('SignalingServer tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  describe('constructor()', () => {
    it.only('shoud initialize the server socket', () => {
      // Arrange
      const httpServer = {
        id: 'test-http-server',
        listen: () => {}
      };
      const onSpy = sinonSandbox.spy(socketMock, 'on');

      // Act
      const signalingServer = SignalingServer(httpServer, null);

      // Assert
      expect(signalingServer.serverSocket.id).to.equal(socketMock.id);
      expect(signalingServer.adapter).to.equal(DEFAULT_ADAPTER);
      expect(socketMock.opts.path).to.equal('/socket');
      expect(onSpy).to.have.been.calledWith('connection', signalingServer.onConnection);
    });
  });

  describe('onConnection()', () => {
    it('should bind event handlers', () => {
      // Arrange
      const signalingServer = SignalingServer();
      const bindEventHandlersStub = sinonSandbox.stub(signalingServer, 'bindEventHandlers');
      const testSocket = 'test-socket';
      // Act
      signalingServer.onConnection(testSocket);

      // Assert
      expect(bindEventHandlersStub).to.have.been.calledWith(testSocket);
    });
  });

  describe('bindEventHandlers()', () => {
    it('should bind the event handlers for each event', () => {
      // Arrange
      const signalingServer = SignalingServer();
      const testSocket = {
        on: () => {}
      };
      const onSpy = sinonSandbox.spy(testSocket, 'on');

      // Act
      signalingServer.bindEventHandlers(testSocket);

      // Assert
      const eventNames = Object.keys(inboundEvents);
      expect(onSpy).to.have.callCount(eventNames.length);
      eventNames.forEach((name) => {
        expect(onSpy).to.have.been.calledWith(name);
      });
    });
  });
});
