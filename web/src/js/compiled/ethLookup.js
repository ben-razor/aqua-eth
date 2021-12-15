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



export function registerEthLookup(...args) {
    registerService(
        args,
        {
    "defaultServiceId" : "eth-lookup",
    "functions" : [
        {
            "functionName" : "createHashInput",
            "argDefs" : [
                {
                    "name" : "address",
                    "argType" : {
                        "tag" : "primitive"
                    }
                },
                {
                    "name" : "salt",
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
            "functionName" : "getMostRecentRecord",
            "argDefs" : [
                {
                    "name" : "result",
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
            "functionName" : "verify",
            "argDefs" : [
                {
                    "name" : "address",
                    "argType" : {
                        "tag" : "primitive"
                    }
                },
                {
                    "name" : "record",
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

export function getHash(...args) {

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
                           (call %init_peer_id% ("getDataSrv" "salt") [] salt)
                          )
                          (call -relay- ("op" "noop") [])
                         )
                         (call relayId ("op" "noop") [])
                        )
                        (xor
                         (seq
                          (call peerId ("eth-lookup" "createHashInput") [address salt] hashInput)
                          (xor
                           (call relayId ("op" "sha256_string") [hashInput] hash)
                           (seq
                            (call -relay- ("op" "noop") [])
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                          )
                         )
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                         )
                        )
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [hash])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getHash",
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
        },
        {
            "name" : "salt",
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


export function putVerifiedEthRecord(...args) {

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
                              (call %init_peer_id% ("getDataSrv" "address") [] address)
                             )
                             (call %init_peer_id% ("getDataSrv" "salt") [] salt)
                            )
                            (call %init_peer_id% ("getDataSrv" "record") [] record)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (seq
                           (seq
                            (call peerId ("eth-lookup" "verify") [address record] verifyRes)
                            (xor
                             (match verifyRes.$.info.success! true
                              (xor
                               (seq
                                (xor
                                 (seq
                                  (call peerId ("eth-lookup" "createHashInput") [address salt] hashInput)
                                  (xor
                                   (call relayId ("op" "sha256_string") [hashInput] hash)
                                   (seq
                                    (call -relay- ("op" "noop") [])
                                    (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                   )
                                  )
                                 )
                                 (seq
                                  (seq
                                   (call -relay- ("op" "noop") [])
                                   (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                                  )
                                  (call -relay- ("op" "noop") [])
                                 )
                                )
                                (xor
                                 (seq
                                  (seq
                                   (call relayId ("peer" "timestamp_sec") [] ts)
                                   (call relayId ("aqua-dht" "register_key") [hash ts false 1])
                                  )
                                  (call relayId ("aqua-dht" "put_value") [hash record ts $arr1 $arr1 1] res)
                                 )
                                 (seq
                                  (call -relay- ("op" "noop") [])
                                  (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                                 )
                                )
                               )
                               (seq
                                (seq
                                 (seq
                                  (call -relay- ("op" "noop") [])
                                  (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                                 )
                                 (call -relay- ("op" "noop") [])
                                )
                                (call relayId ("op" "noop") [])
                               )
                              )
                             )
                             (null)
                            )
                           )
                           (ap verifyRes $resBox)
                          )
                          (seq
                           (seq
                            (seq
                             (call relayId ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 5])
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
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 6])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 7])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "putVerifiedEthRecord",
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
        },
        {
            "name" : "salt",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "record",
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


export function putValue(...args) {

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
                            (call %init_peer_id% ("getDataSrv" "hostId") [] hostId)
                           )
                           (call %init_peer_id% ("getDataSrv" "key") [] key)
                          )
                          (call %init_peer_id% ("getDataSrv" "value") [] value)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (xor
                         (seq
                          (seq
                           (call hostId ("peer" "timestamp_sec") [] ts)
                           (call hostId ("aqua-dht" "register_key") [key ts false 1])
                          )
                          (call hostId ("aqua-dht" "put_value") [key value ts $arr1 $arr1 1] res)
                         )
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                         )
                        )
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
    "functionName" : "putValue",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "hostId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "key",
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


export function getValues(...args) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "hostId") [] hostId)
                          )
                          (call %init_peer_id% ("getDataSrv" "key") [] key)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (xor
                         (seq
                          (call hostId ("peer" "timestamp_sec") [] ts)
                          (call hostId ("aqua-dht" "get_values") [key ts] res)
                         )
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                         )
                        )
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
    "functionName" : "getValues",
    "returnType" : {
        "tag" : "primitive"
    },
    "argDefs" : [
        {
            "name" : "hostId",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "key",
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


export function getVerifiedEthRecord(...args) {

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
                               (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                               (call %init_peer_id% ("getDataSrv" "peerId") [] peerId)
                              )
                              (call %init_peer_id% ("getDataSrv" "relayId") [] relayId)
                             )
                             (call %init_peer_id% ("getDataSrv" "address") [] address)
                            )
                            (call %init_peer_id% ("getDataSrv" "salt") [] salt)
                           )
                           (call -relay- ("op" "noop") [])
                          )
                          (call relayId ("op" "noop") [])
                         )
                         (xor
                          (seq
                           (seq
                            (seq
                             (seq
                              (seq
                               (call -relay- ("op" "noop") [])
                               (call relayId ("op" "noop") [])
                              )
                              (xor
                               (seq
                                (call peerId ("eth-lookup" "createHashInput") [address salt] hashInput)
                                (xor
                                 (call relayId ("op" "sha256_string") [hashInput] hash)
                                 (seq
                                  (call -relay- ("op" "noop") [])
                                  (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                                 )
                                )
                               )
                               (seq
                                (seq
                                 (call -relay- ("op" "noop") [])
                                 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                                )
                                (call -relay- ("op" "noop") [])
                               )
                              )
                             )
                             (xor
                              (seq
                               (call relayId ("peer" "timestamp_sec") [] ts)
                               (call relayId ("aqua-dht" "get_values") [hash ts] res)
                              )
                              (seq
                               (seq
                                (seq
                                 (call -relay- ("op" "noop") [])
                                 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                                )
                                (call -relay- ("op" "noop") [])
                               )
                               (call relayId ("op" "noop") [])
                              )
                             )
                            )
                            (call peerId ("eth-lookup" "getMostRecentRecord") [res] lookupRes)
                           )
                           (xor
                            (match lookupRes.$.info.success! true
                             (xor
                              (seq
                               (call peerId ("eth-lookup" "verify") [address lookupRes.$.data!] verifyRes)
                               (ap verifyRes $resBox)
                              )
                              (seq
                               (seq
                                (seq
                                 (seq
                                  (call relayId ("op" "noop") [])
                                  (call -relay- ("op" "noop") [])
                                 )
                                 (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                                )
                                (call -relay- ("op" "noop") [])
                               )
                               (call relayId ("op" "noop") [])
                              )
                             )
                            )
                            (seq
                             (seq
                              (ap lookupRes $resBox)
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
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 5])
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
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 6])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 7])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getVerifiedEthRecord",
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
        },
        {
            "name" : "salt",
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