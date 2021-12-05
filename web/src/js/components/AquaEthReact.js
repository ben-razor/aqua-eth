import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, enable } from '../aqua_compiled/aquaEth';
import AqexButton from './AqexButton';

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;

  useEffect(() => {
   registerEthereum({
      enable: async () => {
        console.log('Enabling');
          
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          toast('Ethereum is connected!!\n' + JSON.stringify(accounts));
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            toast('Please connect with MetaMask');
            console.error(error);
          } else {
            console.error(error);
          }
        });

        console.log('After enable')
      }
    });
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
