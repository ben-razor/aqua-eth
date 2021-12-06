import { registerEthereum } from './compiled/aquaEth.js';
import Web3 from 'web3';

export default class AquaEthClient {
  constructor(eventListener) {
    this.eventListener = eventListener;
    this.init();
  }

  init() {
    registerEthereum({
      enable: async () => {
        let accounts = [];

        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          this._triggerEvent('enable', 'connect', accounts);
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            this._triggerEvent('enable', 'connect', error, false, 'error-user-rejected');
          } 
          else {
            this._triggerEvent('enable', 'connect', error, false, 'error-connection-error');
          }
        });
      },
      getAccounts: async() => {
        let accounts = [];

        try {
            accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        } catch(e) {}

        return accounts;
      },
      registerListenerNode: async(listenerPeerId, listenerRelayId) => {
        ethereum.on('accountsChanged', (accounts) => {
            console.log('cba ', accounts);
            listenerNodeCallback(listenerPeerId, listenerRelayId, accounts);
        });
      },
      receiveAccounts: async(accounts) => {
          console.log(accounts);
      },
      getBalance: async(account) => {
        let success = true;
        let reason = 'ok';
        let message = '';
        let code = 0;
        let balance = 0;
        
        try {
            balance = await ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] });
        }
        catch(e) {
            console.log(e);
            code = e.code;
            message = e.message;
            reason = 'error-eth-rpc';
        }
        
        return {success, reason, code, message, data: balance};
      }
    });
  }

  _triggerEvent(method, type, data={}, success=true, reason='ok') {
    if(this.eventListener) {
      this.eventListener({ method, type, success, reason, data });
    }
  }
}