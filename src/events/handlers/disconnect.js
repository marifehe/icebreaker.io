'use strict';

function onDisconnect(_props) {
  const props = _props || {};
  const adapter = props.adapter;
  const socket = props.socket;

  adapter.getByPeerId(socket.id)
    .then(connection => {
      if (connection.peers && connection.peers.length > 1) {
        const remoteSocket = (connection.peers[0].id === socket.id) ?
          connection.peers[1] : connection.peers[0];
        // TODO: fix events being undefined here
        remoteSocket.emit('icebreaker.io.remoteStop');
      }
      adapter.remove(connection.id);
    })
    .catch(() => {}); // nothing to do
}

module.exports = onDisconnect;
