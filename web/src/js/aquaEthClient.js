import { registerEthereum, listenerNodeCallback } from './compiled/aquaEthCompiled.js';
import Web3 from 'web3';

/**
 * This class contains the implementation for a Fluence service that wraps
 * window.ethereum (as injected by MetaMask).
 */
 class AquaEthClient {
  /**
   * 
   * An event listener callback can be passed to trigger updates on the remote
   * side of process (the client whose MetaMask is being used).
   * 
   * The event listener will be passed an object as its only parameter.
   *  
   * this.eventListener({ method, type, success, reason, data });
   * 
   * E.g. 
   * 
   * this._triggerEvent('requestAccounts', 'connect', accounts);
   * 
   * This will send an event from the requestAccounts service method, it happened
   * in the "connect" part of the process. accounts is an array of eth accounts
   * 
   * @param {function} eventListener  
   */
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.init();
  }

  checkEthStatus() {
    let success = true;
    let reason = 'ok';
    let message = '';
    let code = 0;

    if(!window.ethereum) {
      success = false;
      reason = 'error-no-ethereum';
      this._triggerEvent('', '', {}, success, reason);
    }

    return { success, reason, message, code };
  }

  init() {
    registerEthereum({
      requestAccounts: async () => {
        let { success, reason, message, code } = this.checkEthStatus();
        let accounts = [];

        if(success) {
          try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this._triggerEvent('requestAccounts', 'connect', accounts);
          }
          catch(error) {
            success = false;
            reason = 'error-eth-rpc';
            message = error.message;
            code = error.code;

            if (error.code === 4001) {
              this._triggerEvent('requestAccounts', 'connect', error, false, 'error-user-rejected');
            } 
            else {
              this._triggerEvent('requestAccounts', 'connect', error, false, 'error-connection-error');
            }

            console.log(error);
          }
        }

        return { success, reason, code, message, data: accounts};
      },
      getBalance: async(account) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let balance = 0;

        if(success) {
          try {
              balance = await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
          }
          catch(e) {
              success = false;
              code = e.code;
              message = e.message;
              reason = 'error-eth-rpc';

              console.log(e);
          }
        }
       
        return { success, reason, code, message, data: balance};
      },
      /**
       * Register a node to receive callbacks from window.ethereum events.
       * 
       * @param {string} listenerPeerId 
       * @param {string} listenerRelayId 
       */
      registerListenerNode: async(listenerPeerId, listenerRelayId) => {
        ethereum.on('accountsChanged', (accounts) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'accountsChanged',
              data: JSON.stringify(accounts)
          });
        });
        ethereum.on('chainChanged', (chainId) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'chainChanged',
              data: JSON.stringify(chainId)
          });
        });
        this._triggerEvent('registerListenerNode', 'registered', { 
          peerId: listenerPeerId, relayId: listenerRelayId
        });
      },
      receiveData: async(jsonPacket) => {
          try {
            let data = JSON.parse(jsonPacket.data);
            this._triggerEvent('receiveData', jsonPacket.type, data);
          }
          catch(e) {
            this._triggerEvent('receiveData', jsonPacket.type, jsonPacket.data, false, 'error-decoding-json');
        }
    },
  });
  }

  _triggerEvent(method, type, data={}, success=true, reason='ok') {
    if(this.eventListener) {
      this.eventListener({ method, type, success, reason, data });
    }
  }
}

export default AquaEthClient;