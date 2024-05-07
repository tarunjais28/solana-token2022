/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ico.json`.
 */
export type Ico = {
  "address": "73i8QfnJhvrnUJw1Edg3VhV8ttdK9x9pP3jgL8PaUL2t",
  "metadata": {
    "name": "ico",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "icoAtaForIcoProgram",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "icoMint"
              }
            ]
          }
        },
        {
          "name": "data",
          "writable": true
        },
        {
          "name": "icoMint",
          "address": "FBKhAghAqzttng8UAAf7VuX7msiNAtVxgEsY4PrfZxP4"
        },
        {
          "name": "icoAtaForUser",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "icoAtaForIcoProgramBump",
          "type": "u8"
        },
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "buyWithUsdt",
      "discriminator": [
        153,
        240,
        26,
        40,
        127,
        249,
        89,
        78
      ],
      "accounts": [
        {
          "name": "icoAtaForIcoProgram",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "icoMint"
              }
            ]
          }
        },
        {
          "name": "data",
          "writable": true
        },
        {
          "name": "icoMint",
          "address": "FBKhAghAqzttng8UAAf7VuX7msiNAtVxgEsY4PrfZxP4"
        },
        {
          "name": "icoAtaForUser",
          "writable": true
        },
        {
          "name": "usdtAtaForUser",
          "writable": true
        },
        {
          "name": "usdtAtaForAdmin",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "icoAtaForIcoProgramBump",
          "type": "u8"
        },
        {
          "name": "usdtAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createIcoAta",
      "discriminator": [
        66,
        83,
        250,
        92,
        218,
        161,
        143,
        223
      ],
      "accounts": [
        {
          "name": "icoAtaForIcoProgram",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  210,
                  168,
                  143,
                  142,
                  247,
                  136,
                  78,
                  10,
                  218,
                  122,
                  125,
                  76,
                  171,
                  128,
                  26,
                  169,
                  22,
                  146,
                  14,
                  197,
                  170,
                  207,
                  111,
                  255,
                  70,
                  54,
                  23,
                  77,
                  166,
                  32,
                  72,
                  187
                ]
              }
            ]
          }
        },
        {
          "name": "data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "admin"
              }
            ]
          }
        },
        {
          "name": "icoMint",
          "address": "FBKhAghAqzttng8UAAf7VuX7msiNAtVxgEsY4PrfZxP4"
        },
        {
          "name": "icoAtaForAdmin",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "icoAmount",
          "type": "u64"
        },
        {
          "name": "solPrice",
          "type": "u64"
        },
        {
          "name": "usdtPrice",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositIcoInAta",
      "discriminator": [
        48,
        0,
        248,
        161,
        100,
        149,
        210,
        57
      ],
      "accounts": [
        {
          "name": "icoAtaForIcoProgram",
          "writable": true
        },
        {
          "name": "data",
          "writable": true
        },
        {
          "name": "icoMint",
          "address": "FBKhAghAqzttng8UAAf7VuX7msiNAtVxgEsY4PrfZxP4"
        },
        {
          "name": "icoAtaForAdmin",
          "writable": true
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "icoAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateData",
      "discriminator": [
        62,
        209,
        63,
        231,
        204,
        93,
        148,
        123
      ],
      "accounts": [
        {
          "name": "data",
          "writable": true
        },
        {
          "name": "admin",
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
          "name": "solPrice",
          "type": "u64"
        },
        {
          "name": "usdtPrice",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "data",
      "discriminator": [
        206,
        156,
        59,
        188,
        18,
        79,
        240,
        232
      ]
    }
  ],
  "types": [
    {
      "name": "data",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sol",
            "type": "u64"
          },
          {
            "name": "usdt",
            "type": "u64"
          },
          {
            "name": "admin",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
