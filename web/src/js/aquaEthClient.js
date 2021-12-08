import { registerEthereum, listenerNodeCallback } from './compiled/aquaEth.js';
import { ethers, BigNumber } from 'ethers';

let provider;
let signer;

provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
if(provider) {
  signer = provider.getSigner();
}

function result(success, reason, code, message, data) {
  return { info: { success, reason, code, message }, data};
}

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
    this.registeredRemoteListeners = [];
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
    else if(!provider || !signer) {
      success = false;
      reason = 'error-no-ethers-init';
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

        return result(success, reason, code, message, accounts);
      },
      getBalance: async(account) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let balance = 0;

        if(success) {
          try {
            let res = await provider.getBalance(account);
            console.log('CHAIN', await provider.getNetwork());
            balance = res.toHexString();
          }
          catch(e) {
              success = false;
              code = e.code;
              message = e.message;
              reason = 'error-eth-rpc';

              console.log(e);
          }
        }
       
        return result(success, reason, code, message, balance);
      },
      getBlockNumber: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let blockNumber = 0;

        if(success) {
          try {
            blockNumber = await provider.getBlockNumber();
          }
          catch(e) {
              success = false;
              code = e.code;
              message = e.message;
              reason = 'error-ethers';

              console.log(e);
          }
        }

        return result(success, reason, code, message, blockNumber);
      },
      formatEther: async(amount) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let amountOut = 0;
      
        if(success) {
          try {
            amountOut = ethers.utils.formatEther(amount)
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      parseEther: async(amount) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let amountOut = 0;
      
        if(success) {
          try {
            let res = ethers.utils.parseEther(amount)
            amountOut = res.toString();
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      /**
       * Register a node to receive callbacks from window.ethereum events.
       * 
       * @param {string} listenerPeerId 
       * @param {string} listenerRelayId 
       */
      registerListenerNode: async(listenerPeerId, listenerRelayId) => {
        ethereum
        .removeAllListeners('accountsChanged')
        .removeAllListeners('chainChanged')
        .removeAllListeners('connect')
        .removeAllListeners('disconnect')
        .removeAllListeners('message')

        ethereum.on('accountsChanged', (accounts) => {
          console.log('Local: account changed', listenerPeerId, listenerRelayId);
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
        ethereum.on('connect', (connectInfo) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'connect',
              data: JSON.stringify(connectInfo)
          });
        });
        ethereum.on('disconnect', (providerRPCError) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'disconnect',
              data: JSON.stringify(providerRPCError)
          });
        });
        ethereum.on('message', (providerMessage) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'message',
              data: JSON.stringify(providerMessage)
          });
        });

        this._triggerEvent('registerListenerNode', 'registered', { 
          peerId: listenerPeerId, relayId: listenerRelayId
        });
      },
      receiveData: async(jsonPacket) => {
        console.log('RECEIVE', jsonPacket);
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