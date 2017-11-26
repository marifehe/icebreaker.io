'use strict';

const ResponseHelper = require('./response-helper');

function notifyRemotePeer(adapter, connId, localSocket) {
  adapter.get(connId)
    .then(connection => {
      if (connection.peers && connection.peers.length > 1) {
        const remoteSocket = (connection.peers[0].id === localSocket.id) ?
          connection.peers[1] : connection.peers[0];
        // TODO: fix events being undefined here
        remoteSocket.emit('icebreaker.io.remotePeerJoined');
      }
    });
}

/**
* Allocates the peer socket in a new/existing connection, depending on
* the connId received. If another peer is alredy allocated in the connection
* and waiting, then a "remotePeerJoined" message is sent to let it know so
* the webRTC connection can start.
*/
function onStart(_props) {
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
        notifyRemotePeer(adapter, connId, socket);
      }
    })
    .catch(error => ResponseHelper.failure(error, clientCb));
}

module.exports = onStart;
