use super::*;

/// Function to initialize the contract
pub fn initialize(ctx: Context<Initialize>, escrow_key: Pubkey) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &mut ctx.accounts.maintainers;
    maintainers.save(caller);

    let escrow = &mut ctx.accounts.escrow_key;
    escrow.key = escrow_key;

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [MAINTAINERS_TAG],
        bump,
        payer = authority,
        space = std::mem::size_of::<Maintainers>() + 32
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        init,
        seeds = [ESCROW_TAG],
        bump,
        payer = authority,
        space = std::mem::size_of::<EscrowKey>() + 32
    )]
    pub escrow_key: Box<Account<'info, EscrowKey>>,

    /// CHECK: User Data
    #[account(
        init,
        seeds = [USER_DATA_TAG],
        bump,
        payer = authority,
        space = std::mem::size_of::<UserData>() + 40,
    )]
    pub user_data: Box<Account<'info, UserData>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
