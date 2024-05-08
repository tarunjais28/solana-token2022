use super::*;

/// Function to update escrow
pub fn set_escrow(ctx: Context<SetEscrow>, address: Pubkey) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &ctx.accounts.maintainers;

    // Ensuring authorized sender
    require!(
        maintainers.sub_admins.contains(&caller),
        CustomError::Unauthorized
    );

    let escrow = &mut ctx.accounts.escrow_key;
    escrow.key = address;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct SetEscrow<'info> {
    #[account(
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        mut,
        seeds = [ESCROW_TAG],
        bump,
    )]
    pub escrow_key: Box<Account<'info, EscrowKey>>,

    #[account(mut)]
    pub authority: Signer<'info>,
}
