/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.4.1-240
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v2';


// Services
export interface EthereumDef {
    castErrorResultU32ToTransaction: (result: { data: number; info: { code: number; message: string; reason: string; success: boolean; }; }, callParams: CallParams<'result'>) => { data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    changeTransactionRequestNonce: (transaction: { chainId: number; data: string; from: string; gasLimit: string; gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; nonce: number; to: string; transactionRequest: number; value: string; }, nonce: number, callParams: CallParams<'transaction' | 'nonce'>) => { chainId: number; data: string; from: string; gasLimit: string; gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; nonce: number; to: string; transactionRequest: number; value: string; } | Promise<{ chainId: number; data: string; from: string; gasLimit: string; gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; nonce: number; to: string; transactionRequest: number; value: string; }>;
    erc20BalanceOf: (contractAddress: string, address: string, callParams: CallParams<'contractAddress' | 'address'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    erc20Connect: (contractAddress: string, callParams: CallParams<'contractAddress'>) => { data: { address: string; decimals: number; name: string; symbol: string; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { address: string; decimals: number; name: string; symbol: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    erc20Transfer: (contractAddress: string, to: string, amount: string, callParams: CallParams<'contractAddress' | 'to' | 'amount'>) => { data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    formatEther: (value: string, callParams: CallParams<'value'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    formatUnits: (value: string, unit: string, callParams: CallParams<'value' | 'unit'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getBalance: (address: string, callParams: CallParams<'address'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getBlock: (blockNumber: string, callParams: CallParams<'blockNumber'>) => { data: { difficulty: string; extraData: string; gasLimit: string; gasUsed: string; hash: string; miner: string; nonce: string; number: string; parentHash: string; timestamp: string; transactions: string[]; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { difficulty: string; extraData: string; gasLimit: string; gasUsed: string; hash: string; miner: string; nonce: string; number: string; parentHash: string; timestamp: string; transactions: string[]; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getBlockNumber: (callParams: CallParams<null>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getChainInfo: (chainId: number, callParams: CallParams<'chainId'>) => { data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getConnectedChainInfo: (callParams: CallParams<null>) => { data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getFeeData: (callParams: CallParams<null>) => { data: { gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    getTransactionCount: (callParams: CallParams<null>) => { data: number; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: number; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    parseEther: (value: string, callParams: CallParams<'value'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    parseUnits: (value: string, unit: string, callParams: CallParams<'value' | 'unit'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    receiveData: (packet: { data: string; type: string; }, callParams: CallParams<'packet'>) => void | Promise<void>;
    registerListenerNode: (listenerPeerId: string, listenerRelayId: string, callParams: CallParams<'listenerPeerId' | 'listenerRelayId'>) => void | Promise<void>;
    requestAccounts: (callParams: CallParams<null>) => { data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    sendTransaction: (transactionRequest: { chainId: number; data: string; from: string; gasLimit: string; gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; nonce: number; to: string; transactionRequest: number; value: string; }, callParams: CallParams<'transactionRequest'>) => { data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    signTypedData: (domain: string, types: string, value: string, callParams: CallParams<'domain' | 'types' | 'value'>) => string | Promise<string>;
    verifyTypedData: (domain: string, types: string, value: string, signature: string, callParams: CallParams<'domain' | 'types' | 'value' | 'signature'>) => string | Promise<string>;
}
export function registerEthereum(service: EthereumDef): void;
export function registerEthereum(serviceId: string, service: EthereumDef): void;
export function registerEthereum(peer: FluencePeer, service: EthereumDef): void;
export function registerEthereum(peer: FluencePeer, serviceId: string, service: EthereumDef): void;
       

// Functions
 
export type Erc20BalanceOfResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function erc20BalanceOf(peerId: string, relayId: string, contractAddress: string, address: string, config?: {ttl?: number}): Promise<Erc20BalanceOfResult>;
export function erc20BalanceOf(peer: FluencePeer, peerId: string, relayId: string, contractAddress: string, address: string, config?: {ttl?: number}): Promise<Erc20BalanceOfResult>;

 
export type GetBlockNumberResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getBlockNumber(peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetBlockNumberResult>;
export function getBlockNumber(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetBlockNumberResult>;

export type IdentityResultChainArgVal = { data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; } 
export type IdentityResultChainResult = { data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function identityResultChain(val: IdentityResultChainArgVal, config?: {ttl?: number}): Promise<IdentityResultChainResult>;
export function identityResultChain(peer: FluencePeer, val: IdentityResultChainArgVal, config?: {ttl?: number}): Promise<IdentityResultChainResult>;

 
export type GetBlockResult = { data: { difficulty: string; extraData: string; gasLimit: string; gasUsed: string; hash: string; miner: string; nonce: string; number: string; parentHash: string; timestamp: string; transactions: string[]; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getBlock(peerId: string, relayId: string, blockNumber: string, config?: {ttl?: number}): Promise<GetBlockResult>;
export function getBlock(peer: FluencePeer, peerId: string, relayId: string, blockNumber: string, config?: {ttl?: number}): Promise<GetBlockResult>;

 
export type GetFeeDataResult = { data: { gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getFeeData(peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetFeeDataResult>;
export function getFeeData(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetFeeDataResult>;

 
export type GetBalanceResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getBalance(peerId: string, relayId: string, address: string, config?: {ttl?: number}): Promise<GetBalanceResult>;
export function getBalance(peer: FluencePeer, peerId: string, relayId: string, address: string, config?: {ttl?: number}): Promise<GetBalanceResult>;

 
export type FormatEtherResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function formatEther(peerId: string, relayId: string, value: string, config?: {ttl?: number}): Promise<FormatEtherResult>;
export function formatEther(peer: FluencePeer, peerId: string, relayId: string, value: string, config?: {ttl?: number}): Promise<FormatEtherResult>;

export type ListenerNodeCallbackArgJsonPacket = { data: string; type: string; } 

export function listenerNodeCallback(peerId: string, relayId: string, jsonPacket: ListenerNodeCallbackArgJsonPacket, config?: {ttl?: number}): Promise<void>;
export function listenerNodeCallback(peer: FluencePeer, peerId: string, relayId: string, jsonPacket: ListenerNodeCallbackArgJsonPacket, config?: {ttl?: number}): Promise<void>;

 
export type ParseEtherResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function parseEther(peerId: string, relayId: string, value: string, config?: {ttl?: number}): Promise<ParseEtherResult>;
export function parseEther(peer: FluencePeer, peerId: string, relayId: string, value: string, config?: {ttl?: number}): Promise<ParseEtherResult>;

export type IdentityResultStringArgVal = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } 
export type IdentityResultStringResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function identityResultString(val: IdentityResultStringArgVal, config?: {ttl?: number}): Promise<IdentityResultStringResult>;
export function identityResultString(peer: FluencePeer, val: IdentityResultStringArgVal, config?: {ttl?: number}): Promise<IdentityResultStringResult>;

 
export type FormatUnitsResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function formatUnits(peerId: string, relayId: string, value: string, unit: string, config?: {ttl?: number}): Promise<FormatUnitsResult>;
export function formatUnits(peer: FluencePeer, peerId: string, relayId: string, value: string, unit: string, config?: {ttl?: number}): Promise<FormatUnitsResult>;

 

export function identityU32(val: number, config?: {ttl?: number}): Promise<number>;
export function identityU32(peer: FluencePeer, val: number, config?: {ttl?: number}): Promise<number>;

export type SendTransactionArgTransactionRequest = { chainId: number; data: string; from: string; gasLimit: string; gasPrice: string; maxFeePerGas: string; maxPriorityFeePerGas: string; nonce: number; to: string; transactionRequest: number; value: string; } 
export type SendTransactionResult = { data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function sendTransaction(peerId: string, relayId: string, transactionRequest: SendTransactionArgTransactionRequest, config?: {ttl?: number}): Promise<SendTransactionResult>;
export function sendTransaction(peer: FluencePeer, peerId: string, relayId: string, transactionRequest: SendTransactionArgTransactionRequest, config?: {ttl?: number}): Promise<SendTransactionResult>;

 

export function signTypedData(peerId: string, relayId: string, domain: string, types: string, value: string, config?: {ttl?: number}): Promise<string>;
export function signTypedData(peer: FluencePeer, peerId: string, relayId: string, domain: string, types: string, value: string, config?: {ttl?: number}): Promise<string>;

 
export type RequestAccountsResult = { data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; }
export function requestAccounts(peerId: string, relayId: string, config?: {ttl?: number}): Promise<RequestAccountsResult>;
export function requestAccounts(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<RequestAccountsResult>;

 
export type GetChainInfoResult = { data: { chainId: number; currency: { decimals: number; name: string; symbol: string; }; name: string; network: string; networkId: number; shortName: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getChainInfo(peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetChainInfoResult>;
export function getChainInfo(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetChainInfoResult>;

 
export type Erc20ConnectResult = { data: { address: string; decimals: number; name: string; symbol: string; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function erc20Connect(peerId: string, relayId: string, contractAddress: string, config?: {ttl?: number}): Promise<Erc20ConnectResult>;
export function erc20Connect(peer: FluencePeer, peerId: string, relayId: string, contractAddress: string, config?: {ttl?: number}): Promise<Erc20ConnectResult>;

 

export function verifyTypedData(peerId: string, relayId: string, domain: string, types: string, value: string, signature: string, config?: {ttl?: number}): Promise<string>;
export function verifyTypedData(peer: FluencePeer, peerId: string, relayId: string, domain: string, types: string, value: string, signature: string, config?: {ttl?: number}): Promise<string>;

 

export function registerListenerNode(peerId: string, relayId: string, listenerPeerId: string, listenerRelayId: string, config?: {ttl?: number}): Promise<void>;
export function registerListenerNode(peer: FluencePeer, peerId: string, relayId: string, listenerPeerId: string, listenerRelayId: string, config?: {ttl?: number}): Promise<void>;

 
export type ParseUnitsResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function parseUnits(peerId: string, relayId: string, value: string, unit: string, config?: {ttl?: number}): Promise<ParseUnitsResult>;
export function parseUnits(peer: FluencePeer, peerId: string, relayId: string, value: string, unit: string, config?: {ttl?: number}): Promise<ParseUnitsResult>;

 
export type Erc20TransferResult = { data: { blockHash: string; blockNumber: number; confirmation: number; raw: string; timestamp: number; type: number; }; info: { code: number; message: string; reason: string; success: boolean; }; }
export function erc20Transfer(peerId: string, relayId: string, contractAddress: string, to: string, amount: string, config?: {ttl?: number}): Promise<Erc20TransferResult>;
export function erc20Transfer(peer: FluencePeer, peerId: string, relayId: string, contractAddress: string, to: string, amount: string, config?: {ttl?: number}): Promise<Erc20TransferResult>;

 
export type GetTransactionCountResult = { data: number; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getTransactionCount(peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetTransactionCountResult>;
export function getTransactionCount(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<GetTransactionCountResult>;
