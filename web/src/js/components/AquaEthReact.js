import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, enable } from '../compiled/aquaEth.js';
import AqexButton from './AqexButton';
import AquaEthClient from '../aquaEthClient.js';

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;
  const [aquaEthClientCreated, setAquaEthClientCreated] = useState();


  function aquaEthHandler(msg) {
    if(msg.method === 'enable') {
      if(msg.success) {
        toast('Ethereum is connected!!\n' + JSON.stringify(msg.data));
        console.log('Boo!!!');
      }
      else {
        if(reason === 'error-user-rejected') {
          toast('Please connect with MetaMask');
        }
        else {
          toast('Error connecting to ethereum');
          console.error(error);
        }
      }
    }
  }

  useEffect(() => {
    let aquaEthClient = new AquaEthClient(aquaEthHandler);
    setAquaEthClientCreated(true);
  }, []);

  function testEthereum() {
    (async () => {
      await enable(remotePeerId, remoteRelayPeerId);
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
