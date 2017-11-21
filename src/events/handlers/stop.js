'use strict';

function onStop(_props) {
  console.log('>>>>> STOP event received.');
  const props = _props || {};
  const adapter = props.adapter;
  const clientCb = props.clientCb;
  const event = props.event;
  const data = event.data || {};
  const socket = props.socket;

  adapter.remove(data.connId)
    .then(() => {
      const response = {
        success: true
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

module.exports = onStop;