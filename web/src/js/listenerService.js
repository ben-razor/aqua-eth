import { registerListener } from './compiled/listener.js';

export default class ListenerService {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.init();
  }

  init() {
    registerListener({
      receiveData: async(jsonPacket, particle) => {
        console.log('RECEIVE', jsonPacket, particle.initPeerId);
        try {
          let data = JSON.parse(jsonPacket.data);
          this._triggerEvent('receiveData', jsonPacket.type, data);
        }
        catch(e) {
          this._triggerEvent('receiveData', jsonPacket.type, jsonPacket.data, false, 'error-json-parse');
          console.log(e);
        }
      }
    });
  }

  _triggerEvent(method, type, data={}, success=true, reason='ok') {
    if(this.eventListener) {
      this.eventListener({ method, type, success, reason, data });
    }
  }
}