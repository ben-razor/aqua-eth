import AquaEthService from '../aquaEthService.js';
import { requestAccounts, getChainInfo, getBalance, getBlockNumber,
         getFeeData, getBlock, getTransaction,
         formatUnits, formatEther, parseUnits, parseEther, sendTransaction, 
         signTypedData, verifyTypedData,
         erc20Connect, erc20BalanceOf, erc20Transfer, 
         registerListenerNode} from '../compiled/aquaEth.js';

function aquaEthHandler(msg) {
  console.log(msg);
}

new AquaEthService(null, null, aquaEthHandler);

test('formats units', () => {
  expect(formatEther(1e18)).toBe('1.0');
});