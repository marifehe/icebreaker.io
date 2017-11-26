'use strict';

const ResponseHelper = require('./response-helper');

function onStop(_props) {
  console.log('>>>>> STOP event received.');
  const props = _props || {};
  const adapter = props.adapter;
  const clientCb = props.clientCb;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;
  console.log('the connection id to stop is: ', data.connId);

  adapter.get(data.connId)
    .then(connection => {
      if (connection.peers && connection.peers.length > 1) {
        const remoteSocket = (connection.peers[0].id === socket.id) ?
          connection.peers[1] : connection.peers[0];
        console.log('>>>>> sending remoteStop')
        // TODO: fix events being undefined here
        remoteSocket.emit('icebreaker.io.remoteStop');
      }
      adapter.remove(data.connId)
        .then(() => ResponseHelper.success(null, clientCb))
        .catch(error => ResponseHelper.failure(error, clientCb));
    })
    .catch(error => ResponseHelper.failure(error, clientCb)); // nothing to do
}

module.exports = onStop;