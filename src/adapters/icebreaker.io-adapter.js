'use strict';

const shortid = require('shortid');

let connections = {};

/**
* Default in-memory webrtc-icebreaker adapter class
*/
class Adapter {
  /**
   * Links a peer socket with a connection id and saves it in memory.
   * - Generates a new connId if none is provided.
   * - Joins a connection if:
   *   - A connId is provided.
   *   - It exists in memory (i.e. another peer is already connected).
   *   - There is a free spot (only 2 peers per connection allowed).
   *
   * @param {Socket} peerSocket
   * @param {String} [_connId]
   */
  static create(peerSocket, _connId) {
    const connId = _connId || shortid.generate();
    const connection = connections[connId];
    if (!connection) {
      connections[connId] = {
        id: connId,
        peers: [peerSocket]
      };
      return Promise.resolve(connections[connId]);
    }
    if (connection.peers.length <= 1) {
      connection.peers.push(peerSocket);
      return Promise.resolve(connection);
    }
    return Promise.reject('No room for a new peer in this connection.');
  }

  static get(connId) {
    if (connId) {
      const connection = connections[connId];
      if (connection) {
        return Promise.resolve(connection);
      }
    }
    return Promise.reject('Connection not found.');
  }


  static getByPeerId(peerId) {
    let connFound;
    Object.keys(connections).some(connId => {
      const peerFound = connections[connId].peers.some(peer => peer.id === peerId);
      if (peerFound) {
        connFound = connections[connId];
        return true;
      }
    });
    if (connFound) return Promise.resolve(connFound);
    return Promise.reject('Connection not found.');
  }

  static remove(connId) {
    if (connId && connections[connId]) {
      //delete connections[connId].peers;
      delete connections[connId];
    }
    return Promise.resolve();
  }

  static _flush() {
    connections = {};
  }
}

module.exports = Adapter;
