import React, {useState, useEffect, createRef, Fragment} from 'react';
import { Fluence, FluencePeer } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { clip } from '../helpersHTML';

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
    const [connected, setConnected] = useState();
    const [connectedNode, setConnectedNode] = useState();
    const [connectionInfo, setConnectionInfo] = useState({});
    const [remotePeerId, setRemotePeerId] = useState('');
    const [remoteRelayPeerId, setRemoteRelayPeerId] = useState('');

    useEffect(() => {
        setAttemptingConnect(true);

        async function connectToHost() {
            setConnected(false);

            for(let node of krasnodar) {
                try {
                    await Fluence.start({ connectTo: node });
                    setConnected(true);
                    setConnectedNode(node);
                    console.log(Fluence.getStatus());
                    setConnectionInfo(Fluence.getStatus());
                    break;
                }
                catch(e) { 
                    await Fluence.stop();
                } 
            }
        }

        connectToHost();

    }, []);
   
    function copyToClipboard(id) {
        if(id === 'peer') {
            clip(connectionInfo.peerId, toast);
        }
        else if(id === 'relay') {
            clip(connectionInfo.relayPeerId, toast);
        }
    }

    return <div>
        { connectionInfo.peerId ?
            <Fragment>
                <div>
                    <h3>Fluence connected!</h3>
                    <div>PeerId: {connectionInfo.peerId} <i className="fa fa-edit" onClick={e => copyToClipboard('peer')}/></div>
                    <div>RelayId: {connectionInfo.relayPeerId} <i className="fa fa-edit" onClick={e => copyToClipboard('relay')}/></div>
                </div>
                <div>
                    <h3>Set Remote</h3>
                    <div>PeerId: <input type="text" value={remotePeerId} onChange={e => setRemotePeerId(e.target.value)} /></div>
                    <div>RelayId: <input type="text" value={remoteRelayPeerId} onChange={e => setRemoteRelayPeerId(e.target.value)} /></div>
                </div> 
                <div>
                    <AquaEthReact remotePeerId={remotePeerId} remoteRelayPeerId={remoteRelayPeerId} toast={toast} />
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