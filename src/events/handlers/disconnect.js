'use strict';

/**
* Emits a message to the remote peer (if it exists) to let it know that
* the connection is going to be closed and removes the connection.
*/
function onDisconnect(_props) {
  const props = _props || {};
  const adapter = props.adapter;
  const socket = props.socket;

  return adapter.getByPeerId(socket.id)
    .then(connection => {
      if (connection.peers && connection.peers.length > 1) {
        const remoteSocket = (connection.peers[0].id === socket.id) ?
          connection.peers[1] : connection.peers[0];
        // TODO: fix events being undefined here
        remoteSocket.emit('icebreaker.io.remoteStop');
      }
      socket.conn.close();
      adapter.remove(connection.id);
    })
    .catch(() => socket.conn.close());
}

module.exports = onDisconnect;
