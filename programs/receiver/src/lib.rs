use crate::{constants::*, errors::*, instructions::*, states::*};
use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

mod constants;
mod errors;
mod instructions;
mod states;

declare_id!("F3gxJsG99VG66BqBNwUHFf9Qqzy9XxWYiAuFJzQwZcE2");

#[program]
pub mod receiver {
    use super::*;

    pub fn init(ctx: Context<Initialize>, escrow_key: Pubkey) -> Result<()> {
        instructions::initialize(ctx, escrow_key)
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

    pub fn receive(ctx: Context<Receiver>, amount: u64) -> Result<()> {
        instructions::receive_and_store(ctx, amount)
    }

    pub fn update_escrow(ctx: Context<SetEscrow>, address: Pubkey) -> Result<()> {
        instructions::set_escrow(ctx, address)
    }
}
