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
We will call peers that connect to the server to carry out ethers.js functions the **client**.

The **server** is created using:

```js
// msg object has fields { method, type, success, reason, data }
function aquaEthHandler(msg) {
  ...
}

new AquaEthServer(aquaEthHandler);
```

The constructor calls **registerEthereum** exported by the FluenceJS compilation to create a Fluence service that wraps ethers.js. A handler can be passed in so that the **server** can receive updates as methods are called.

The **client** imports functions from the compiled Aqua that automatically forward requests to the **server**.

## Two way connection

Queries to ethers.js return relatively quickly so the data is returned directly to the client.

Because Update operations need human interaction on the **server** side. A mechanism is provided in Aqua to register the client to receive updates when operations complete. This also allows for updates to be provided when transactions are added to the chain.

The interface is acheived in Aqua using:

```aqua
service Ethereum:
  registerListenerNode(listenerPeerId: string, listenerRelayId: string)
  receiveData(packet: JSONPacket)

func registerListenerNode(peerId: string, relayId: string, listenerPeerId: string, listenerRelayId: string):
    on peerId via relayId:
        Ethereum.registerListenerNode(listenerPeerId, listenerRelayId)

func listenerNodeCallback(peerId: string, relayId: string, jsonPacket: JSONPacket):
    on peerId via relayId:
        Ethereum.receiveData(jsonPacket)
```

1. The client calls **registerListenerNode** to register for updates.
2. The **server** calls the function **listenerNodeCallback** to trigger events on the **client**.
3. The Ethereum.receiveData(jsonPacket) service method uses the registered aquaEthHandler on the **client** to provide updates. The **method** passed in the msg data is set to **receiveData**
