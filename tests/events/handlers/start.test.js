'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Adapter = require('../../../src/adapters/icebreaker.io-adapter');
const onStart = require('../../../src/events/handlers/start');
const ResponseHelper = require('../../../src/events/handlers/response-helper');

describe('start event tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  it('shoud create the connection', (done) => {
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
    };
    sinonSandbox.stub(Adapter, 'create').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(ResponseHelper, 'success').callsFake((data) => {
      // Assert
      expect(data.connId).to.equal(connection.id);
      expect(data.isNew).to.be.true;
      done();
    });
    // Act
    onStart(props);
  });

  it('shoud return isNew set to false if the connection already existed', (done) => {
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
      socket: localPeerSocket,
      event: {
        data: {
          connId: connection.id
        }
      }
    };
    sinonSandbox.stub(Adapter, 'create').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(ResponseHelper, 'success').callsFake((data) => {
      // Assert
      expect(data.connId).to.equal(connection.id);
      expect(data.isNew).to.be.false;
      done();
    });
    // Act
    onStart(props);
  });

  it('shoud emit a remotePeerJoined event if the peer is joining an existing connection', (done) => {
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
      socket: localPeerSocket,
      event: {
        data: {
          connId: connection.id
        }
      }
    };
    sinonSandbox.stub(Adapter, 'create').callsFake(() => Promise.resolve(connection));
    const emitSpy = sinonSandbox.spy(remotePeerSocket, 'emit');
    sinonSandbox.stub(ResponseHelper, 'success').callsFake(() => {
      // Assert
      expect(emitSpy).to.have.been.calledWith('icebreaker.io.remotePeerJoined');
      done();
    });
    // Act
    onStart(props);
  });

  it('shoud return the error to the client if the connection can not be created', (done) => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket
    };
    const testError = 'test-error-when-creating-connection';
    sinonSandbox.stub(Adapter, 'create').callsFake(() => Promise.reject(testError));
    sinonSandbox.stub(ResponseHelper, 'failure').callsFake((error) => {
      // Assert
      expect(error).to.equal(testError);
      done();
    });
    // Act
    onStart(props);
  });
});
