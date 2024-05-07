/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/token_program.json`.
 */
export type TokenProgram = {
  "address": "G6RQdQFBTM3UjCvBWyCKpguz2QKzG8FxDA6ZfKrnUpxz",
  "metadata": {
    "name": "tokenProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addSubAdminAccounts",
      "discriminator": [
        130,
        141,
        64,
        137,
        151,
        104,
        59,
        232
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "burnToken",
      "discriminator": [
        185,
        165,
        216,
        246,
        144,
        31,
        70,
        74
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "from",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "tokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "burnTokenFrom",
      "discriminator": [
        130,
        42,
        112,
        104,
        14,
        182,
        206,
        113
      ],
      "accounts": [
        {
          "name": "maintainers",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "from",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "tokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "buyWithSol",
      "discriminator": [
        49,
        57,
        124,
        194,
        240,
        20,
        216,
        102
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "whitelist",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAta",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "buyWithSolParams"
            }
          }
        }
      ]
    },
    {
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "create",
      "discriminator": [
        24,
        30,
        200,
        40,
        5,
        28,
        7,
        119
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createTokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "forceTransferTokens",
      "discriminator": [
        185,
        34,
        78,
        211,
        192,
        13,
        160,
        37
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "fromAccount",
          "writable": true
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "forceTransferParams"
            }
          }
        }
      ]
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "whitelistedUsers",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "initResources",
      "discriminator": [
        220,
        13,
        68,
        41,
        162,
        178,
        71,
        168
      ],
      "accounts": [
        {
          "name": "mintAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "vaultAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        }
      ]
    },
    {
      "name": "manageAdmin",
      "discriminator": [
        141,
        136,
        128,
        177,
        111,
        187,
        95,
        148
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "manangeWhitelistUsers",
      "discriminator": [
        34,
        46,
        244,
        119,
        3,
        129,
        185,
        59
      ],
      "accounts": [
        {
          "name": "maintainers",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "updateType",
          "type": {
            "defined": {
              "name": "updateType"
            }
          }
        },
        {
          "name": "users",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "mintToken",
      "discriminator": [
        172,
        137,
        183,
        14,
        207,
        110,
        234,
        56
      ],
      "accounts": [
        {
          "name": "maintainers",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "tokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "removeSubAdminAccounts",
      "discriminator": [
        152,
        249,
        193,
        89,
        66,
        185,
        139,
        172
      ],
      "accounts": [
        {
          "name": "maintainers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "transferTokens",
      "discriminator": [
        54,
        180,
        238,
        175,
        74,
        85,
        126,
        188
      ],
      "accounts": [
        {
          "name": "whitelist",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "arg",
                "path": "params.token"
              }
            ]
          }
        },
        {
          "name": "fromAccount",
          "writable": true
        },
        {
          "name": "toAccount",
          "writable": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "transferParams"
            }
          }
        }
      ]
    },
    {
      "name": "updateRoyalty",
      "discriminator": [
        161,
        228,
        94,
        20,
        188,
        184,
        82,
        142
      ],
      "accounts": [
        {
          "name": "maintainers",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "royalty",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateTokensPerSol",
      "discriminator": [
        138,
        153,
        80,
        23,
        87,
        69,
        101,
        134
      ],
      "accounts": [
        {
          "name": "maintainers",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  105,
                  110,
                  116,
                  97,
                  105,
                  110,
                  101,
                  114,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "token"
              }
            ]
          }
        },
        {
          "name": "caller",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "string"
        },
        {
          "name": "tokensPerSol",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "maintainers",
      "discriminator": [
        201,
        217,
        234,
        104,
        25,
        149,
        168,
        56
      ]
    },
    {
      "name": "tokenConfiguration",
      "discriminator": [
        140,
        74,
        25,
        76,
        129,
        29,
        174,
        0
      ]
    },
    {
      "name": "whitelistedUser",
      "discriminator": [
        156,
        78,
        95,
        223,
        72,
        234,
        174,
        85
      ]
    }
  ],
  "events": [
    {
      "name": "burnEvent",
      "discriminator": [
        33,
        89,
        47,
        117,
        82,
        124,
        238,
        250
      ]
    },
    {
      "name": "buyWithSolEvent",
      "discriminator": [
        168,
        204,
        10,
        138,
        212,
        243,
        210,
        108
      ]
    },
    {
      "name": "createTokenEvent",
      "discriminator": [
        4,
        4,
        86,
        151,
        191,
        94,
        245,
        193
      ]
    },
    {
      "name": "forceTransferEvent",
      "discriminator": [
        119,
        155,
        127,
        138,
        212,
        94,
        162,
        178
      ]
    },
    {
      "name": "initEvent",
      "discriminator": [
        224,
        129,
        78,
        87,
        58,
        43,
        94,
        127
      ]
    },
    {
      "name": "initResourcesEvent",
      "discriminator": [
        124,
        65,
        4,
        122,
        111,
        2,
        240,
        216
      ]
    },
    {
      "name": "mintEvent",
      "discriminator": [
        197,
        144,
        146,
        149,
        66,
        164,
        95,
        16
      ]
    },
    {
      "name": "transferEvent",
      "discriminator": [
        100,
        10,
        46,
        113,
        8,
        28,
        179,
        125
      ]
    },
    {
      "name": "updateAdminEvent",
      "discriminator": [
        225,
        152,
        171,
        87,
        246,
        63,
        66,
        234
      ]
    },
    {
      "name": "updateRoyaltyEvent",
      "discriminator": [
        35,
        92,
        21,
        31,
        14,
        55,
        161,
        40
      ]
    },
    {
      "name": "updateSubAdminsEvent",
      "discriminator": [
        72,
        133,
        167,
        136,
        247,
        186,
        123,
        166
      ]
    },
    {
      "name": "updateTokensPerSolEvent",
      "discriminator": [
        13,
        108,
        10,
        146,
        29,
        35,
        242,
        66
      ]
    },
    {
      "name": "whitelistEvent",
      "discriminator": [
        69,
        134,
        177,
        228,
        216,
        46,
        239,
        8
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientFunds",
      "msg": "Error: Your balance is not enough!"
    },
    {
      "code": 6001,
      "name": "amountCantBeZero",
      "msg": "Error: Amount can't be zero!"
    },
    {
      "code": 6002,
      "name": "countryCodeAuthorizationFailed",
      "msg": "Error: Country_code authentication failed!"
    },
    {
      "code": 6003,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6004,
      "name": "tokenLimitExceeded",
      "msg": "Error: Token Limit exceeded!"
    },
    {
      "code": 6005,
      "name": "accountFrozen",
      "msg": "Error: Account is frozen!"
    },
    {
      "code": 6006,
      "name": "balanceFrozen",
      "msg": "Error: Balance is frozen!"
    }
  ],
  "types": [
    {
      "name": "burnEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "buyWithSolEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "tokenAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "buyWithSolParams",
      "docs": [
        "The struct containing instructions for transferring tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "solAmount",
            "docs": [
              "Sol Amount"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "createTokenEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createTokenParams",
      "docs": [
        "The struct containing instructions for creating tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "symbol",
            "docs": [
              "Symbol"
            ],
            "type": "string"
          },
          {
            "name": "uri",
            "docs": [
              "URI"
            ],
            "type": "string"
          },
          {
            "name": "decimals",
            "docs": [
              "Decimals"
            ],
            "type": "u8"
          },
          {
            "name": "royalty",
            "docs": [
              "Royalty"
            ],
            "type": "u8"
          },
          {
            "name": "tokensPerSol",
            "docs": [
              "Token to be distributed per Sol"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "forceTransferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "from",
            "type": "pubkey"
          },
          {
            "name": "to",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "forceTransferParams",
      "docs": [
        "The struct containing instructions for force transferring tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "fromAccount",
            "docs": [
              "From Account"
            ],
            "type": "pubkey"
          },
          {
            "name": "toAccount",
            "docs": [
              "To Account"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens to be transferred"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "subAdmin",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initResourcesEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "escrowAccount",
            "type": "pubkey"
          },
          {
            "name": "vaultAccount",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "maintainers",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "subAdmins",
            "docs": [
              "Sub Admins"
            ],
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "admin",
            "docs": [
              "Admin"
            ],
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "mintEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenConfiguration",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "royalty",
            "docs": [
              "Royalty"
            ],
            "type": "u8"
          },
          {
            "name": "tokensPerSol",
            "docs": [
              "Token to be distributed per Sol"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenParams",
      "docs": [
        "The struct containing instructions for mint and burn tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens to be minted."
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "type": "string"
          },
          {
            "name": "from",
            "type": "pubkey"
          },
          {
            "name": "to",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "transferParams",
      "docs": [
        "The struct containing instructions for transferring tokens"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "token",
            "docs": [
              "Token Name"
            ],
            "type": "string"
          },
          {
            "name": "toAccount",
            "docs": [
              "To Token"
            ],
            "type": "pubkey"
          },
          {
            "name": "amount",
            "docs": [
              "Amount of tokens to be transferred"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateAdminEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "from",
            "type": "pubkey"
          },
          {
            "name": "to",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "updateRoyaltyEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "old",
            "type": "u8"
          },
          {
            "name": "new",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "updateSubAdminsEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "updateType",
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          },
          {
            "name": "addresses",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "updateTokensPerSolEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "old",
            "type": "u64"
          },
          {
            "name": "new",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updateType",
      "docs": [
        "Update Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "add"
          },
          {
            "name": "remove"
          }
        ]
      }
    },
    {
      "name": "whitelistEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "updateType",
            "type": {
              "defined": {
                "name": "updateType"
              }
            }
          },
          {
            "name": "users",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "whitelistedUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "configTag",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "escrowTag",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    },
    {
      "name": "maintainersTag",
      "type": "bytes",
      "value": "[109, 97, 105, 110, 116, 97, 105, 110, 101, 114, 115]"
    },
    {
      "name": "mintTag",
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    },
    {
      "name": "vaultTag",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    },
    {
      "name": "whitelistTag",
      "type": "bytes",
      "value": "[119, 104, 105, 116, 101, 108, 105, 115, 116]"
    }
  ]
};
