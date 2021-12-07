# Aqua Eth

A wrapper around web3.js for interacting with Ethereum compatible blockchains using Fluence Aqua.

For the Gitcoin Hackathon task:

[Use The Fluence Js Node Example To Wrap And Expose A Web3 JS/TS Library](https://gitcoin.co/issue/fluencelabs/gitcoin-gr12-hackathon/1/100027204)

May be useful for the task:

[Enable Interactive Signing Of Arbitrary Data](https://gitcoin.co/issue/fluencelabs/gitcoin-gr12-hackathon/2/100027205)

## Fluence Network
> [Fluence Network](https://fluence.network/) is an open application platform where apps can build on each other, share data and users.

It is a **decentralized cloud platform** maintained and governed by its developers

### Fluence Nodes
Services are distributed across nodes forming p2p networks configured for specific applications.

Nodes may be specially configured servers, or lightweight nodes running in the browser.

## Aqua
[Aqua](https://doc.fluence.dev/aqua-book/) is the language for configuring communication between services of network.

* Aqua expresses **services** and **functions** that orchestrate the execution of node services.

* Aqua is also used to express the way the nodes will be connected, for example, whether the services will be called serially or in parallel.

## Fluence JS

> [Fluence JS](https://doc.fluence.dev/docs/fluence-js) is an implementation of the Fluence protocol for JavaScript-based environments.

It enables connections to be made to nodes to consume their services, and for new APIs to be exposed to the network.

Importantly, **Aqua** can be compiled to JS so that rich applications can be written in JS.

## Useful Links

[MetaMask ui test harness with ethers.js](https://github.com/MetaMask/test-dapp/blob/main/src/index.js)
