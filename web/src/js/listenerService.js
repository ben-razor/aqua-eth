import { registerListener } from './compiled/listener.js';

export default class ListenerService {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.init();
  }

  init() {
    registerListener({
      receiveData: async(jsonPacket, particle) => {
        let initPeerId = particle.initPeerId;

        try {
          console.log('PACKET', jsonPacket, jsonPacket.data);
          let data = JSON.parse(jsonPacket.data);
          this._triggerEvent('receiveData', jsonPacket.type, data, true, 'ok', initPeerId);
        }
        catch(e) {
          this._triggerEvent('receiveData', jsonPacket.type, jsonPacket.data, false, 'error-json-parse', initPeerId);
          console.log(e);
        }
      }
    });
  }

  _triggerEvent(method, type, data={}, success=true, reason='ok', initPeerId) {
    if(this.eventListener) {
      this.eventListener({ method, type, success, reason, data, initPeerId });
    }
  }
}