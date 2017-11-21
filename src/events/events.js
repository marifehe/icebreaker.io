'use strict';

const onIceCandidate = require('./handlers/ice-candidate');
const onSdp = require('./handlers/sdp');
const onStart = require('./handlers/start');
const onStop = require('./handlers/stop');

const events = {
  inbound: {
    'icebreaker.candidate': { handler: onIceCandidate },
    'icebreaker.sdp': { handler: onSdp },
    'icebreaker.start': { handler: onStart },
    'icebreaker.stop': { handler: onStop }
  }
};

module.exports = events;