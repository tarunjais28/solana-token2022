use super::*;

/// Function to update royalty
pub fn update_royalty_percentage(
    ctx: Context<UpdateTokenConfig>,
    _: String,
    royalty: u8,
) -> Result<()> {
    let caller = ctx.accounts.caller.to_account_info().key();
    let sub_admins = &ctx.accounts.maintainers.sub_admins;
    let config = &mut ctx.accounts.config;

    // Ensuring authorized sender
    require!(sub_admins.contains(&caller), CustomError::Unauthorized);

    let mut event = UpdateRoyaltyEvent::new(config.royalty);
    config.royalty = royalty;

    event.new = royalty;

    // Emit update royalty event
    emit!(event);

    Ok(())
}

/// Function to update tokens per sol
pub fn update_token_per_sol(
    ctx: Context<UpdateTokenConfig>,
    _: String,
    tokens_per_sol: u64,
) -> Result<()> {
    let caller = ctx.accounts.caller.to_account_info().key();
    let sub_admins = &ctx.accounts.maintainers.sub_admins;
    let config = &mut ctx.accounts.config;

    // Ensuring authorized sender
    require!(sub_admins.contains(&caller), CustomError::Unauthorized);

    let mut event = UpdateTokensPerSolEvent::new(config.tokens_per_sol);
    config.tokens_per_sol = tokens_per_sol;

    event.new = tokens_per_sol;

    // Emit update royalty event
    emit!(event);

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct UpdateTokenConfig<'info> {
    #[account(
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        mut,
        seeds = [CONFIG_TAG, token.as_bytes()],
        bump,
    )]
    pub config: Box<Account<'info, TokenConfiguration>>,

    /// CHECK: The caller
    #[account(mut)]
    pub caller: Signer<'info>,

    pub system_program: Program<'info, System>,
}
