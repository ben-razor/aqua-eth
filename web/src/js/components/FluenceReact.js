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

// These assignments are necessary to ensure that webpack pulls in these things
// from the modules so that they are available to the code running in the sandbox
window['Fluence'] = Fluence;
window['FluencePeer'] = FluencePeer;
window['ResultCodes'] = ResultCodes;
window['registerService'] = registerService;
window['CallParams'] = CallParams;
window['callFunction'] = callFunction;
window['RequestFlowBuilder'] = RequestFlowBuilder;
window['krasnodar'] = krasnodar;

function FluenceReact(props) {
    const toast = props.toast;
    const [attemptingConnect, setAttemptingConnect] = useState();
    const [connected, setConnected] = useState(false);
    const [connectedNode, setConnectedNode] = useState();
    const [connectionInfo, setConnectionInfo] = useState({});

    useEffect(() => {
        if(!connected) {
            setAttemptingConnect(true);

            async function connectToHost() {
                setConnected(false);

                for(let node of krasnodar) {
                    try {
                        let res = await Fluence.start({ connectTo: node });
                        setConnected(true);
                        setConnectedNode(node);
                        let _connectionInfo = Fluence.getStatus();
                        setConnectionInfo(_connectionInfo);

                        connect.msg('fluence-connect', {
                            connected: true,
                            connectionInfo: { ..._connectionInfo }
                        });

                        break;
                    }
                    catch(e) { 
                        await Fluence.stop();
                    } 
                }
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