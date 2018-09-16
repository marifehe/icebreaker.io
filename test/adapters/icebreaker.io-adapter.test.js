'use strict';

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

const Adapter = require('../../src/adapters/icebreaker.io-adapter');

describe('Adapter tests', () => {
  let sinonSandbox;
  beforeEach(() => {
    sinonSandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sinonSandbox.restore();
    Adapter._flush();
  });

  describe('create()', () => {
    it('shoud create a new connection if no connId is provided', () => {
      // Arrange
      const peerSocket = 'test-socket';

      // Act & Assert
      return Adapter.create(peerSocket)
        .then((connection) => {
          expect(connection.id).to.be.a('string');
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        });
    });

    it('shoud create a new connection if a connection for the provided' +
      'connId does not exist yet', () => {
      // Arrange
      const connId = 'test-connId';
      const peerSocket = 'test-socket';

      // Act & Assert
      return Adapter.create(peerSocket, connId)
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        });
    });

    it('shoud join the socket to the connection if it exists for the provided' +
      'connId already', () => {
      // Arrange
      const connId = 'test-connId';
      const peerSocket = 'test-socket';
      const peerSocket2 = 'test-socket2';

      // Act & Assert
      return Adapter.create(peerSocket, connId)
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        })
        .then(() => Adapter.create(peerSocket2, connId))
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(2);
          expect(connection.peers[1]).to.equal(peerSocket2);
        });
    });

    it('shoud reject if there is no room for another socket for the' +
      'provided connId', (done) => {
      // Arrange
      const connId = 'test-connId';
      const peerSocket = 'test-socket';
      const peerSocket2 = 'test-socket2';
      const peerSocket3 = 'test-socket3';

      // Act & Assert
      Adapter.create(peerSocket, connId)
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        })
        .then(() => Adapter.create(peerSocket2, connId))
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(2);
          expect(connection.peers[1]).to.equal(peerSocket2);
        })
        .then(() => Adapter.create(peerSocket3, connId))
        .catch((error) => {
          expect(error).to.equal('No room for a new peer in this connection.');
          done();
        });
    });
  });

  describe('get()', () => {
    it('shoud return the connection if it exists', () => {
      /// Arrange
      const connId = 'test-connId';
      const peerSocket = 'test-socket';

      // Act & Assert
      return Adapter.create(peerSocket, connId)
        .then(() => Adapter.get(connId))
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        });
    });

    it('shoud reject if the connection does not exist', (done) => {
      // Act & Assert
      Adapter.get('non-existent-connId')
        .catch((error) => {
          expect(error).to.equal('Connection not found.');
          done();
        });
    });
  });

  describe('getByPeerId()', () => {
    it('shoud return the connection if it exists', () => {
      /// Arrange
      const connId = 'test-connId';
      const peerSocket = {
        id: 'test-socket'
      };

      // Act & Assert
      return Adapter.create(peerSocket, connId)
        .then(() => Adapter.getByPeerId(peerSocket.id))
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        });
    });

    it('shoud reject if the connection does not exist', (done) => {
      // Act & Assert
      Adapter.getByPeerId('non-existent-peerId')
        .catch((error) => {
          expect(error).to.equal('Connection not found.');
          done();
        });
    });
  });

  describe('remove()', () => {
    it('shoud remove the connection', (done) => {
      /// Arrange
      const connId = 'test-connId';
      const peerSocket = 'test-socket';

      // Act & Assert
      Adapter.create(peerSocket, connId)
        .then(() => Adapter.get(connId))
        .then((connection) => {
          expect(connection.id).to.equal(connId);
          expect(connection.peers.length).to.equal(1);
          expect(connection.peers[0]).to.equal(peerSocket);
        })
        .then(() => Adapter.remove(connId))
        .then(() => Adapter.get(connId))
        .catch((error) => {
          expect(error).to.equal('Connection not found.');
          done();
        });
    });
  });
});
