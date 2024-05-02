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
        to: ctx.accounts.vault_account.to_account_info(),
    };
    anchor_lang::system_program::transfer(
        CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, &signer),
        params.sol_amount,
    )?;

    // Transfer Tokens
    let cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.user_ata.to_account_info(),
        authority: ctx.accounts.mint_account.to_account_info(),
        from: ctx.accounts.vault_ata.to_account_info(),
    };

    let tokens_per_sol = ctx.accounts.config.tokens_per_sol;
    let token_amount = params.sol_amount * tokens_per_sol;

    // Transfer tokens to escrow account
    token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        token_amount,
        ctx.accounts.mint_account.decimals,
    )?;
    
    // Emit buy with sol event
    emit!(BuyWithSolEvent {
        token: params.token,
        sol_amount: params.sol_amount,
        token_amount: token_amount
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
    pub mint_account: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [CONFIG_TAG, params.token.as_bytes()],
        bump,
    )]
    pub config: Account<'info, TokenConfiguration>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub user_ata: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: This is the token account that we want to transfer tokens to
    #[account(mut)]
    pub vault_account: AccountInfo<'info>,

    /// CHECK: This is the token account that we want to transfer tokens to
    #[account(mut)]
    pub vault_ata: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
