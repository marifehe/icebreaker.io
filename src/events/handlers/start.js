'use strict';

function onStart(_props) {
  console.log('>>>>> START event received.');
  const props = _props || {};
  const adapter = props.adapter;
  const clientCb = props.clientCb;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;

  adapter.create(socket, data.connId)
    .then(connId => {
      const response = {
        success: true,
        data: { connId }
      };
      clientCb(response);
    })
    .catch(error => {
      const response = {
        success: false,
        data: { error }
      };
      clientCb(response);
    });
}

module.exports = onStart;