'use strict';

function hookSingleHandler(socket) {
  const origOn = socket.on;
  socket.on = (eventName, listener) => {
    if (socket.listenerCount(eventName) === 0) {
      return origOn.call(socket, eventName, listener);
    }
    return socket;
  }
}

const utils = {
  hookSingleHandler
};

module.exports = utils;