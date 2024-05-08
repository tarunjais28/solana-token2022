use super::*;

/// Function to transfer the tokens
///
/// This function can throw following errors:
///   - Amount Can't Be Zero (when user passes 0 amount for mint).
pub fn buy_token_with_sol(ctx: Context<BuyWithSol>, params: BuyWithSolParams) -> Result<()> {
    let seeds = &[MINT_TAG, params.token.as_bytes(), &[ctx.bumps.mint_account]];
    let signer = [&seeds[..]];

    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Transfer sols
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.admin_account.to_account_info(),
    };
    anchor_lang::system_program::transfer(
        CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &signer),
        params.sol_amount,
    )?;

    // Create the Transfer struct for our context
    let mut cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.vault_account.to_account_info(),
        authority: ctx.accounts.mint_account.to_account_info(),
        from: ctx.accounts.escrow_account.to_account_info(),
    };

    let tokens_per_sol = ctx.accounts.config.tokens_per_sol;
    let user = ctx.accounts.user.key();
    let royalty = ctx.accounts.config.royalty;
    let token_amount = params.sol_amount * tokens_per_sol;
    let whitelist = &mut ctx.accounts.whitelist;

    let transferrable_amount = if whitelist.users.contains(&user) {
        token_amount
    } else {
        let royalty_amount = (royalty as u64) * token_amount / 100;

        // Transfer tokens to escrow account
        token_2022::transfer_checked(
            CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &signer),
            royalty_amount,
            ctx.accounts.mint_account.decimals,
        )?;

        token_amount - royalty_amount
    };

    cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.user_ata.to_account_info(),
        authority: ctx.accounts.mint_account.to_account_info(),
        from: ctx.accounts.escrow_account.to_account_info(),
    };

    // Transfer tokens to escrow account
    token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        transferrable_amount,
        ctx.accounts.mint_account.decimals,
    )?;

    // Emit buy with sol event
    emit!(BuyWithSolEvent {
        token: params.token,
        sol_amount: params.sol_amount,
        token_amount
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: BuyWithSolParams)]
pub struct BuyWithSol<'info> {
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
        seeds = [WHITELIST_TAG],
        bump,
    )]
    pub whitelist: Box<Account<'info, WhitelistedUser>>,

    #[account(
        mut,
        seeds = [ESCROW_TAG, params.token.as_bytes()],
        bump,
    )]
    pub escrow_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        seeds = [VAULT_TAG, params.token.as_bytes()],
        bump,
    )]
    pub vault_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: Escrow Account where the sols will be transferred
    #[account(
        mut,
        constraint = escrow_key.key == admin_account.key() @CustomError::UnknownReceiver
    )]
    pub admin_account: AccountInfo<'info>,

    #[account(
        seeds = [ESCROW_TAG],
        bump,
    )]
    pub escrow_key: Box<Account<'info, EscrowKey>>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
