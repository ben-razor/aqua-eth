import React, {useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import FluenceReact from './js/components/FluenceReact';
import connect from './js/components/Connect';
import AquaEthReact from './js/components/AquaEthReact';

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
    connect.addHandler('fluence-connect', (data) => {
      setConnected(data.connected);
      setConnectionInfo({...data.connectionInfo});
      setRemoteRelayPeerId(data.connectionInfo.relayPeerId);
    })
  }, []);

  return (
    <Fragment>
      <div className="er-header">
        <div className="er-header-details">
          <h1 className="er-header-title">Eth Remote</h1>
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

            <div className="er-remote-controls">
            <h3>Controls</h3>
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