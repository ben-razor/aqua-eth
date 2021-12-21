import AquaEthService from '../aquaEthService.js';
import { requestAccounts, getChainInfo, getBalance, getBlockNumber,
         getFeeData, getBlock, getTransaction,
         formatUnits, formatEther, parseUnits, parseEther, sendTransaction, 
         keccak256Text, keccak256, ripemd160, sha256, sha512, computeHmac,
         arrayify, hexValue, stripZeros, zeroPad, hexConcat, hexDataLength, hexDataSlice,
         hexStripZeros, hexZeroPad,
         signTypedData, verifyTypedData,
         erc20Connect, erc20BalanceOf, erc20Transfer, 
         registerListenerNode} from '../compiled/aquaEth.js';
import { attemptConnect, attemptDisconnect } from '../components/FluenceReact.js';
import getConnector from '../components/Connector.js';
let connector = getConnector();

let peerId;
let relayPeerId;

jest.setTimeout(20000);

function aquaEthHandler(msg) { }

beforeEach(async() => {
  let data = await attemptConnect(connector);
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

  res = await keccak256Text(peerId, relayPeerId, 'hello world');
  expect(res.data).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad');

  res = await keccak256(peerId, relayPeerId, [ 0x12, 0x34 ]);
  expect(res.data).toBe('0x56570de287d73cd1cb6092bb8fdee6173974955fdef345ae579ee9f475ea7432');

  res = await ripemd160(peerId, relayPeerId, '0x1234');
  expect(res.data).toBe('0xc39867e393cb061b837240862d9ad318c176a96d');

  res = await sha256(peerId, relayPeerId, '0x1234');
  expect(res.data).toBe('0x3a103a4e5729ad68c02a678ae39accfbc0ae208096437401b7ceab63cca0622f');

  res = await sha512(peerId, relayPeerId, '0x1234');
  expect(res.data).toBe('0x4c54886c9821195522d88ff4705c3e0c686b921054421e6ea598739c29c26e1ee75419aaceec94dd2e3c0dbb82ecf895c9f61215f375de6d800d9b99d3d4b816');

  let key = "0x0102"
  let data = "0x1234"
  res = await computeHmac(peerId, relayPeerId, 'sha256', key, data);
  expect(res.data).toBe('0x7553df81c628815cf569696cad13a37c606c5058df13d9dff4fee2cf5e9b5779');

  res = await arrayify(peerId, relayPeerId, '0x0102')
  expect(res.data).toStrictEqual([1,2]);

  res = await hexValue(peerId, relayPeerId, '255');
  expect(res.data).toBe('0xff');

  res = await stripZeros(peerId, relayPeerId, [0, 0, 0, 1])
  expect(res.data).toStrictEqual([1]);

  res = await zeroPad(peerId, relayPeerId, [1], 4)
  expect(res.data).toStrictEqual([0, 0, 0, 1]);

  res = await hexConcat(peerId, relayPeerId, ['0x11', '0x22', '0x33'])
  expect(res.data).toBe('0x112233');

  res = await hexDataLength(peerId, relayPeerId, '0x1122')
  expect(res.data).toBe(2);

  res = await hexDataSlice(peerId, relayPeerId, '0x112233', 1, null)
  expect(res.data).toBe('0x2233');

  res = await hexDataSlice(peerId, relayPeerId, '0x112233', 1, 2)
  expect(res.data).toBe('0x22');
  
  res = await hexStripZeros(peerId, relayPeerId, '0x000069');
  expect(res.data).toBe('0x69');

  res = await hexZeroPad(peerId, relayPeerId, '0x01', 4)
  expect(res.data).toBe('0x00000001');
});