export type TokenProgram = {
  "version": "0.1.0",
  "name": "token_program",
  "constants": [
    {
      "name": "CONFIG_TAG",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "MINT_TAG",
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    },
    {
      "name": "MAINTAINERS_TAG",
      "type": "bytes",
      "value": "[109, 97, 105, 110, 116, 97, 105, 110, 101, 114, 115]"
    },
    {
      "name": "WHITELIST_TAG",
      "type": "bytes",
      "value": "[119, 104, 105, 116, 101, 108, 105, 115, 116]"
    },
    {
      "name": "ESCROW_TAG",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "whitelistedUsers",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "manageAdmin",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addSubAdminAccounts",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "removeSubAdminAccounts",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "create",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateTokenParams"
          }
        }
      ]
    },
    {
      "name": "mintToken",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "burnToken",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "burnTokenFrom",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "manangeWhitelistUsers",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          }
        },
        {
          "name": "users",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "transferTokens",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TransferParams"
          }
        }
      ]
    },
    {
      "name": "forceTransferTokens",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ForceTransferParams"
          }
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "updateRoyalty",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
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
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
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
    },
    {
      "name": "buyWithSol",
      "accounts": [
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "BuyWithSolParams"
          }
        }
      ]
    }
  ],
  "accounts": [
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
              "vec": "publicKey"
            }
          },
          {
            "name": "admin",
            "docs": [
              "Admin"
            ],
            "type": "publicKey"
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
      "name": "whitelistedUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "type": {
              "vec": "publicKey"
            }
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
            "name": "toAccount",
            "docs": [
              "Token Name"
            ],
            "type": "publicKey"
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
            "type": "publicKey"
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
            "type": "publicKey"
          },
          {
            "name": "toAccount",
            "docs": [
              "To Account"
            ],
            "type": "publicKey"
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
      "name": "whitelistParams",
      "docs": [
        "The struct containing instructions for whitelisting"
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
            "name": "user",
            "docs": [
              "User to be whitelisted"
            ],
            "type": "publicKey"
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
    }
  ],
  "types": [
    {
      "name": "UpdateType",
      "docs": [
        "Update Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Add"
          },
          {
            "name": "Remove"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "subAdmin",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreateTokenEvent",
      "fields": [
        {
          "name": "name",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyWithSolEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ForceTransferEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WhitelistEvent",
      "fields": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          },
          "index": false
        },
        {
          "name": "users",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "UpdateAdminEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateSubAdminsEvent",
      "fields": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          },
          "index": false
        },
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRoyaltyEvent",
      "fields": [
        {
          "name": "old",
          "type": "u8",
          "index": false
        },
        {
          "name": "new",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTokensPerSolEvent",
      "fields": [
        {
          "name": "old",
          "type": "u64",
          "index": false
        },
        {
          "name": "new",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "Error: Your balance is not enough!"
    },
    {
      "code": 6001,
      "name": "AmountCantBeZero",
      "msg": "Error: Amount can't be zero!"
    },
    {
      "code": 6002,
      "name": "CountryCodeAuthorizationFailed",
      "msg": "Error: Country_code authentication failed!"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6004,
      "name": "TokenLimitExceeded",
      "msg": "Error: Token Limit exceeded!"
    },
    {
      "code": 6005,
      "name": "AccountFrozen",
      "msg": "Error: Account is frozen!"
    },
    {
      "code": 6006,
      "name": "BalanceFrozen",
      "msg": "Error: Balance is frozen!"
    }
  ]
};

export const IDL: TokenProgram = {
  "version": "0.1.0",
  "name": "token_program",
  "constants": [
    {
      "name": "CONFIG_TAG",
      "type": "bytes",
      "value": "[99, 111, 110, 102, 105, 103]"
    },
    {
      "name": "MINT_TAG",
      "type": "bytes",
      "value": "[109, 105, 110, 116]"
    },
    {
      "name": "MAINTAINERS_TAG",
      "type": "bytes",
      "value": "[109, 97, 105, 110, 116, 97, 105, 110, 101, 114, 115]"
    },
    {
      "name": "WHITELIST_TAG",
      "type": "bytes",
      "value": "[119, 104, 105, 116, 101, 108, 105, 115, 116]"
    },
    {
      "name": "ESCROW_TAG",
      "type": "bytes",
      "value": "[101, 115, 99, 114, 111, 119]"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "whitelistedUsers",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "manageAdmin",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "address",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "addSubAdminAccounts",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "removeSubAdminAccounts",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "create",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateTokenParams"
          }
        }
      ]
    },
    {
      "name": "mintToken",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "burnToken",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "burnTokenFrom",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TokenParams"
          }
        }
      ]
    },
    {
      "name": "manangeWhitelistUsers",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelist",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          }
        },
        {
          "name": "users",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "transferTokens",
      "accounts": [
        {
          "name": "whitelist",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TransferParams"
          }
        }
      ]
    },
    {
      "name": "forceTransferTokens",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fromAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ForceTransferParams"
          }
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
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
      "name": "updateRoyalty",
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
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
      "accounts": [
        {
          "name": "maintainers",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
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
    },
    {
      "name": "buyWithSol",
      "accounts": [
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "BuyWithSolParams"
          }
        }
      ]
    }
  ],
  "accounts": [
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
              "vec": "publicKey"
            }
          },
          {
            "name": "admin",
            "docs": [
              "Admin"
            ],
            "type": "publicKey"
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
      "name": "whitelistedUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "type": {
              "vec": "publicKey"
            }
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
            "name": "toAccount",
            "docs": [
              "Token Name"
            ],
            "type": "publicKey"
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
            "type": "publicKey"
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
            "type": "publicKey"
          },
          {
            "name": "toAccount",
            "docs": [
              "To Account"
            ],
            "type": "publicKey"
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
      "name": "whitelistParams",
      "docs": [
        "The struct containing instructions for whitelisting"
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
            "name": "user",
            "docs": [
              "User to be whitelisted"
            ],
            "type": "publicKey"
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
    }
  ],
  "types": [
    {
      "name": "UpdateType",
      "docs": [
        "Update Type"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Add"
          },
          {
            "name": "Remove"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "subAdmin",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CreateTokenEvent",
      "fields": [
        {
          "name": "name",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyWithSolEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ForceTransferEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "token",
          "type": "string",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WhitelistEvent",
      "fields": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          },
          "index": false
        },
        {
          "name": "users",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "UpdateAdminEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateSubAdminsEvent",
      "fields": [
        {
          "name": "updateType",
          "type": {
            "defined": "UpdateType"
          },
          "index": false
        },
        {
          "name": "addresses",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        }
      ]
    },
    {
      "name": "UpdateRoyaltyEvent",
      "fields": [
        {
          "name": "old",
          "type": "u8",
          "index": false
        },
        {
          "name": "new",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "UpdateTokensPerSolEvent",
      "fields": [
        {
          "name": "old",
          "type": "u64",
          "index": false
        },
        {
          "name": "new",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InsufficientFunds",
      "msg": "Error: Your balance is not enough!"
    },
    {
      "code": 6001,
      "name": "AmountCantBeZero",
      "msg": "Error: Amount can't be zero!"
    },
    {
      "code": 6002,
      "name": "CountryCodeAuthorizationFailed",
      "msg": "Error: Country_code authentication failed!"
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6004,
      "name": "TokenLimitExceeded",
      "msg": "Error: Token Limit exceeded!"
    },
    {
      "code": 6005,
      "name": "AccountFrozen",
      "msg": "Error: Account is frozen!"
    },
    {
      "code": 6006,
      "name": "BalanceFrozen",
      "msg": "Error: Balance is frozen!"
    }
  ]
};
