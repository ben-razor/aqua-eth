/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.5.0-245
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
            "functionName" : "getAccounts",
            "argDefs" : [
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
            "functionName" : "receiveAccounts",
            "argDefs" : [
                {
                    "name" : "accounts",
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
        }
    ]
}
    );
}
      
// Functions

export function getAccounts(...args) {

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
                          (call peerId ("ethereum" "getAccounts") [] stuff)
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
                       (call %init_peer_id% ("callbackSrv" "response") [stuff])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getAccounts",
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
                          (call peerId ("ethereum" "getBalance") [address] res)
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
                         (call %init_peer_id% ("getDataSrv" "accounts") [] accounts)
                        )
                        (call -relay- ("op" "noop") [])
                       )
                       (call relayId ("op" "noop") [])
                      )
                      (xor
                       (call peerId ("ethereum" "receiveAccounts") [accounts])
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
            "name" : "accounts",
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
