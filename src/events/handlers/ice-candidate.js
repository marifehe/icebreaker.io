'use strict';

const ResponseHelper = require('./response-helper');
const events = require('../events');

function onIceCandidate(_props) {
  console.log('>>>>> ICE CANDIDATE event received.');
  const props = _props || {};
  const adapter = props.adapter;
  const clientCb = props.clientCb;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;

  if (data.connId && data.candidate) {
    adapter.get(data.connId)
      .then(connection => {
        if (connection.peers && connection.peers.length > 1) {
          const remoteSocket = (connection.peers[0].id === socket.id) ?
            connection.peers[1] : connection.peers[0];
          const socketMessage = {
            connId: data.connId,
            data: { candidate: data.candidate }
          };
          remoteSocket.emit(events.outbound.REMOTE_ICE_CANDIDATE, socketMessage);
        }
      })
      .catch(error => {
        ResponseHelper.failure(error, clientCb);
      });
    } else {
      const error = 'Missing data in socket message. connId and candidate fields are expected.';
      ResponseHelper.failure(error, clientCb);
    }
}

module.exports = onIceCandidate;