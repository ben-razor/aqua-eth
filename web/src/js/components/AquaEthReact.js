import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, requestAccounts, getBalance, getBlockNumber } from '../compiled/aquaEth.js';
import AqexButton from './AqexButton';
import AquaEthClient from '../aquaEthClient.js';

const BUTTON_TIMEOUT = 10000;

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;
  const [aquaEthClientCreated, setAquaEthClientCreated] = useState();
  const [submitting, setSubmitting] = useState({});

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

  function handleGetBlockNumber() {
    setButtonSubmitting('getBlockNumber', true);
    (async() => {
      try {
        let res = await getBlockNumber(remotePeerId, remoteRelayPeerId);
        console.log(res);
        setButtonSubmitting('getBlockNumber', false);
      }
      catch(e) {
        toast(e.toString(), 'error');
        console.log(e);
      }
      finally {
        setButtonSubmitting('getBlockNumber', false);
      }
    })();
  }

  function setButtonSubmitting(id, sub) {
    let _submitting = {...submitting };
    _submitting[id] = sub;
    setSubmitting(_submitting);
  }

  function handleUIMessage(msg) {
    if(msg.type === 'ui-button-timeout') {
      let buttonId = msg.data.id;
      setButtonSubmitting(buttonId, false);
    }
  }

  return <Fragment>
    <AqexButton
      label={<i className="fas fa-magic" />}
      className="playground-button playground-icon-button"
      hideLabelDuringSubmit={true}
      onClick={() => testEthereum()}
    />
    <AqexButton
      label="getBlockNumber"
      id="getBlockNumber"
      className="playground-button playground-icon-button"
      onClick={() => handleGetBlockNumber()}
      isSubmitting={submitting['getBlockNumber']}
      timeout={BUTTON_TIMEOUT}
      setUIMsg={handleUIMessage}
    />

  </Fragment>
  
}
