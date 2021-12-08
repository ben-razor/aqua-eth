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
    getBalance: (address: string, callParams: CallParams<'address'>) => { data: string; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string; info: { code: number; message: string; reason: string; success: boolean; }; }>;
    receiveData: (packet: { data: string; type: string; }, callParams: CallParams<'packet'>) => void | Promise<void>;
    registerListenerNode: (listenerPeerId: string, listenerRelayId: string, callParams: CallParams<'listenerPeerId' | 'listenerRelayId'>) => void | Promise<void>;
    requestAccounts: (callParams: CallParams<null>) => { data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; } | Promise<{ data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; }>;
}
export function registerEthereum(service: EthereumDef): void;
export function registerEthereum(serviceId: string, service: EthereumDef): void;
export function registerEthereum(peer: FluencePeer, service: EthereumDef): void;
export function registerEthereum(peer: FluencePeer, serviceId: string, service: EthereumDef): void;
       

// Functions
 
export type RequestAccountsResult = { data: string[]; info: { code: number; message: string; reason: string; success: boolean; }; }
export function requestAccounts(peerId: string, relayId: string, config?: {ttl?: number}): Promise<RequestAccountsResult>;
export function requestAccounts(peer: FluencePeer, peerId: string, relayId: string, config?: {ttl?: number}): Promise<RequestAccountsResult>;

 

export function registerListenerNode(peerId: string, relayId: string, listenerPeerId: string, listenerRelayId: string, config?: {ttl?: number}): Promise<void>;
export function registerListenerNode(peer: FluencePeer, peerId: string, relayId: string, listenerPeerId: string, listenerRelayId: string, config?: {ttl?: number}): Promise<void>;

export type ListenerNodeCallbackArgJsonPacket = { data: string; type: string; } 

export function listenerNodeCallback(peerId: string, relayId: string, jsonPacket: ListenerNodeCallbackArgJsonPacket, config?: {ttl?: number}): Promise<void>;
export function listenerNodeCallback(peer: FluencePeer, peerId: string, relayId: string, jsonPacket: ListenerNodeCallbackArgJsonPacket, config?: {ttl?: number}): Promise<void>;

 
export type GetBalanceResult = { data: string; info: { code: number; message: string; reason: string; success: boolean; }; }
export function getBalance(peerId: string, relayId: string, address: string, config?: {ttl?: number}): Promise<GetBalanceResult>;
export function getBalance(peer: FluencePeer, peerId: string, relayId: string, address: string, config?: {ttl?: number}): Promise<GetBalanceResult>;
