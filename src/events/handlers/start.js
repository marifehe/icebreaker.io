'use strict';

const ResponseHelper = require('./response-helper');
const events = require('../events').outbound;

function notifyRemotePeer(props) {
  const adapter = props.adapter;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;

  adapter.get(data.connId)
    .then(connection => {
      if (connection.peers && connection.peers.length > 1) {
        const remoteSocket = (connection.peers[0].id === socket.id) ?
          connection.peers[1] : connection.peers[0];
        // TODO: fix events being undefined here
        remoteSocket.emit('icebreaker.io.remotePeerJoined');
      }
    });
}

function onStart(_props) {
  console.log('>>>>> START event received: ');
  const props = _props || {};
  const adapter = props.adapter;
  const clientCb = props.clientCb;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;
  const connId = data.connId;

  adapter.create(socket, connId)
    .then(connection => {
      const data = {
        connId: connection.id,
        isNew: (connection.peers.length === 1)
      };
      ResponseHelper.success(data, clientCb);
      // If the local peer joined an existing connection, let the remote
      // one know
      if (connId) {
        notifyRemotePeer(props);
      }
    })
    .catch(error => ResponseHelper.failure(error, clientCb));
}

module.exports = onStart;