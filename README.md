# Aqua Eth

A wrapper around ethers.js and Metamask for interacting with Ethereum compatible blockchains remotely using [Fluence Aqua](https://fluence.network/).

For the Gitcoin GR12 Hackathon task:

[Use The Fluence Js Node Example To Wrap And Expose A Web3 JS/TS Library](https://gitcoin.co/issue/fluencelabs/gitcoin-gr12-hackathon/1/100027204)

## Important Links

The file [aquaEth.aqua](https://github.com/ben-razor/aqua-eth/blob/main/web/src/aqua/aquaEth.aqua) defines the interface for a Fluence service called Ethereum.

The interface is implemented using FluenceJS in [aquaEthServer.js](https://github.com/ben-razor/aqua-eth/blob/main/web/src/js/aquaEthServer.js).

The service wraps a wide variety of functionality from the [ethers.js](https://docs.ethers.io/v5/api/) library.

An application is provided at [Eth Remote](https://eth-remote.web.app/) that acts as a test harness for the wrapped ethers.js functionality.

## Mode of Operation

We will call the peer that has MetaMask the **server**.
We will call peers that connect to the signer to carry out ethers.js functions the **client**.

The **server** is created using:

```
// msg object has fields { method, type, success, reason, data }
function aquaEthHandler(msg) {
  ...
}

new AquaEthServer(aquaEthHandler);
```

The constructor calls **registerEthereum** exported by the FluenceJS compilation to create a Fluence service that wraps ethers.js. A handler can be passed in so that the **server** can receive updates as methods are called.

The **client** imports functions from the compiled Aqua that automatically forward requests to the **server**.

## Two way connection

