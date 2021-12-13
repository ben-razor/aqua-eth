import AquaEthService from '../aquaEthService.js';
import { requestAccounts, getChainInfo, getBalance, getBlockNumber,
         getFeeData, getBlock, getTransaction,
         formatUnits, formatEther, parseUnits, parseEther, sendTransaction, 
         signTypedData, verifyTypedData,
         erc20Connect, erc20BalanceOf, erc20Transfer, 
         registerListenerNode} from '../compiled/aquaEth.js';
import { attemptConnect, attemptDisconnect } from '../components/FluenceReact.js';
import connect from '../components/Connect.js';

let peerId;
let relayPeerId;

jest.setTimeout(10000);

function aquaEthHandler(msg) { }

beforeEach(async() => {
  let data = await attemptConnect(connect);
  peerId = data.connectionInfo.peerId;
  relayPeerId = data.connectionInfo.relayPeerId;
  new AquaEthService(null, null, aquaEthHandler);
});

afterEach(async() => {
  await attemptDisconnect();
})

test('ethersjs utils', async() => {
  let res;

  res = await formatEther(peerId, relayPeerId, 1e18.toString());
  expect(res.data).toBe('1.0');

  res = await parseEther(peerId, relayPeerId, '1');
  expect(res.data).toBe(1e18.toString());

  res = await formatUnits(peerId, relayPeerId, 1e18.toString(), '18');
  expect(res.data).toBe('1.0');

  res = await parseUnits(peerId, relayPeerId, '1', '18');
  expect(res.data).toBe(1e18.toString());

  
});