'use strict';

const shortid = require('shortid');

const _connections = {};

/**
* Default in-memory webrtc-icebreaker adapter class
*/
class Adapter {
  static get Connections() {
    return _connections;
  }

  static get Constants() {
    return {
      MAX_PEERS: 2
    };
  }

  /**
   * Links a peer socket with a connection id and saves it in memory.
   * - Generates a new connId if none is provided.
   * - Joins a connection if:
   *   - A connId is provided.
   *   - It exists in memory (i.e. another peer is already connected).
   *   - There is a free spot (only 2 peers per connection allowed).
   *
   * @param {Socket} peerSocket
   * @param {string} [_connId]
   * @returns {object} connection
   */
  static create(peerSocket, _connId) {
    const connId = _connId || shortid.generate();
    const connection = Adapter.connections[connId];

    if (!connection) {
      Adapter.connections[connId] = {
        id: connId,
        peers: [peerSocket]
      };
      return Promise.resolve(Adapter.connections[connId]);
    }

    if (connection.peers.length < Adapter.Constants.MAX_PEERS) {
      connection.peers.push(peerSocket);
      return Promise.resolve(connection);
    }

    return Promise.reject('No room for a new peer in this connection.');
  }

  /**
  * Gets the connection for the provided id.
  * @param {string} connId
  * @returns {Promise} connection
  */
  static get(connId) {
    if (connId) {
      const connection = Adapter.connections[connId];

      if (connection) {
        return Promise.resolve(connection);
      }
    }

    return Promise.reject('Connection not found.');
  }

  /**
  * Gets the connection object for the provided peerId if it exists.
  * @param {string} peerId
  * @returns {Promise} connection
  */
  static getByPeerId(peerId) {
    let connFound;
    Object.keys(Adapter.connections).some((connId) => {
      const peerFound = Adapter.connections[connId].peers.some(peer => peer.id === peerId);

      if (peerFound) {
        connFound = Adapter.connections[connId];
        return true;
      }

      return false;
    });

    if (connFound) {
      return Promise.resolve(connFound);
    }

    return Promise.reject('Connection not found.');
  }

  /**
  * Removes the connection if it exists.
  * @param {string} connId
  * @returns {Promise}
  */
  static remove(connId) {
    if (connId && Adapter.connections[connId]) {
      delete Adapter.connections[connId];
    }

    return Promise.resolve();
  }

  /**
  * Cleans all the connections.
  */
  static _flush() {
    Adapter.connections = {};
  }
}

module.exports = Adapter;
