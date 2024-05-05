use super::*;

/// Function to init resource accounts
///
/// This function can throw following errors:
///   - Amount Can't Be Zero (when user passes 0 amount for mint).
pub fn init_resource_accounts(ctx: Context<InitResources>, token: String) -> Result<()> {

    // Emit init resource event
    emit!(InitResourcesEvent {
        token: token,
        escrow_account: ctx.accounts.escrow_account.key(),
        vault_account: ctx.accounts.vault_account.key()
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(token: String)]
pub struct InitResources<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(
        seeds = [MINT_TAG, token.as_bytes()],
        bump,
    )]
    pub mint_account: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        token::mint = mint_account,
        token::authority = escrow_account,
        seeds = [ESCROW_TAG, token.as_bytes()],
        bump,
        payer = payer,
    )]
    pub escrow_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        token::mint = mint_account,
        token::authority = vault_account,
        seeds = [VAULT_TAG, token.as_bytes()],
        bump,
        payer = payer,
    )]
    pub vault_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
