import React, {useState, useEffect, createRef, Fragment} from 'react';
import { registerEthereum, requestAccounts, getChainInfo, getBalance, getBlockNumber,
         formatEther, parseEther, sendTransaction, signTypedData,
         erc20Connect, erc20BalanceOf, erc20Transfer, 
         registerListenerNode} from '../compiled/aquaEth.js';
import AqexButton from './AqexButton';
import AquaEthClient from '../aquaEthClient.js';
import { textUI } from '../text.js';

const BUTTON_TIMEOUT = 10000;

export default function AquaEthReact(props) {
  const remotePeerId = props.remotePeerId;
  const remoteRelayPeerId = props.remoteRelayPeerId;
  const toast = props.toast;
  const connected = props.connected;
  const connectionInfo = props.connectionInfo;

  const [activePanel, setActivePanel] = useState('account');
  const [aquaEthClientCreated, setAquaEthClientCreated] = useState();
  const [submitting, setSubmitting] = useState({});
  const [accounts, setAccounts] = useState();
  const [chainInfo, setChainInfo] = useState();
  const [balanceAccount, setBalanceAccount] = useState('');
  const [blockNumber, setBlockNumber] = useState();
  const [balance, setBalance] = useState();
  const [formatEtherAmount, setFormatEtherAmount] = useState(0);
  const [etherAmount, setEtherAmount] = useState();
  const [parseEtherAmount, setParseEtherAmount] = useState(0);
  const [weiAmount, setWeiAmount] = useState();
  const [sendTransactionTo, setSendTransactionTo] = useState('');
  const [sendTransactionAmount, setSendTransactionAmount] = useState('');
  const [sendTransactionResult, setSendTransactionResult] = useState('');
  const [signTypedEntry, setSignTypedEntry] = useState({ 
    domain: textUI.signTypedDataDomain, types: textUI.signTypedDataTypes, value: textUI.signTypedDataValue
  });
  const [signTypedDataResult, setSignTypedDataResult] = useState('');
  const [erc20ContractAddressEntry, setERC20ContractAddressEntry] = useState('');
  const [erc20Info, setERC20Info] = useState('');
  const [erc20Balance, setErc20Balance] = useState('');
  const [erc20BalanceOfEntry, setErc20BalanceOfEntry] = useState({ contractAddress: '', address: ''});
  const [erc20TransferOutput, setErc20TransferOutput] = useState('');
  const [erc20TransferEntry, setErc20TransferEntry] = useState({ contractAddress: '', to: '', amount: ''});

  function aquaEthHandler(msg) {
    if(!msg.success && msg.reason === 'error-no-ethereum') {
      toast(<div>This browser has no ethereum<br />Try MetaMask!</div>);
    }
    else {
      if(msg.method === 'requestAccounts') {
        if(msg.success) {
          toast(<div>Ethereum is connected!!<div className="er-break-long-word">{JSON.stringify(msg.data)}</div></div>);
        }
        else {
          if(msg.reason === 'error-user-rejected') {
            toast('Please connect with MetaMask');
          }
          else {
            toast('Error connecting to ethereum');
            console.error(msg);
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
      else if(msg.type === 'chainChanged' && msg.success) {
        let chainInfo = msg.data;
        try {
          setChainInfo(chainInfo);
        }
        catch(e) { };
        toast(<div>Received chain changed message</div>);
      }
      else if(msg.type === 'transactionCreated' && msg.success) {
        toast(<div>Transaction created with hash <div className="er-break-long-word">{msg.data.hash}</div></div>);
        console.log(msg);
      }
      else if(msg.type === 'transactionMined' && msg.success) {
        toast(<div>Transaction with hash <div className="er-break-long-word">{msg.data.transactionHash}</div> completed</div>);
        console.log(msg);
      }
      else if(msg.type === 'signedTypedData' && msg.success) { 
        toast(<div>A message was signed</div>);
        setSignTypedDataResult(msg.data); 
        console.log(msg);
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
    if(res.info.reason === 'error-json-parse') {
      toast('Error parsing JSON ' + res.info.message);
    }
    else {
      toast('Error ' + res.info.message);
    }
    console.log(res);
  }

  function handleFeature(id, data) {
    setButtonSubmitting(id, true);
    (async() => {
      try {
        let res;

        if(id === 'requestAccounts') {
          await registerListenerNode(remotePeerId, remoteRelayPeerId, connectionInfo.peerId, connectionInfo.relayPeerId);
          res = await requestAccounts(remotePeerId, remoteRelayPeerId);
        }
        else if(id === 'getChainInfo') {
          res = await getChainInfo(remotePeerId, remoteRelayPeerId);
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
        else if(id === 'parseEther') {
          res = await parseEther(remotePeerId, remoteRelayPeerId, data);
        }
        else if(id === 'sendTransaction') {
          res = await sendTransaction(remotePeerId, remoteRelayPeerId, data);
        }
        else if(id === 'signTypedData') {
          console.log('signreq', data);
          res = await signTypedData(remotePeerId, remoteRelayPeerId, data.domain, data.types, data.value);
          console.log('signTypedData', res);
        }
        else if(id === 'erc20Contract') {
          res = await erc20Connect(remotePeerId, remoteRelayPeerId, data);
          console.log('RES', res)
        }
        else if(id === 'erc20BalanceOf') {
          res = await erc20BalanceOf(remotePeerId, remoteRelayPeerId, data.contractAddress, data.address);
        }
        else if(id === 'erc20Transfer') {
          res = await erc20Transfer(remotePeerId, remoteRelayPeerId, data.contractAddress, data.to, data.amount);
        }
        else {
          res = {
            info: { success: false, reason: 'error-unknown-feature', message: `Unknown feature ${id}`}
          }
        }

        setButtonSubmitting(id, false);
        if(res && res.info.success) {
          if(id === 'requestAccounts') {
            setAccounts(res.data);
          }
          else if(id === 'getChainInfo') { setChainInfo(res.data); }
          else if(id === 'getBalance') { setBalance(res.data); }
          else if(id === 'getBlockNumber') { setBlockNumber(res.data); }
          else if(id === 'formatEther') { setEtherAmount(res.data); }
          else if(id === 'parseEther') { setWeiAmount(res.data); }
          else if(id === 'sendTransaction') { setSendTransactionResult(JSON.stringify(res.data)); }
          else if(id === 'signTypedData') { setSignTypedDataResult(JSON.stringify(res.data)); }
          else if(id === 'erc20Contract') { setERC20Info(res.data); }
          else if(id === 'erc20BalanceOf') { setErc20Balance(res.data); }
          else if(id === 'erc20Transfer') { setErc20TransferOutput(JSON.stringify(res.data)); }
        }
        else {
          handleError(res);
        }
      }
      catch(e) {
        if(typeof e === 'string' && e.includes('timed out')) {
          if(id === 'requestAccounts') {
            toast('Connection timed out. You will be notified when signer connects.', 'error');
          }
          else {
            toast(e, 'error');
          }
          console.log(e);
        }
        else {
          toast("Error making request. Check the console for details.", 'error');
          console.log(e);
        }
      }
      finally {
        setButtonSubmitting(id, false);
      }
    })();
  }
  
  useEffect(() => {
    if(accounts && accounts.length) {
      setBalanceAccount(accounts[0])
      handleErc20BalanceOfEntry('address', accounts[0]);
      setBalance();
      handleFeature('getChainInfo');
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

  function formatChain(chainInfo) {
    let chainUI;

    if(chainInfo) {
      chainUI = <Fragment>
        <div className="er-form-row">
          <div className="er-form-label">Name</div><div>{chainInfo.name}</div>
        </div>
        <div className="er-form-row">
          <div className="er-form-label">Chain ID</div><div>{chainInfo.chainId}</div>
        </div>
        <div className="er-form-row">
          <div className="er-form-label">Currency</div><div>{chainInfo.currency.name}</div>
        </div>
      </Fragment> 
    }

    return chainUI;
  }

  function formatTokenInfo(tokenInfo) {
    let tokenUI;

    if(tokenInfo) {
      tokenUI = <Fragment>
        <div className="er-form-row">
          <div className="er-form-label">Name</div><div>{tokenInfo.name}</div>
        </div>
        <div className="er-form-row">
          <div className="er-form-label">Symbol</div><div>{tokenInfo.symbol}</div>
        </div>
        <div className="er-form-row">
          <div className="er-form-label">Decimals</div><div>{tokenInfo.decimals}</div>
        </div>
      </Fragment> 
    }

    return tokenUI;
  }

  function formatBalance(balance, chainInfo) {
    let balanceUI;

    if(typeof balance !== 'undefined') {
      balanceUI = balance;

      let currency = chainInfo?.currency?.name;

      if(currency) {
        balanceUI = `${balance} ${currency}`;
      }
    }
    return balanceUI;
  }

  function createTransactionRequest() {
    return {
      to: sendTransactionTo,
      value: sendTransactionAmount
    }
  }

  function handleSignTypedEntry(field, jsonString) {
    let _signTypedEntry = { ...signTypedEntry };
    _signTypedEntry[field] = jsonString;
    setSignTypedEntry(_signTypedEntry);
  }

  function formatSignature(signature) {
    let signatureUI;

    if(signature) {
      signatureUI = <div className="er-break-long-word">{signTypedDataResult}</div>
    }

    return signatureUI;
  }

  function handleErc20BalanceOfEntry(field, value) {
    let _erc20BalanceOfEntry = { ...erc20BalanceOfEntry };
    _erc20BalanceOfEntry[field] = value;
    setErc20BalanceOfEntry(_erc20BalanceOfEntry);
  }

  function handleErc20TransferEntry(field, value) {
    let _erc20TransferEntry = { ...erc20TransferEntry };
    _erc20TransferEntry[field] = value;
    setErc20TransferEntry(_erc20TransferEntry);
  }

  function getTab(id, title, activePanel) {
      return <div className={"er-tab " + (activePanel === id ? 'er-tab-active' : '')}
                  onClick={e => setActivePanel(id)}>{title}</div>
  }

  function getTabs(activePanel) {
    return <div className="er-tabs">
      { getTab('account', 'Account', activePanel) }
      { getTab('signing', 'Signing', activePanel) }
      { getTab('tokens', 'Tokens', activePanel) }
    </div>
  }

  function getAccountPanels() {
    return <Fragment>
      <div className="er-features">
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
          formatBalance(balance, chainInfo)
      )}

      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">To</div>
              <input type="text" value={ sendTransactionTo } onChange={e => setSendTransactionTo(e.target.value)} />
            </div>
            <div className="er-form-row">
              <div className="er-form-label">Amount</div>
              <input type="text" value={ sendTransactionAmount } onChange={e => setSendTransactionAmount(e.target.value)} />
            </div>
            <AqexButton label="Send Currency" id="sendTransaction" className="playground-button playground-icon-button"
              onClick={() => handleFeature('sendTransaction', createTransactionRequest())} isSubmitting={submitting['sendTransaction']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          sendTransactionResult 
      )}

      </div> 
      <div className="er-features">
      
      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">Wei</div>
              <input type="text" value={ formatEtherAmount } onChange={e => setFormatEtherAmount(e.target.value)} />
            </div>
            <AqexButton label="Wei To Eth" id="formatEther" className="playground-button playground-icon-button"
              onClick={() => handleFeature('formatEther', formatEtherAmount)} isSubmitting={submitting['formatEther']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          etherAmount
      )}
      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">Ether</div>
              <input type="text" value={ parseEtherAmount } onChange={e => setParseEtherAmount(e.target.value)} />
            </div>
            <AqexButton label="Eth to Wei" id="parseEther" className="playground-button playground-icon-button"
              onClick={() => handleFeature('parseEther', parseEtherAmount)} isSubmitting={submitting['parseEther']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          weiAmount
      )}
      { featurePanel( '', 
          <AqexButton label="Block Number" id="getBlockNumber" className="playground-button playground-icon-button"
            onClick={() => handleFeature('getBlockNumber')} isSubmitting={submitting['getBlockNumber']} timeout={BUTTON_TIMEOUT}
            setUIMsg={handleUIMessage} />,
          blockNumber
      )}
      </div>
    </Fragment>
  }

  function getSigningPanels() {
    return <div className="er-features">
    { featurePanel( '', 
        <Fragment>
          <div className="er-form-row">
            <div className="er-form-label">Domain</div>
            <input type="text" value={ signTypedEntry.domain } onChange={e => handleSignTypedEntry('domain', e.target.value)} />
          </div>
          <div className="er-form-row">
            <div className="er-form-label">Types</div>
            <input type="text" value={ signTypedEntry.types } onChange={e => handleSignTypedEntry('types', e.target.value)} />
          </div>
          <div className="er-form-row">
            <div className="er-form-label">Value</div>
            <input type="text" value={ signTypedEntry.value} onChange={e => handleSignTypedEntry('value', e.target.value)} />
          </div>
          <AqexButton label="Sign Typed Data" id="signTypedData" className="playground-button playground-icon-button"
            onClick={() => handleFeature('signTypedData', signTypedEntry ) } isSubmitting={submitting['signTypedData']} timeout={BUTTON_TIMEOUT}
            setUIMsg={handleUIMessage} />
        </Fragment>,
        formatSignature(signTypedDataResult)
    )}
    </div>
  }

  function getTokenPanels() {
    return <Fragment>
    <div className="er-features">
      { featurePanel( '', 
          <Fragment>
            <div className="er-form-row">
              <div className="er-form-label">Contract</div>
              <input type="text" value={ erc20ContractAddressEntry } onChange={e => setERC20ContractAddressEntry(e.target.value) } />
            </div>
            <AqexButton label="Connect Contract" id="erc20Contract" className="playground-button playground-icon-button"
              onClick={() => handleFeature('erc20Contract', erc20ContractAddressEntry ) } isSubmitting={submitting['erc20Contract']} timeout={BUTTON_TIMEOUT}
              setUIMsg={handleUIMessage} />
          </Fragment>,
          ''
      )}
      { featurePanel('Token Info', '', formatTokenInfo(erc20Info)) }
    </div>
    {
      erc20Info && 
      <Fragment>
      <div className="er-features">
        { featurePanel( '', 
            <Fragment>
              <div className="er-form-row">
                <div className="er-form-label">Account</div>
                <input type="text" value={ erc20BalanceOfEntry.address } onChange={e => handleErc20BalanceOfEntry('address', e.target.value)} />
              </div>
              <AqexButton label="ERC-20 Balance" id="erc20BalanceOf" className="playground-button playground-icon-button"
                onClick={() => handleFeature('erc20BalanceOf', { ...erc20BalanceOfEntry, contractAddress: erc20Info.address } ) } isSubmitting={submitting['erc20BalanceOf']} timeout={BUTTON_TIMEOUT}
                setUIMsg={handleUIMessage} />
            </Fragment>,
            erc20Balance
        )}
        { featurePanel( '', 
            <Fragment>
              <div className="er-form-row">
                <div className="er-form-label">To</div>
                <input type="text" value={ erc20TransferEntry.to } onChange={e => handleErc20TransferEntry('to', e.target.value)} />
              </div>
              <div className="er-form-row">
                <div className="er-form-label">Amount</div>
                <input type="text" value={ erc20TransferEntry.amount } onChange={e => handleErc20TransferEntry('amount', e.target.value)} />
              </div>
              <AqexButton label="ERC-20 Transfer" id="erc20Transfer" className="playground-button playground-icon-button"
                onClick={() => handleFeature('erc20Transfer', { ...erc20TransferEntry, contractAddress: erc20Info.address } ) } isSubmitting={submitting['erc20Transfer']} timeout={BUTTON_TIMEOUT}
                setUIMsg={handleUIMessage} />
            </Fragment>,
            erc20TransferOutput
        )}
      </div>

      </Fragment>
    }
    </Fragment>
  }

  return <Fragment>
    <div className="er-features">
      { featurePanel( '', 
          <AqexButton label="Connect" id="requestAccounts" className="playground-button playground-icon-button"
            onClick={() => handleFeature('requestAccounts')} isSubmitting={submitting['requestAccounts']}
            timeout={BUTTON_TIMEOUT} setUIMsg={handleUIMessage} />,
          formatAccounts(accounts)
      )}
      { featurePanel('Chain Info', '', formatChain(chainInfo)) }
    </div>
    
    { accounts && 
      <Fragment>
        { getTabs(activePanel) }
        { activePanel === 'account' && getAccountPanels() }
        { activePanel === 'signing' && getSigningPanels() }
        { activePanel === 'tokens' && getTokenPanels() }
      </Fragment>
    }
    
  </Fragment>
  
}
