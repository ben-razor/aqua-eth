import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, requestAccounts, getAccounts } from '../compiled/aquaEthCompiled.js';
import AqexButton from './AqexButton';
import AquaEthClient from '../aquaEthClient.js';

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;
  const [aquaEthClientCreated, setAquaEthClientCreated] = useState();

  function aquaEthHandler(msg) {
    if(!msg.success && msg.reason === 'error-no-ethereum') {
      toast(<div>This browser has no ethereum<br />Try MetaMask!</div>);
    }
    else {
      if(msg.method === 'requestAccounts') {
        if(msg.success) {
          toast('Ethereum is connected!!\n' + JSON.stringify(msg.data));
        }
        else {
          if(msg.reason === 'error-user-rejected') {
            toast('Please connect with MetaMask');
          }
          else {
            toast('Error connecting to ethereum');
            console.error(error);
          }
        }
      }
      else if(msg.method === 'registerListenerNode' && msg.success) {
        toast(<div>
          A remote peer registered to receive ethereum events<br />
        </div>)
      }
      else {
        console.log('Unhandled message (just letting you know)', msg);
      }
    }
  }

  useEffect(() => {
    let aquaEthClient = new AquaEthClient(aquaEthHandler);
    setAquaEthClientCreated(true);
  }, []);

  function testEthereum() {
    (async () => {
      await requestAccounts(remotePeerId, remoteRelayPeerId);
      // let accounts = await getAccounts(remotePeerId, remoteRelayPeerId);
      // toast('Got these accounts from remote host: ' + JSON.stringify(accounts));
    })();
  }

  return <Fragment>
    <AqexButton
      label={<i className="fas fa-magic" />}
      className="playground-button playground-icon-button"
      hideLabelDuringSubmit={true}
      onClick={() => testEthereum()}
    />
  </Fragment>
  
}
