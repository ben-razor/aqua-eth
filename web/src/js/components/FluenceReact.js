import React, {useState, useEffect, createRef, Fragment} from 'react';
import { Fluence, FluencePeer } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { clip } from '../helpersHTML';
import connect from './Connect';

import {
    ResultCodes,
    CallParams,
    callFunction, 
    registerService,
    RequestFlowBuilder
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v2';
import { Toast } from 'react-bootstrap';
import AquaEthReact from './AquaEthReact';

export async function attemptConnect(handler) {
    let _connectionInfo;

    for(let node of krasnodar) {
        try {
            await Fluence.start({ connectTo: node });
            _connectionInfo = Fluence.getStatus();

            handler.msg('fluence-connect', {
                connected: true,
                connectionInfo: { ..._connectionInfo },
                node
            });

            break;
        }
        catch(e) { 
            console.log('Fluence attemptConnect error', e);
            await Fluence.stop();
        } 
    }

    return _connectionInfo;
}

export async function attemptDisconnect() {
    await Fluence.stop();
}

function FluenceReact(props) {
    const toast = props.toast;
    const triggerConnectionTest = props.triggerConnectionTest;
    const [attemptingConnect, setAttemptingConnect] = useState();
    const [connected, setConnected] = useState(false);
    const [connectedNode, setConnectedNode] = useState();
    const [connectionInfo, setConnectionInfo] = useState({});

    useEffect(() => {
        connect.addHandler('fluence-connect', (data) => {
          setConnected(data.connected);
          setConnectionInfo({...data.connectionInfo});
          setConnectedNode(data.node);
        })
    }, []);
      
    async function testConnection() {
        let status = Fluence.getStatus();

        console.log('Testing connection');

        if(!status.isConnected) {
            console.log('Peer disconnected from Fluence. Attempting reconnect...');
            setConnected(false);
        }
    }

    useEffect(() => {
        let timer = setInterval(() => testConnection, 60000);

        connect.addHandler('fluence-test-connection', (data) => {
            testConnection();
        });

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if(!connected) {
            setAttemptingConnect(true);

            async function connectToHost() {
                setConnected(false);
                await attemptConnect(connect);
            }

            connectToHost();
        }
    }, [connected]);

    function copyToClipboard(id) {
        if(id === 'peer') {
            clip(connectionInfo.peerId, toast);
        }
        else if(id === 'relay') {
            clip(connectionInfo.relayPeerId, toast);
        }
    }

    function formatPeerId(peerId) {
        let charsVisible = 6;
        let formatted = peerId;

        if(peerId) {
            formatted = `${peerId.slice(0, charsVisible)}...${peerId.slice(-charsVisible)}`;
        }

        return formatted;
    }

    return <div>
        { connectionInfo.peerId ?
            <Fragment>
                <div className="er-fluence-connect"> 
                    <div>PeerId: {formatPeerId(connectionInfo.peerId)} <i className="fa fa-edit" onClick={e => copyToClipboard('peer')}/></div>
                    <div>RelayId: {formatPeerId(connectionInfo.relayPeerId)} <i className="fa fa-edit" onClick={e => copyToClipboard('relay')}/></div>
                </div>
            </Fragment>
            :
            <Fragment>
                { attemptingConnect ? 
                    'Connecting...' 
                    :
                    'Not connected'
                }
            </Fragment>
        }
    </div>
}

export default FluenceReact;