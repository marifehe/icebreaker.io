'use strict';

const ResponseHelper = require('./response-helper');

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
      ResponseHelper.success({ connId }, clientCb);
    })
    .catch(error => {
      ResponseHelper.failure(error, clientCb);
    });
}

module.exports = onStart;