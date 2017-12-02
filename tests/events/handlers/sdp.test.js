'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

const Adapter = require('../../../src/adapters/icebreaker.io-adapter');
const onSdp = require('../../../src/events/handlers/sdp');
const ResponseHelper = require('../../../src/events/handlers/response-helper');

describe('sdp event tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
  });

  it('shoud emit a remoteSdp event sending the sdp file to the remote peer', (done) => {
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
          sdp: 'test-sdp',
          connId: connection.id
        }
      }
    };
    const emitSpy = sinonSandbox.spy(remotePeerSocket, 'emit');
    sinonSandbox.stub(Adapter, 'get').callsFake(() => Promise.resolve(connection));
    sinonSandbox.stub(ResponseHelper, 'success').callsFake(() => {
      // Assert
      expect(emitSpy).to.have.been.calledWith('icebreaker.io.remoteSdp');
      done();
    });
    // Act
    onSdp(props);
  });

  it('shoud return the error to the client if the connection does not exist', (done) => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket,
      event: {
        data: {
          sdp: 'test-sdp',
          connId: 'test-connection-id'
        }
      }
    };
    const testError = 'test-error';
    sinonSandbox.stub(Adapter, 'get').callsFake(() => Promise.reject(testError));
    sinonSandbox.stub(ResponseHelper, 'failure').callsFake((error) => {
      // Assert
      expect(error).to.equal(testError);
      done();
    });
    // Act
    onSdp(props);
  });

  it('shoud return the error to the client if there is no connId in the received message', (done) => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket,
      event: {
        data: {
          sdp: 'test-sdp',
        }
      }
    };
    sinonSandbox.stub(ResponseHelper, 'failure').callsFake((error) => {
      // Assert
      expect(error).to.equal('Missing data in socket message. connId and sdp fields are expected.');
      done();
    });
    // Act
    onSdp(props);
  });

  it('shoud return the error to the client if there is no sdp in the received message', (done) => {
    // Arrange
    const localPeerSocket = {
      id: 'local-peer-id'
    };
    const props = {
      adapter: Adapter,
      socket: localPeerSocket,
      event: {
        data: {
          connId: 'test-connection-id'
        }
      }
    };
    sinonSandbox.stub(ResponseHelper, 'failure').callsFake((error) => {
      // Assert
      expect(error).to.equal('Missing data in socket message. connId and sdp fields are expected.');
      done();
    });
    // Act
    onSdp(props);
  });
});
