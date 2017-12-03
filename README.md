
# icebreaker.io

icebreaker.io enables peer-to-peer real-time communications, using WebRTC technology. It is built on top of [socket.io](https://github.com/socketio/socket.io), and it basically allows two peers to resolve how to connect over the internet and start an RTCPeerConnection. It consists in:

- a Node.js server (this repository) needed for the signaling process
- a [Javascript client library](https://github.com/elbecita/icebreaker.io-client) for the browser

## Context

WebRTC enables peer-to-peer communications, but the signaling methods and protocols needed for peers to discover each other are not defined by it. The reasoning behind this is summarized in the [JavaScript Session Establishment Protocol (JSEP) IETF draft](https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-03#section-1.1). This is why a signaling server is needed, so peers can discover and exchange information prior to establishing the WebRTC connection, but also after that, like:
- [ICE](https://tools.ietf.org/html/rfc5245) candidates information.
- [Session Description](https://tools.ietf.org/html/rfc4566) metadata (media details, transport addresses, etc).
- Errors.
- Remote peer disconnection.
- Etc.

## Installation

```bash
npm install icebreaker.io --save
```

## How to use

icebreaker.io uses the same interface as [socket.io](https://github.com/socketio/socket.io), since it is built on top of it. As an example, below you can find how to start icebreaker.io along with Express:

```js
const express = require('express');
const https = require('https');
const credentials = require('../your-credentials'); // credentials are needed for HTTPS
const icebreaker = require('icebreaker.io');

const app = express();
const server = https.createServer(credentials, app);
server.listen(8443);
// start signaling server
icebreaker(server);
```

### Demo project
You can find a fully working demo project that uses both server and client icebreaker.io libraries [here](https://github.com/elbecita/icebreaker.io-demo). It is a very basic video-chat application.

## Tests

```
npm run test
```
This command runs the `gulp` task `test`, which runs the unit tests in the `tests` directory.


## License

[GPLv3](LICENSE)
