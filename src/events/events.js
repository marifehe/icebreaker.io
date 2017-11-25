'use strict';

const onIceCandidate = require('./handlers/ice-candidate');
const onSdp = require('./handlers/sdp');
const onStart = require('./handlers/start');
const onStop = require('./handlers/stop');

const events = {
  inbound: {
    'icebreaker.io.candidate': { handler: onIceCandidate },
    'icebreaker.io.sdp': { handler: onSdp },
    'icebreaker.io.start': { handler: onStart },
    'icebreaker.io.stop': { handler: onStop }
  },
  outbound: {
    REMOTE_ICE_CANDIDATE: 'icebreaker.io.remoteCandidate',
    REMOTE_SDP: 'icebreaker.io.remoteSdp'
  }
};

module.exports = events;