use super::*;

/// Function to transfer the tokens
///
/// This function can throw following errors:
///   - Amount Can't Be Zero (when user passes 0 amount for mint).
pub fn transfer(ctx: Context<TransferTokens>, params: TransferParams) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let royalty = ctx.accounts.config.royalty;

    // Check user balance first
    require!(params.amount > 0, CustomError::AmountCantBeZero);

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let whitelist = &mut ctx.accounts.whitelist;

    let seeds = &[MINT_TAG, params.token.as_bytes(), &[ctx.bumps.mint_account]];
    let signer = [&seeds[..]];

    // Create the Transfer struct for our context
    let mut cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.escrow_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        from: ctx.accounts.from_account.to_account_info(),
    };

    let transferrable_amount = if whitelist.users.contains(&caller) {
        params.amount
    } else {
        let royalty_amount = (royalty as u64) * params.amount / 100;

        // Transfer tokens to escrow account
        token_2022::transfer_checked(
            CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &signer),
            royalty_amount,
            ctx.accounts.mint_account.decimals,
        )?;

        params.amount - royalty_amount
    };

    // Create the Transfer struct for our context
    cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.to_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        from: ctx.accounts.from_account.to_account_info(),
    };

    token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        transferrable_amount,
        ctx.accounts.mint_account.decimals,
    )?;

    // Emit transfer event
    emit!(TransferEvent {
        token: params.token,
        amount: params.amount,
        from: caller,
        to: ctx.accounts.to_account.to_account_info().key()
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: TransferParams)]
pub struct TransferTokens<'info> {
    #[account(
        seeds = [WHITELIST_TAG],
        bump,
    )]
    pub whitelist: Box<Account<'info, WhitelistedUser>>,

    /// CHECK: This is the token that we want to mint
    #[account(
        mut,
        seeds = [MINT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        seeds = [CONFIG_TAG, params.token.as_bytes()],
        bump,
    )]
    pub config: Box<Account<'info, TokenConfiguration>>,

    #[account(
        mut,
        seeds = [ESCROW_TAG, params.token.as_bytes()],
        bump,
    )]
    pub escrow_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub from_account: AccountInfo<'info>,

    /// CHECK: This is the token account that we want to transfer tokens to
    #[account(mut)]
    pub to_account: AccountInfo<'info>,

    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
