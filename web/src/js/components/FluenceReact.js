import React, {useState, useEffect, createRef, Fragment} from 'react';
import { Fluence, FluencePeer } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { clip } from '../helpersHTML';
import connect from './Connect';
import AqexButton from './AqexButton';

const BUTTON_TIMEOUT = 10000;
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
    const linkedEthAccount = props.linkedEthAccount;
    const [attemptingConnect, setAttemptingConnect] = useState();
    const [connected, setConnected] = useState(false);
    const [connectedNode, setConnectedNode] = useState();
    const [connectionInfo, setConnectionInfo] = useState({});
    const [linking, setLinking] = useState();

    async function testConnection() {
        let status = Fluence.getStatus();

        console.log('Testing connection');

        if(!status.isConnected) {
            console.log('Peer disconnected from Fluence. Attempting reconnect...');
            setConnected(false);
        }
    }

    useEffect(() => {
        connect.addHandler('linking-started', (data) => {
            setLinking(true);
        });
        connect.addHandler('linking-complete', (data) => {
            setLinking(false);
        });
    }, []);

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
                let data = await attemptConnect(connect);
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

    function linkAccount() {
        connect.msg('link-eth-lookup');
    }

    function isLinked(connectionInfo, linkedEthAccount) {
        return connectionInfo && linkedEthAccount && connectionInfo.peerId === linkedEthAccount.peerId;
    }

    return <div className="er-fluence-connect-panel">
        { connectionInfo.peerId ?
            <Fragment>
                <div className="er-fluence-connect"> 
                {
                    isLinked(connectionInfo, linkedEthAccount) ?
                    <Fragment>
                        <div className="er-fluence-connect-item">{linkedEthAccount.account}</div>
                    </Fragment>
                    :
                    <Fragment>
                        <div className="er-fluence-connect-item">
                            <div className="er-fluence-connect-text">PeerId: {formatPeerId(connectionInfo.peerId)}</div>
                            <i className="fa fa-edit" onClick={e => copyToClipboard('peer')}/>
                        </div>
                        <div className="er-fluence-connect-item">
                            <div className="er-fluence-connect-text">RelayId: {formatPeerId(connectionInfo.relayPeerId)}</div> 
                            <i className="fa fa-edit" onClick={e => copyToClipboard('relay')}/>
                        </div>
                    </Fragment>
                }
                </div>
                <AqexButton label="Link Eth Address" id="link" className="playground-button playground-icon-button"
                onClick={() => linkAccount() } isSubmitting={linking} timeout={BUTTON_TIMEOUT} />
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