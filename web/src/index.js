import React, {useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import './css/styles.css';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import FluenceReact from './js/components/FluenceReact';
import connect from './js/components/Connect';
import AquaEthReact from './js/components/AquaEthReact';
import AqexModal from './js/components/AqexModal';
import AqexButton from './js/components/AqexButton';
import logo from '../src/images/aqua-eth-2.png';

const TOAST_TIMEOUT = 4000;

function App(props) {
  const [connected, setConnected] = useState();
  const [connectionInfo, setConnectionInfo] = useState({});
  const [remotePeerId, setRemotePeerId] = useState('');
  const [remoteRelayPeerId, setRemoteRelayPeerId] = useState('');
  const [modalState, setModalState] = useState({ open: false, title: '', content: ''});
  const [linkedEthAccount, setLinkedEthAccount] = useState({ account: null, peerId: null, relayPeerId: null});
  const [ethLookupEntry, setEthLookupEntry] = useState('');
  const [lookupAddress, setLookupAddress] = useState('');

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
      setRemotePeerId(data.connectionInfo.peerId);
      setRemoteRelayPeerId(data.connectionInfo.relayPeerId);
    })
  }, []);

  function closeModal() {
    setModalState({...modalState, open: false});
  }

  function lookupEthAddress() {
    setLookupAddress(ethLookupEntry);
  }

  return (
    <Fragment>
      <AqexModal modalState={modalState} setModalState={setModalState} />
      <div className="er-header">
        <div className="er-header-details">
          <h2 className="er-header-title">Eth Remote</h2>
          <img className="er-header-logo" alt="Logo" src={logo} />
          <h3>Powered by Fluence Network</h3>
        </div>
        <div className="er-header-controls">
          <FluenceReact toast={toast} linkedEthAccount={linkedEthAccount} />
        </div>
      </div>
      <div className="er-content">
        { connected &&
          <Fragment>
            <div className="er-remote-panel">
              <div className="er-remote-panel-controls">
                <h3>Set Remote</h3>
                <div className="er-form-row">
                  <div className="er-form-label">Address:</div>
                  <input type="text" value={ethLookupEntry} onChange={e => setEthLookupEntry(e.target.value)} />
                  <AqexButton label="Lookup" id="lookupEthAddress" className="playground-button playground-icon-button"
                  onClick={() => lookupEthAddress() } />
                </div>
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
                            remotePeerId={remotePeerId} remoteRelayPeerId={remoteRelayPeerId} toast={toast} 
                            setModalState={setModalState} closeModal={closeModal} 
                            linkedEthAccount={linkedEthAccount} setLinkedEthAccount={setLinkedEthAccount} 
                            lookupAddress={lookupAddress} setLookupAddress={setLookupAddress} 
                            setRemotePeerId={setRemotePeerId} setRemoteRelayPeerId={setRemoteRelayPeerId} />
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