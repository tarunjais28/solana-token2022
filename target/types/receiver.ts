/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/receiver.json`.
 */
export type Receiver = {
  "address": "F3gxJsG99VG66BqBNwUHFf9Qqzy9XxWYiAuFJzQwZcE2",
  "metadata": {
    "name": "receiver",
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
          "name": "escrowKey",
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
              }
            ]
          }
        },
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
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
          "name": "escrowKey",
          "type": "pubkey"
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
      "name": "receive",
      "discriminator": [
        86,
        17,
        255,
        171,
        17,
        17,
        187,
        219
      ],
      "accounts": [
        {
          "name": "userData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              }
            ]
          }
        },
        {
          "name": "escrowAccount",
          "writable": true
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
          "name": "escrowKey",
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
              }
            ]
          }
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
          "name": "amount",
          "type": "u64"
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
      "name": "updateEscrow",
      "discriminator": [
        252,
        228,
        127,
        1,
        60,
        43,
        54,
        28
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
          "name": "escrowKey",
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
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowKey",
      "discriminator": [
        116,
        183,
        59,
        90,
        150,
        117,
        21,
        24
      ]
    },
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
      "name": "userData",
      "discriminator": [
        139,
        248,
        167,
        203,
        253,
        220,
        210,
        221
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6001,
      "name": "unknownReceiver",
      "msg": "Error: Unknown Receiver!"
    }
  ],
  "types": [
    {
      "name": "escrowKey",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
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
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
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
      "name": "userData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "type": {
              "vec": {
                "defined": {
                  "name": "user"
                }
              }
            }
          }
        ]
      }
    }
  ],
  "constants": [
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
      "name": "userDataTag",
      "type": "bytes",
      "value": "[117, 115, 101, 114, 95, 100, 97, 116, 97]"
    }
  ]
};
