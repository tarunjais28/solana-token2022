use super::*;

/// Function to manage whitelist users
///
/// This function can throw following errors:
pub fn manange_whitelist(
    ctx: Context<WhitelistUser>,
    update_type: UpdateType,
    users: Vec<Pubkey>,
) -> Result<()> {
    let sub_admins = &ctx.accounts.maintainers.sub_admins;
    let caller = ctx.accounts.authority.to_account_info().key();

    // Ensuring authorized sender
    require!(sub_admins.contains(&caller), CustomError::Unauthorized);

    let whitelist = &mut ctx.accounts.whitelist;

    match update_type {
        UpdateType::Add => {
            whitelist.add_users(users.clone());
        }
        UpdateType::Remove => {
            whitelist.remove_users(users.clone());
        }
    }

    // Emit whitelist event
    emit!(WhitelistEvent { update_type, users });

    Ok(())
}

#[derive(Accounts)]
#[instruction(update_type: UpdateType, users: Vec<Pubkey>)]
pub struct WhitelistUser<'info> {
    #[account(
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    /// CHECK: Whitelist
    #[account(
        mut,
        seeds = [WHITELIST_TAG],
        bump,
        realloc = if update_type.eq(&UpdateType::Add) {
                        std::mem::size_of::<WhitelistedUser>() + ((users.len() + whitelist.users.len()) * 32)
                  } else {
                        std::mem::size_of::<WhitelistedUser>() + (whitelist.users.len() * 32)
                  },
        realloc::payer = authority,
        realloc::zero = false,
    )]
    pub whitelist: Box<Account<'info, WhitelistedUser>>,

    /// CHECK: The authority of whitelist
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
