import React, {useState, useEffect, Fragment} from 'react';
import { Fluence } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { clip } from '../helpersHTML';
import getConnector from './Connector';
let connector = getConnector();

export async function attemptConnect(handler) {
    let data;

    for(let node of krasnodar) {
        try {
            await Fluence.start({ connectTo: node });
            let _connectionInfo = Fluence.getStatus();

            data = { connected: true, connectionInfo: { ..._connectionInfo }, node };
            handler.msg('fluence-connect', data);
            break;
        }
        catch(e) { 
            console.log('Fluence attemptConnect error', e);
            await Fluence.stop();
        } 
    }

    return data;
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

        connector.addHandler('fluence-test-connection', (data) => {
            testConnection();
        });

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if(!connected) {
            setAttemptingConnect(true);

            async function connectToHost() {
                setConnected(false);
                let data = await attemptConnect(connector);
                setConnected(data.connected);
                setConnectionInfo({...data.connectionInfo});
                setConnectedNode(data.node);
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