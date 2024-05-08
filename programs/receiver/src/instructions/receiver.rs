use super::*;

/// Function to receive sols and store
///
/// This function can throw following errors:
///   - Amount Can't Be Zero (when user passes 0 amount for mint).
pub fn receive_and_store(ctx: Context<Receiver>, amount: u64) -> Result<()> {
    let seeds = &[USER_DATA_TAG, &[ctx.bumps.user_data]];
    let signer = [&seeds[..]];

    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Transfer sols
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.escrow_account.to_account_info(),
    };
    anchor_lang::system_program::transfer(
        CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &signer),
        amount,
    )?;

    let user_data = &mut ctx.accounts.user_data;
    user_data.add_user(ctx.accounts.user_ata.key(), amount);

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Receiver<'info> {
    /// CHECK: User Data
    #[account(
        mut,
        seeds = [USER_DATA_TAG],
        bump,
        realloc = std::mem::size_of::<UserData>() + ((user_data.users.len() + 1) * 40),
        realloc::payer = user,
        realloc::zero = false,
    )]
    pub user_data: Box<Account<'info, UserData>>,

    /// CHECK: Escrow Account where the sols will be transferred
    #[account(
        mut,
        constraint = escrow_key.key == escrow_account.key() @CustomError::UnknownReceiver
    )]
    pub escrow_account: AccountInfo<'info>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        seeds = [ESCROW_TAG],
        bump,
    )]
    pub escrow_key: Box<Account<'info, EscrowKey>>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
