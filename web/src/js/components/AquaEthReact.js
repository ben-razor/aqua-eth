import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, requestAccounts, getBalance, getBlockNumber } from '../compiled/aquaEth.js';
import AqexButton from './AqexButton';
import AquaEthClient from '../aquaEthClient.js';

const BUTTON_TIMEOUT = 10000;

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;
  const connected = props.connected;
  const connectionInfo = props.connectionInfo;

  const [aquaEthClientCreated, setAquaEthClientCreated] = useState();
  const [submitting, setSubmitting] = useState({});
  const [accounts, setAccounts] = useState();
  const [blockNumber, setBlockNumber] = useState();

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

  function handleError(res) {
    toast('Error ' + res.reason);
    console.log(res);
  }

  function testEthereum() {
    setButtonSubmitting('testEthereum', true);
    (async () => {
      try {
        let res = await requestAccounts(remotePeerId, remoteRelayPeerId);

        if(res.success) {
          setAccounts(res.data);
        }
        else {
          handleError(res);
        }
      }
      catch(e) {
        toast(e.toString(), 'error');
        console.log(e);
      }
      finally {
        setButtonSubmitting('testEthereum', false);
      }
    })();
  }

  function handleGetBlockNumber() {
    setButtonSubmitting('getBlockNumber', true);
    (async() => {
      try {
        let res = await getBlockNumber(remotePeerId, remoteRelayPeerId);

        if(res.success) {
          setBlockNumber(res.data);
        }
        else {
          handleError(res);
        }
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

  function formatAccounts(accounts) {
    let accountsUI = [];

    for(let account of accounts) {
      accountsUI.push(<div key={account}>{account}</div>)
    }

    return accountsUI;
  }

  return <Fragment>
    <div className="er-features">
      <div className="er-feature">
        <div className="er-feature-controls">
          <AqexButton label="Get Accounts" id="testEthereum" className="playground-button playground-icon-button"
            onClick={() => testEthereum()} isSubmitting={submitting['testEthereum']}
            timeout={BUTTON_TIMEOUT} setUIMsg={handleUIMessage} />
        </div>
        { accounts &&
          <div className="er-feature-output">{ formatAccounts(accounts) }</div>
        }
      </div>
      <div className="er-feature">
        <div className="er-feature-controls">
          <AqexButton label="Block Number" id="getBlockNumber" className="playground-button playground-icon-button"
            onClick={() => handleGetBlockNumber()} isSubmitting={submitting['getBlockNumber']} timeout={BUTTON_TIMEOUT}
            setUIMsg={handleUIMessage}
          />
        </div>
        { blockNumber && 
          <div className="er-feature-output">{ blockNumber }</div>
        }
      </div>
    </div>
  </Fragment>
  
}
