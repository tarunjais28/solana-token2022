use super::*;

#[event]
pub struct InitEvent {
    pub admin: Pubkey,
    pub sub_admin: Pubkey,
}

#[event]
pub struct CreateTokenEvent {
    /// Token Name
    pub name: String,
}

#[event]
pub struct MintEvent {
    pub token: String,
    pub amount: u64,
}

#[event]
pub struct TransferEvent {
    pub token: String,
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BuyWithSolEvent {
    pub token: String,
    pub sol_amount: u64,
    pub token_amount: u64,
}

#[event]
pub struct InitResourcesEvent {
    pub token: String,
    pub escrow_account: Pubkey,
    pub vault_account: Pubkey,
}

#[event]
pub struct ForceTransferEvent {
    pub token: String,
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BurnEvent {
    pub token: String,
    pub amount: u64,
}

#[event]
pub struct WhitelistEvent {
    pub update_type: UpdateType,
    pub users: Vec<Pubkey>,
}

#[event]
pub struct UpdateAdminEvent {
    pub from: Pubkey,
    pub to: Pubkey,
}

#[event]
pub struct UpdateSubAdminsEvent {
    pub update_type: UpdateType,
    pub addresses: Vec<Pubkey>,
}

#[event]
pub struct SetConfigEvent {
    pub token: String,
    pub royalty: u8,
    pub tokens_per_sol: u64,
}

#[event]
pub struct UpdateRoyaltyEvent {
    pub old: u8,
    pub new: u8,
}

impl UpdateRoyaltyEvent {
    pub fn new(old: u8) -> Self {
        Self { old, new: 0 }
    }
}

#[event]
pub struct UpdateTokensPerSolEvent {
    pub old: u64,
    pub new: u64,
}

impl UpdateTokensPerSolEvent {
    pub fn new(old: u64) -> Self {
        Self { old, new: 0 }
    }
}
