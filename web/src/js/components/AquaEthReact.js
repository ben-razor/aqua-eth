import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, requestAccounts, getBalance, getBlockNumber,
         formatEther, 
         registerListenerNode} from '../compiled/aquaEth.js';
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
  const [balanceAccount, setBalanceAccount] = useState('');
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();
  const [formatEtherAmount, setFormatEtherAmount] = useState(0);
  const [etherAmount, setEtherAmount] = useState();

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
      else if(msg.type === 'accountsChanged' && msg.success) {
        let accounts = msg.data;
        toast(<div>Received account changed message</div>);
        setAccounts(accounts);
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
    toast('Error ' + res.message);
    console.log(res);
  }

  function handleFeature(id, data) {
    setButtonSubmitting(id, true);
    (async() => {
      try {
        let res = {};

        if(id === 'requestAccounts') {
          res = await requestAccounts(remotePeerId, remoteRelayPeerId);
        }
        else if(id === 'getBalance') {
          res = await getBalance(remotePeerId, remoteRelayPeerId, data);
        }
        else if(id === 'getBlockNumber') {
          res = await getBlockNumber(remotePeerId, remoteRelayPeerId);
        }
        else if(id === 'formatEther') {
          res = await formatEther(remotePeerId, remoteRelayPeerId, data);
        }

        if(res.info.success) {
          if(id === 'requestAccounts') {
            setAccounts(res.data);

            registerListenerNode(remotePeerId, remoteRelayPeerId, connectionInfo.peerId, connectionInfo.relayPeerId);
          }
          if(id === 'getBalance') { setBalance(res.data); }
          else if(id === 'getBlockNumber') { setBlockNumber(res.data); }
          else if(id === 'formatEther') { setEtherAmount(res.data); }
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
        setButtonSubmitting(id, false);
      }
    })();
  }
  
  useEffect(() => {
    if(accounts && accounts.length) {
      setBalanceAccount(accounts[0])
      setBalance();
    }
  }, [accounts]);

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
    let accountsUI;

    if(accounts) {
      accountsUI = [];

      for(let account of accounts) {
        accountsUI.push(<div key={account}>{account}</div>)
      }
    }
    return accountsUI;
  }

  function featurePanel(title, controls, output) {
    return <div className="er-feature">
      {title && 
        <div className="er-feature-title"></div>
      }
      <div className="er-feature-controls">
        {controls}
      </div>
      { output &&
        <div className="er-feature-output">{output}</div>
      }
    </div>
  }

  return <Fragment>
    <div className="er-features">
      { featurePanel( '', 
          <AqexButton label="Get Accounts" id="requestAccounts" className="playground-button playground-icon-button"
            onClick={() => handleFeature('requestAccounts')} isSubmitting={submitting['requestAccounts']}
            timeout={BUTTON_TIMEOUT} setUIMsg={handleUIMessage} />,
          formatAccounts(accounts)
      )}
      { featurePanel( '', 
          <AqexButton label="Block Number" id="getBlockNumber" className="playground-button playground-icon-button"
            onClick={() => handleFeature('getBlockNumber')} isSubmitting={submitting['getBlockNumber']} timeout={BUTTON_TIMEOUT}
            setUIMsg={handleUIMessage} />,
          blockNumber
      )}
      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">Account</div>
              <input type="text" value={ balanceAccount } onChange={e => setBalanceAccount(e.target.value)} />
            </div>
            <AqexButton label="Get Balance" id="getBalance" className="playground-button playground-icon-button"
              onClick={() => handleFeature('getBalance', balanceAccount)} isSubmitting={submitting['getBalance']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          balance 
      )}
      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">Account</div>
              <input type="text" value={ formatEtherAmount } onChange={e => setFormatEtherAmount(e.target.value)} />
            </div>
            <AqexButton label="Wei To Eth" id="formatEther" className="playground-button playground-icon-button"
              onClick={() => handleFeature('formatEther', formatEtherAmount)} isSubmitting={submitting['formatEther']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          etherAmount
      )}
    </div>
  </Fragment>
  
}
