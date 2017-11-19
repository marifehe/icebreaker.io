'use strict';

const io = require('socket.io');
const utils = require('./utils');

const DEFAULT_SOCKET_PATH = '/socket';

class _SignalingServer {
  /**
   * Constructs the signaling server (it has the same signature
   * that socket.io since it starts the socket server through it).
   *
   * - If no path is provided, '/socket' default one will be used.
   *
   * @param {http.Server|Number|Object} http server, port or options
   * @param {Object} [opts]
   * @api public
   */
  constructor(httpServer, opts) {
    if (typeof httpServer === 'object' && !httpServer.listen) {
      opts = httpServer;
      httpServer = null;
    }
    opts = opts || {};
    opts.path = opts.path || DEFAULT_SOCKET_PATH;
    this.serverSocket = io(httpServer, opts);

    // Ensures only one handler per eventName is registered
    utils.hookSingleHandler(this.serverSocket);

    // Binding
    this.onConnection = this.onConnection.bind(this);

    
    this.serverSocket.on('connection', this.onConnection);
  }

  onConnection() {
    console.log('Client connected!')
  }

}

// This allows calling signalingServer without the 'new'
const SignalingServer = (httpServer, opts) => {
  return new _SignalingServer(httpServer, opts);
}
module.exports = SignalingServer;