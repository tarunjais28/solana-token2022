use crate::{constants::*, enums::*, errors::*, events::*, instructions::*, states::*, structs::*};
use anchor_lang::{prelude::*, solana_program::entrypoint::ProgramResult};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, Burn, MintTo, Token2022, TransferChecked},
    token_interface::{token_metadata_initialize, Mint, TokenAccount, TokenMetadataInitialize},
};
use spl_token_2022::{extension::ExtensionType, state::Mint as MintState};
pub use structs::TokenParams;

mod constants;
mod enums;
mod errors;
mod events;
mod instructions;
mod states;
mod structs;

declare_id!("v81yorXjyCwZA3GKEccnsPg2je2fq7QDAkcjHawcjtX");

#[program]
pub mod token_program {
    use super::*;

    pub fn init(ctx: Context<Initialize>, whitelisted_users: Vec<Pubkey>) -> Result<()> {
        instructions::initialize(ctx, whitelisted_users)
    }

    pub fn manage_admin(ctx: Context<UpdateAdmin>, address: Pubkey) -> Result<()> {
        instructions::update_admin(ctx, address)
    }

    pub fn add_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::add_sub_admins(ctx, addresses)
    }

    pub fn remove_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::remove_sub_admins(ctx, addresses)
    }

    pub fn create(ctx: Context<CreateToken>, params: CreateTokenParams) -> Result<()> {
        instructions::create_token(ctx, params)
    }

    pub fn init_resources(ctx: Context<InitResources>, token: String) -> Result<()> {
        instructions::init_resource_accounts(ctx, token)
    }

    pub fn mint_token(ctx: Context<MintToken>, params: TokenParams) -> Result<()> {
        instructions::mint(ctx, params)
    }

    pub fn burn_token(ctx: Context<BurnToken>, params: TokenParams) -> Result<()> {
        instructions::burn(ctx, params)
    }

    pub fn burn_token_from(ctx: Context<BurnTokenFrom>, params: TokenParams) -> Result<()> {
        instructions::burn_from(ctx, params)
    }

    pub fn manange_whitelist_users(
        ctx: Context<WhitelistUser>,
        update_type: UpdateType,
        users: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::manange_whitelist(ctx, update_type, users)
    }

    pub fn transfer_tokens(ctx: Context<TransferTokens>, params: TransferParams) -> Result<()> {
        instructions::transfer(ctx, params)
    }

    pub fn force_transfer_tokens(
        ctx: Context<ForceTransferTokens>,
        params: ForceTransferParams,
    ) -> Result<()> {
        instructions::force_transfer(ctx, params)
    }

    pub fn claim(ctx: Context<ClaimTokens>, token: String) -> Result<()> {
        instructions::claim_royalty(ctx, token)
    }

    pub fn set_config(
        ctx: Context<UpdateTokenConfig>,
        token: String,
        royalty: u8,
        tokens_per_sol: u64,
    ) -> Result<()> {
        instructions::add_config(ctx, token, royalty, tokens_per_sol)
    }

    pub fn update_royalty(
        ctx: Context<UpdateTokenConfig>,
        token: String,
        royalty: u8,
    ) -> Result<()> {
        instructions::update_royalty_percentage(ctx, token, royalty)
    }

    pub fn update_tokens_per_sol(
        ctx: Context<UpdateTokenConfig>,
        token: String,
        tokens_per_sol: u64,
    ) -> Result<()> {
        instructions::update_token_per_sol(ctx, token, tokens_per_sol)
    }

    pub fn buy_with_sol(ctx: Context<BuyWithSol>, params: BuyWithSolParams) -> Result<()> {
        instructions::buy_token_with_sol(ctx, params)
    }
}
