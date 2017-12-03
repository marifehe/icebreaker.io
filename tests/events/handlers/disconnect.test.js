'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Adapter = require('../../../src/adapters/icebreaker.io-adapter');
const onDisconnect = require('../../../src/events/handlers/disconnect');

describe('disconnect event tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  it('shoud emit a remoteStop event for the remote peer if it exists' +
    'and remove the connection', done => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const remotePeerSocket = {
      id: 'remote-peer-id',
      emit: () => {}
    };
    const connection = {
      id: 'test-connection-id',
      peers: [localPeerSocket, remotePeerSocket]
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket
    }
    const emitSpy = sinonSandbox.spy(remotePeerSocket, 'emit');
    sinonSandbox.stub(Adapter, 'getByPeerId').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(Adapter, 'remove').callsFake(connId => {
      // Assert
      expect(connId).to.equal(connection.id);
      expect(emitSpy).to.have.been.calledWith('icebreaker.io.remoteStop');
      done();
    });
    // Act
    onDisconnect(props);
  });

  it('shoud emit a remoteStop event for the remote peer if it exists' +
    'and remove the connection (test to cover peers index path)', done => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const remotePeerSocket = {
      id: 'remote-peer-id',
      emit: () => {}
    };
    const connection = {
      id: 'test-connection-id',
      peers: [remotePeerSocket, localPeerSocket]
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket
    }
    const emitSpy = sinonSandbox.spy(remotePeerSocket, 'emit');
    sinonSandbox.stub(Adapter, 'getByPeerId').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(Adapter, 'remove').callsFake(connId => {
      // Assert
      expect(connId).to.equal(connection.id);
      expect(emitSpy).to.have.been.calledWith('icebreaker.io.remoteStop');
      done();
    });
    // Act
    onDisconnect(props);
  });

  it('shoud not emit a remoteStop event if there is no remote peer in the connection', done => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const connection = {
      id: 'test-connection-id',
      peers: [localPeerSocket]
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket
    }
    sinonSandbox.stub(Adapter, 'getByPeerId').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(Adapter, 'remove').callsFake(connId => {
      // Assert
      expect(connId).to.equal(connection.id);
      done();
    });
    // Act
    onDisconnect(props);
  });

  it('shoud not do anything if the connection does not exist', done => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket
    }
    sinonSandbox.stub(Adapter, 'getByPeerId').callsFake(() => Promise.reject());
    const removeSpy = sinonSandbox.spy(Adapter, 'remove');
    // Act
    onDisconnect(props).then(() => {
      // Assert
      expect(removeSpy).to.have.callCount(0);
      done()
    });
  });
});
