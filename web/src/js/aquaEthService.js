import { registerEthereum, listenerNodeCallback } from './compiled/aquaEth.js';
import { ethers, BigNumber } from 'ethers';
import { cloneObj } from './helpersHTML.js';
import chainsJSON from '../data/chains.json';
import { erc20Abi } from '../data/contractData.js';
let chains;

function createSuccessInfo() {
  return { success: true, reason: 'ok', code: 0, message: ''};
}

function createErrorInfo(reason='error', code=0, message='') {
  return { success: false, reason, code, message };
}

function result(success, reason, code, message, data) {
  return { info: { success, reason, code, message }, data};
}

export function getEthereum() {
  let success = true;
  let reason = 'ok';
  let data = {};

  if(window && window.ethereum) { 
    data.ethereum = ethereum;
  }
  else {
    success = false;
    reason = 'error-no-ethereum';
  }

  return result(success, reason, 0, '', data);
}

export function createWeb3Provider(externalProvider) {
  let success = true;
  let reason = 'ok';
  let data = {};

  if(window && window.ethereum) { 
    let provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    if(provider) {
      let signer = provider.getSigner();
      data = { provider, signer };
    }
    else {
      success = false;
      reason = 'error-creating-provider';
    }
  }
  else {
    success = false;
    reason = 'error-no-ethereum';
  }

  return result(success, reason, 0, '', data);
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
 class AquaEthService {
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
  constructor(provider, signer, eventListener) {
    this.eventListener = eventListener;
    this.registeredRemoteListeners = {};
    this.provider = provider;
    this.signer = signer;
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
    else if(!this.provider || !this.signer) {
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
          catch(e) {
            success = false;
            reason = 'error-eth-rpc';
            message = e.message;
            code = e.code;

            if (e.code === 4001) {
              this._triggerEvent('requestAccounts', 'connect', e, false, 'error-user-rejected');
            } 
            else {
              this._triggerEvent('requestAccounts', 'connect', e, false, 'error-connection-error');
            }

            console.log(e);
          }
        }

        return result(success, reason, code, message, accounts);
      },
      getConnectedChainInfo: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let chainInfo = {};
      
        if(success) {
          try {
            let res = await this.provider.getNetwork();
            let chainId = res.chainId;
            chainInfo = getChainInfo(chainsJSON, chainId);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
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
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
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
            let res = await this.provider.getBalance(account);
            balance = res.toHexString();
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-eth-rpc', e.code, e.messsage));
              console.log(e);
          }
        }
       
        return result(success, reason, code, message, balance);
      },
      getFeeData: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let feeData = {};

        if(success) {
          try {
            let res = await this.provider.getFeeData();

            feeData.gasPrice = res.gasPrice.toString();
            feeData.maxFeePerGas = res.maxFeePerGas?.toString() || 0;
            feeData.maxPriorityFeePerGas = res.maxPriorityFeePerGas?.toString() || 0;
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-eth-rpc', e.code, e.messsage));
              console.log(e);
          }
        }
       
        return result(success, reason, code, message, feeData);
      },
      getBlockNumber: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let blockNumber = 0;

        if(success) {
          try {
            blockNumber = await this.provider.getBlockNumber();
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
              console.log(e);
          }
        }

        return result(success, reason, code, message, blockNumber);
      },
      getBlock: async(blockNumber) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let block = {};

        if(success) {
          try {
            block = await this.provider.getBlock(blockNumber);
            block.gasLimit = block.gasLimit.toString();
            block.gasUsed = block.gasUsed.toString();
            if(block.baseFeePerGas) {
              block.baseFeePerGas = block.baseFeePerGas.toString();
            }
            delete block._difficulty;
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
              console.log(e);
          }
        }

        return result(success, reason, code, message, block);
      },
      getTransactionCount: async() => {
        let { success, reason, message, code } = this.checkEthStatus();
        let transactionCount = 0;

        if(success) {
          try {
            transactionCount = await this.signer.getTransactionCount();
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
              console.log(e);
          }
        }

        return result(success, reason, code, message, transactionCount);
      },
      getTransaction: async(id) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let transaction = {};

        if(success) {
          try {
            transaction = await this.provider.getTransaction(id);
            transaction.gasLimit = transaction.gasLimit.toString();
            transaction.gasPrice = transaction.gasPrice.toString();

            if(transaction.maxFeePerGas) {
              transaction.maxFeePerGas = transaction.maxFeePerGas.toString(); 
            }
            if(transaction.maxPriorityFeePerGas) {
              transaction.maxPriorityFeePerGas = transaction.maxPriorityFeePerGas.toString(); 
            }
            if(transaction.value) {
              transaction.value = transaction.value.toString();
            }
            if(transaction.wait) {
              delete transaction.wait;
            }
            if(transaction.accessList) {
              delete transaction.accessList;
            }
          }
          catch(e) {
              ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
              console.log(e);
          }
        }

        return result(success, reason, code, message, transaction);
      },
      formatUnits: async(amount, unit) => {
        let { success, reason, message, code } = createSuccessInfo();
        let amountOut = 0;
      
        if(success) {
          try {
            amountOut = ethers.utils.formatUnits(amount, unit);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      formatEther: async(amount) => {
        let { success, reason, message, code } = createSuccessInfo();
        let amountOut = 0;
      
        if(success) {
          try {
            amountOut = ethers.utils.formatEther(amount)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      parseUnits: async(amount, unit) => {
        let { success, reason, message, code } = createSuccessInfo();
        let amountOut = 0;
      
        if(success) {
          try {
            let res = ethers.utils.parseUnits(amount, unit);
            amountOut = res.toString();
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      parseEther: async(amount) => {
        let { success, reason, message, code } = createSuccessInfo();
        let amountOut = 0;
      
        if(success) {
          try {
            let res = ethers.utils.parseEther(amount)
            amountOut = res.toString();
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, amountOut);
      },
      keccak256Text: async(text) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.id(text)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      keccak256: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.keccak256(data)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      ripemd160: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.ripemd160(data)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      sha256: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.sha256(data)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      sha512: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.sha512(data)
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      computeHmac: async(algorithm, key, data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.computeHmac(algorithm, key, data);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      arrayify: async(value) => {
        let { success, reason, message, code } = createSuccessInfo();
        let arr = [];
      
        if(success) {
          try {
            let uint8Array = ethers.utils.arrayify(value);
            arr = Array.from(uint8Array);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, arr);
      },
      hexValue: async(value) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.hexValue(BigNumber.from(value));
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      stripZeros: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let arr = [];
      
        if(success) {
          try {
            let uint8Array = ethers.utils.stripZeros(data);
            arr = Array.from(uint8Array);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, arr);
      },
      zeroPad: async(data, length) => {
        let { success, reason, message, code } = createSuccessInfo();
        let arr = [];
      
        if(success) {
          try {
            let uint8Array = ethers.utils.zeroPad(data, length);
            arr = Array.from(uint8Array);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, arr);
      },
      hexConcat: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let arr = 0;
      
        if(success) {
          try {
            arr = ethers.utils.hexConcat(data);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, arr);
      },
      hexDataLength: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.hexDataLength(data);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      hexDataSlice: async(data, offset, endOffset) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            if(isNaN(endOffset)) {
              hexString = ethers.utils.hexDataSlice(data, offset);
            }
            else {
              hexString = ethers.utils.hexDataSlice(data, offset, endOffset);
            }
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      hexStripZeros: async(data) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.hexStripZeros(data);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
      },
      hexZeroPad: async(data, length) => {
        let { success, reason, message, code } = createSuccessInfo();
        let hexString = 0;
      
        if(success) {
          try {
            hexString = ethers.utils.hexZeroPad(data, length);
          }
          catch(e) {
            ({ success, reason, message, code} = createErrorInfo('error-ethers', e.code, e.messsage));
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, hexString);
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
            transactionResult = await this.signer.sendTransaction(transactionRequest)
            callbackAllListeners(this, 'transactionCreated', transactionResult);

            let superfly = this;
            this.provider.once(transactionResult.hash, function(transaction) {
              callbackAllListeners(superfly, 'transactionMined', transaction);
            });
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
      erc20Connect: async(contractAddress) => {
        console.log('erc20 1');
        let { success, reason, message, code } = this.checkEthStatus();
        let info = {};
 
        if(success) {
          try {
            let contract = new ethers.Contract(contractAddress, erc20Abi, signer); 
            let name = await contract.name();
            let symbol = await contract.symbol();
            let decimals = await contract.decimals();
            info = { name, symbol, decimals, address: contractAddress };
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }

        return result(success, reason, code, message, info);
      },
      erc20BalanceOf: async(contractAddress, account) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let balance = 0;
 
        if(success) {
          try {
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
            let transactionResult = await contract.transfer(to, BigInt(amount));
            callbackAllListeners(this, 'transactionCreated', transactionResult);

            let superfly = this;
            this.provider.once(transactionResult.hash, function(transaction) {
              callbackAllListeners(superfly, 'transactionMined', transaction);
            });
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
            domain = JSON.parse(domainJSON);
            types = JSON.parse(typesJSON);
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
            signature = await this.signer._signTypedData(domain, types, value);
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
      verifyTypedData: async(domainJSON, typesJSON, valueJSON, signature) => {
        let { success, reason, message, code } = this.checkEthStatus();
        let address = '';
        let domain, types, value;
      
        if(success) {
          try {
            domain = JSON.parse(domainJSON);
            types = JSON.parse(typesJSON);
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
            address = await ethers.utils.verifyTypedData(domain, types, value, signature);
          }
          catch(e) {
            success = false;
            code = e.code;
            message = e.message;
            reason = 'error-ethers';
      
            console.log(e);
          }
        }
      
        return result(success, reason, code, message, address);
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

export default AquaEthService;