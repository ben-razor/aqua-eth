/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.4.1-240
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v2';


// Services



export function registerEthereum(...args) {
    registerService(
        args,
        {
    "defaultServiceId" : "ethereum",
    "functions" : [
        {
            "functionName" : "formatEther",
            "argDefs" : [
                {
                    "name" : "amount",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "getBalance",
            "argDefs" : [
                {
                    "name" : "address",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "getBlockNumber",
            "argDefs" : [
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "getChainInfo",
            "argDefs" : [
                {
                    "name" : "chainId",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "getConnectedChainInfo",
            "argDefs" : [
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "parseEther",
            "argDefs" : [
                {
                    "name" : "amount",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "receiveData",
            "argDefs" : [
                {
                    "name" : "packet",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "void"
            }
        },
        {
            "functionName" : "registerListenerNode",
            "argDefs" : [
                {
                    "name" : "listenerPeerId",
                    "argType" : {
                        "tag" : "primitive"
                    }
                },
                {
                    "name" : "listenerRelayId",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "void"
            }
        },
        {
            "functionName" : "requestAccounts",
            "argDefs" : [
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "sendTransaction",
            "argDefs" : [
                {
                    "name" : "transactionRequest",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        },
        {
            "functionName" : "signTypedData",
            "argDefs" : [
                {
                    "name" : "domain",
                    "argType" : {
                        "tag" : "primitive"
                    }
                },
                {
                    "name" : "types",
                    "argType" : {
                        "tag" : "primitive"
                    }
                },
                {
                    "name" : "value",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        }
    ]
}
    );
}
      
// Functions

export function getBlockNumber(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                             (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                            )
                            (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "getBlockNumber") [] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getBlockNumber",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function identityResultChain(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (call %init_peer_id% ("getDataSrv" "val") [] val)
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [val])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "identityResultChain",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "val",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function getBalance(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                              (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                             )
                             (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                            )
                            (call %init_peer_id% ("getDataSrv" "address") [] address)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (seq
                           (call peerId ("ethereum" "getBalance") [address] blockRes)
                           (xor
                            (match blockRes.$.info.success! true
                             (xor
                              (call peerId ("ethereum" "formatEther") [blockRes.$.data!] $resBox)
                              (seq
                               (seq
                                (seq
                                 (seq
                                  (call relayId ("op" "noop") [])
                                  (call -relay- ("op" "noop") [])
                                 )
                                 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                )
                                (call -relay- ("op" "noop") [])
                               )
                               (call relayId ("op" "noop") [])
                              )
                             )
                            )
                            (seq
                             (seq
                              (ap blockRes $resBox)
                              (call relayId ("op" "noop") [])
                             )
                             (call -relay- ("op" "noop") [])
                            )
                           )
                          )
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [$resBox.$.[0]!])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getBalance",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "address",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function formatEther(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                              (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                             )
                             (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                            )
                            (call %init_peer_id% ("getDataSrv" "amount") [] amount)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "formatEther") [amount] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "formatEther",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "amount",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function registerListenerNode(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                           )
                           (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                          )
                          (call %init_peer_id% ("getDataSrv" "listenerPeerId") [] listenerPeerId)
                         )
                         (call %init_peer_id% ("getDataSrv" "listenerRelayId") [] listenerRelayId)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (call relayId ("op" "noop") [])
                      )
                      (xor
                       (call peerId ("ethereum" "registerListenerNode") [listenerPeerId listenerRelayId])
                       (seq
                        (seq
                         (seq
                          (call relayId ("op" "noop") [])
                          (call -relay- ("op" "noop") [])
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                        (call -relay- ("op" "noop") [])
                       )
                      )
                     )
                     (seq
                      (seq
                       (call relayId ("op" "noop") [])
                       (call -relay- ("op" "noop") [])
                      )
                      (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                     )
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "registerListenerNode",
    "returnType" : {
        "tag" : "void"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "listenerPeerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "listenerRelayId",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function listenerNodeCallback(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                          )
                          (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                         )
                         (call %init_peer_id% ("getDataSrv" "jsonPacket") [] jsonPacket)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (call relayId ("op" "noop") [])
                      )
                      (xor
                       (call peerId ("ethereum" "receiveData") [jsonPacket])
                       (seq
                        (seq
                         (seq
                          (call relayId ("op" "noop") [])
                          (call -relay- ("op" "noop") [])
                         )
                         (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                        )
                        (call -relay- ("op" "noop") [])
                       )
                      )
                     )
                     (seq
                      (seq
                       (call relayId ("op" "noop") [])
                       (call -relay- ("op" "noop") [])
                      )
                      (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                     )
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "listenerNodeCallback",
    "returnType" : {
        "tag" : "void"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "jsonPacket",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function parseEther(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                              (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                             )
                             (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                            )
                            (call %init_peer_id% ("getDataSrv" "amount") [] amount)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "parseEther") [amount] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "parseEther",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "amount",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function identityResultString(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                       (call %init_peer_id% ("getDataSrv" "val") [] val)
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [val])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "identityResultString",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "val",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function sendTransaction(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                              (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                             )
                             (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                            )
                            (call %init_peer_id% ("getDataSrv" "transactionRequest") [] transactionRequest)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "sendTransaction") [transactionRequest] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "sendTransaction",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "transactionRequest",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function signTypedData(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (seq
                              (seq
                               (seq
                                (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                                (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                               )
                               (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                              )
                              (call %init_peer_id% ("getDataSrv" "domain") [] domain)
                             )
                             (call %init_peer_id% ("getDataSrv" "types") [] types)
                            )
                            (call %init_peer_id% ("getDataSrv" "value") [] value)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "signTypedData") [domain types value] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "signTypedData",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "domain",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "types",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "value",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function requestAccounts(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                             (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                            )
                            (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "requestAccounts") [] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "requestAccounts",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}


export function getChainInfo(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (seq
                             (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                             (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                            )
                            (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (call peerId ("ethereum" "getConnectedChainInfo") [] res)
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (call relayId ("op" "noop") [])
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getChainInfo",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "peerId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "relayId",
            "argType" : {
                "tag" : "primitive"
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
