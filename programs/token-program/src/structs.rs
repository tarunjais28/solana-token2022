use super::*;

/// The struct containing instructions for creating tokens
#[account]
#[derive(Debug, Default)]
pub struct CreateTokenParams {
    /// Token Name
    pub name: String,

    /// Decimals
    pub decimals: u8,

    /// Royalty
    pub royalty: u8,
}

/// The struct containing instructions for mint and burn tokens
#[account]
#[derive(Debug, Default)]
pub struct TokenParams {
    /// Token Name
    pub name: String,

    /// Token Name
    pub to_account: Pubkey,

    /// Amount of tokens to be minted.
    pub amount: u64,
}

/// The struct containing instructions for transferring tokens
#[account]
#[derive(Debug, Default)]
pub struct TransferParams {
    /// Token Name
    pub token: String,

    /// To Token
    pub to_account: Pubkey,

    /// Amount of tokens to be transferred
    pub amount: u64,
}

/// The struct containing instructions for force transferring tokens
#[account]
#[derive(Debug, Default)]
pub struct ForceTransferParams {
    /// Token Name
    pub token: String,

    /// From Account
    pub from_account: Pubkey,

    /// To Account
    pub to_account: Pubkey,

    /// Amount of tokens to be transferred
    pub amount: u64,
}

/// The struct containing instructions for whitelisting
#[account]
#[derive(Debug, Default)]
pub struct WhitelistParams {
    /// Token Name
    pub token: String,

    /// User to be whitelisted
    pub user: Pubkey,
}

/// The struct containing instructions for transferring tokens
#[account]
#[derive(Debug, Default)]
pub struct BuyWithSolParams {
    /// Token Name
    pub token: String,

    /// Sol Amount
    pub sol_amount: u64,

    /// Token Amount
    pub token_amount: u64,
}
