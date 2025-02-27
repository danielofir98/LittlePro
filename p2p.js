// p2p.js
class P2PNetwork {
    constructor() {
      console.log("Initializing P2P network (stub)");
    }
    connect(peerId) {
      console.log("Connecting to peer:", peerId);
    }
    sendMessage(peerId, message) {
      console.log("Sending message to", peerId, message);
    }
    onMessage(callback) {
      console.log("Registering onMessage callback");
    }
  }
  
  module.exports = new P2PNetwork();