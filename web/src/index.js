import React, {useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import FluenceReact from './js/components/FluenceReact';
import getConnector from './js/components/Connector';
import AquaEthReact from './js/components/AquaEthReact';
import logo from '../src/images/aqua-eth-2.png';
let connector = getConnector();

const TOAST_TIMEOUT = 4000;

function App(props) {
  const [connected, setConnected] = useState();
  const [connectionInfo, setConnectionInfo] = useState({});
  const [remotePeerId, setRemotePeerId] = useState('');
  const [remoteRelayPeerId, setRemoteRelayPeerId] = useState('');

  const { addToast } = useToasts();

  function toast(message, type='info') {
    addToast(message, { 
      appearance: type,
      autoDismiss: true,
      autoDismissTimeout: TOAST_TIMEOUT
    });
  }

  useEffect(() => {
    connector.addHandler('fluence-connect', (data) => {
      setConnected(data.connected);
      setConnectionInfo({...data.connectionInfo});
      setRemotePeerId(data.connectionInfo.peerId);
      setRemoteRelayPeerId(data.connectionInfo.relayPeerId);
    })
  }, []);

  return (
    <Fragment>
      <div className="er-header">
        <div className="er-header-details">
          <h2 className="er-header-title">Eth Remote</h2>
          <img className="er-header-logo" alt="Logo" src={logo} />
          <h3>Powered by Fluence Network</h3>
        </div>
        <div className="er-header-controls">
          <FluenceReact toast={toast} />
        </div>
      </div>
      <div className="er-content">
        { connected &&
          <Fragment>
            <div className="er-remote-panel">
              <div className="er-remote-panel-controls">
                <h3>Set Remote</h3>
                <div className="er-form-row">
                  <div className="er-form-label">PeerId:</div>
                  <input type="text" value={remotePeerId} onChange={e => setRemotePeerId(e.target.value)} />
                </div>
                <div className="er-form-row">
                  <div className="er-form-label">RelayId:</div>
                  <input type="text" value={remoteRelayPeerId} onChange={e => setRemoteRelayPeerId(e.target.value)} />
                </div>
              </div>
              <div className="er-remote-panel-info">
                {
                  (remotePeerId === connectionInfo.peerId) ?
                  <div className="er-help-panel">
                    <h4>This browser is currently set as its own remote.</h4>
                    <p>To experience the full power of Eth Remote:</p>
                    <p>Open a MetaMask enabled browser on a remote device</p>
                    <p>Insert the peerId and relayId displayed on the remote browser and click Connect</p>
                  </div> 
                  :
                  ''
                }
              </div>
            </div> 

            <div className="er-remote-controls">
              <AquaEthReact connected={connected} connectionInfo={connectionInfo} 
                            remotePeerId={remotePeerId} remoteRelayPeerId={remoteRelayPeerId} toast={toast} />
            </div>
          </Fragment>
        }
       
      </div>
    </Fragment>
  );
}

ReactDOM.render(
  <ToastProvider>
    <App />
  </ToastProvider>
, document.getElementById('root'));