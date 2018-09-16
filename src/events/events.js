'use strict';

const onDisconnect = require('./handlers/disconnect');
const onIceCandidate = require('./handlers/ice-candidate');
const onSdp = require('./handlers/sdp');
const onStart = require('./handlers/start');

const events = {
  inbound: {
    disconnect: { handler: onDisconnect },
    'icebreaker.io.candidate': { handler: onIceCandidate },
    'icebreaker.io.sdp': { handler: onSdp },
    'icebreaker.io.start': { handler: onStart }
  },
  outbound: {
    REMOTE_ICE_CANDIDATE: 'icebreaker.io.remoteCandidate',
    REMOTE_PEER_JOINED: 'icebreaker.io.remotePeerJoined',
    REMOTE_SDP: 'icebreaker.io.remoteSdp',
    REMOTE_STOP: 'icebreaker.io.remoteStop'
  }
};

module.exports = events;
