import { registerEthereum, listenerNodeCallback } from './compiled/aquaEth.js';
import { ethers, BigNumber } from 'ethers';
import { cloneObj } from './helpersHTML.js';
import chainsJSON from '../data/chains.json';
import { erc20Abi } from '../data/contractData.js';
let chains;

let provider;
let signer;

provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
if(provider) {
  signer = provider.getSigner();
}

function result(success, reason, code, message, data) {
  return { info: { success, reason, code, message }, data};
}

function getChainInfo(chainsJSON, id) {
  if(!chains) {
    try {
      chains = JSON.parse(chainsJSON);
    }
    catch(e) {
      console.log(e);
    };
  }

  let chainInfo = {
    name: 'Unknown',
    chainId: id,
    currency: {
      name: 'Unknown'
    }
  };

  for(let chain of chains) {
    if(chain.chainId === id) {
      let rawInfo = cloneObj(chain);
      chainInfo = {
        name: rawInfo.name,
        chainId: rawInfo.chainId,
        shortName: rawInfo.shortName, 
        network: rawInfo.network, 
        networkId: rawInfo.networkId, 
        currency: {
          name: rawInfo.nativeCurrency.name,
          symbol: rawInfo.nativeCurrency.symbol,
          decimals: rawInfo.nativeCurrency.decimals,
        } 
      }
      break;
    }
  }

  return chainInfo;
}

function callbackAllListeners(o, type, data) {
  for(let peerId of Object.keys(o.registeredRemoteListeners)) {
    let relayId = o.registeredRemoteListeners[peerId].relayId;
    listenerNodeCallback(peerId, relayId, { type, data: JSON.stringify(data) });
  }
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
    this.registeredRemoteListeners = {};
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
      getConnectedChainInfo: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let chainInfo = {};
      
        if(success) {
          try {
            let res = await provider.getNetwork();
            let chainId = res.chainId;
            chainInfo = getChainInfo(chainsJSON, chainId);
            console.log('CI', chainInfo)
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, chainInfo);
      },
      getChainInfo: async(chainId) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let chainInfo = {};
      
        if(success) {
          try {
            chainInfo = getChainInfo(chainsJSON, chainId);
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, chainInfo);
      },
      getBalance: async(account) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let balance = 0;

        if(success) {
          try {
            let res = await provider.getBalance(account);
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
      getTransactionCount: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let transactionCount = 0;

        if(success) {
          try {
            transactionCount = await signer.getTransactionCount();
          }
          catch(e) {
              success = false;
              code = e.code;
              message = e.message;
              reason = 'error-ethers';

              console.log(e);
          }
        }

        return result(success, reason, code, message, transactionCount);
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
      tellListener: async(type, data) => {
        for(let peerId in Object.keys(this.registeredRemoteListeners)) {
          let relayId = this.registeredRemoteListeners[peerId].relayId;
          listenerNodeCallback(peerId, relayId, { type, data: JSON.stringify(data) });
        }
      },
      sendTransaction: async(transactionRequest) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let transactionResult = 0;
      
        if(success) {
          try {
            transactionRequest.value = ethers.utils.parseEther(transactionRequest.value);
            transactionResult = await signer.sendTransaction(transactionRequest)
            callbackAllListeners(this, 'transactionCreated', transactionResult);

            let superfly = this;
            provider.once(transactionResult.hash, function(transaction) {
              callbackAllListeners(superfly, 'transactionMined', transaction);
            });
            let conf = await transactionResult.wait;
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, transactionResult);
      },
      erc20BalanceOf: async(contractAddress, account) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let balance = 0;
 
        if(success) {
          try {
            console.log('acc', contractAddress, account, erc20Abi);
            let contract = new ethers.Contract(contractAddress, erc20Abi, signer); 
            let res = await contract.balanceOf(account);
            balance = res.toHexString();
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }

        return result(success, reason, code, message, balance);
      },
      erc20Transfer: async(contractAddress, to, amount) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let txSuccess = false;
      
        if(success) {
          try {
            let contract = new ethers.Contract(contractAddress, erc20Abi, signer); 
            contract.on('Transfer', (data))
            txSuccess = await contract.transfer(to, BigInt(amount));
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, txSuccess);
      },
      signTypedData: async(domainJSON, typesJSON, valueJSON) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let signature = '';
        let domain, types, value;
      
        if(success) {
          try {
            console.log('dom', domainJSON);
            domain = JSON.parse(domainJSON);
            console.log('types', typesJSON);
            types = JSON.parse(typesJSON);
            console.log('value', valueJSON);
            value = JSON.parse(valueJSON);
          }
          catch(e) {
            success = false;
            reason = 'error-json-parse';
            message = e.toString();
          }
        }

        if(success) {
          try {
            console.log('pre sig');
            signature = await signer._signTypedData(domain, types, value);
            console.log('post sig');
            callbackAllListeners(this, 'signedTypedData', signature);
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, signature);
      },
      /**
       * Register a node to receive callbacks from window.ethereum events.
       * 
       * @param {string} listenerPeerId 
       * @param {string} listenerRelayId 
       */
      registerListenerNode: async(listenerPeerId, listenerRelayId) => {
        if(!(listenerPeerId in this.registeredRemoteListeners)) {
          this.registeredRemoteListeners[listenerPeerId] = {
            relayId: listenerRelayId
          }
        }

        ethereum
        .removeAllListeners('accountsChanged')
        .removeAllListeners('chainChanged')
        .removeAllListeners('connect')
        .removeAllListeners('disconnect')
        .removeAllListeners('message')

        ethereum.on('accountsChanged', (accounts) => {
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'accountsChanged',
              data: JSON.stringify(accounts)
          });
        });
        ethereum.on('chainChanged', (chainId) => {
          let intChainId = parseInt(chainId);
          let chainInfo = getChainInfo(chainsJSON, intChainId);
          listenerNodeCallback(listenerPeerId, listenerRelayId, {
              type: 'chainChanged',
              data: JSON.stringify(chainInfo)
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
          this._triggerEvent('receiveData', jsonPacket.type, jsonPacket.data, false, 'error-json-parse');
          console.log(e);
        }
      },
      castErrorResultU32ToTransaction: async(resultU32) => {
        let resultTransction = { 
          info: { ...resultU32.info },
          data: { }
        }
        return resultTransction;
      },
      changeTransactionRequestNonce: async(transactionRequest, nonce) => {
        transactionRequest.nonce = nonce;
        return transactionRequest;
      }
    });
  }

  _triggerEvent(method, type, data={}, success=true, reason='ok') {
    if(this.eventListener) {
      this.eventListener({ method, type, success, reason, data });
    }
  }
}

export default AquaEthClient;