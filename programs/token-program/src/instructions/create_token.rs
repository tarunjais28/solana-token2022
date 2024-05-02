use super::*;

/// Function to create token
pub fn create_token(ctx: Context<CreateToken>, params: CreateTokenParams) -> Result<()> {
    let sub_admins = &ctx.accounts.maintainers.sub_admins;
    let caller = ctx.accounts.payer.to_account_info().key();

    // Ensuring authorized sender
    require!(sub_admins.contains(&caller), CustomError::Unauthorized);

    let config = &mut ctx.accounts.config;
    config.royalty = params.royalty;
    config.tokens_per_sol = params.tokens_per_sol;

    let space =
        ExtensionType::try_calculate_account_len::<MintState>(&[ExtensionType::PermanentDelegate])
            .expect("Error while calculating account length!");
    let rent = Rent::get()?.minimum_balance(space);

    let cpi_accounts = anchor_lang::system_program::CreateAccount {
        from: ctx.accounts.payer.to_account_info(),
        to: ctx.accounts.mint_account.to_account_info(),
    };

    let seeds = [MINT_TAG, params.name.as_bytes(), &[ctx.bumps.mint_account]];
    let signer_seeds = [&seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.system_program.to_account_info(),
        cpi_accounts,
        &signer_seeds,
    );

    anchor_lang::system_program::create_account(
        cpi_ctx,
        rent,
        space as u64,
        ctx.accounts.token_program.key,
    )?;

    let ix = spl_token_2022::instruction::initialize_permanent_delegate(
        ctx.accounts.token_program.key,
        ctx.accounts.mint_account.key,
        ctx.accounts.mint_account.key,
    )?;

    invoke(
        &ix,
        &[
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.mint_account.to_account_info(),
        ],
    )?;

    let accounts = anchor_spl::token_interface::InitializeMint2 {
        mint: ctx.accounts.mint_account.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    anchor_spl::token_interface::initialize_mint2(
        cpi_ctx,
        params.decimals,
        ctx.accounts.mint_account.key,
        Some(ctx.accounts.mint_account.key),
    )?;

    // Emit create token event
    emit!(CreateTokenEvent { name: params.name });

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: CreateTokenParams)]
pub struct CreateToken<'info> {
    #[account(
        mut,
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Account<'info, Maintainers>,

    /// CHECK: mint initialisation
    #[account(
        mut,
        seeds = [MINT_TAG, params.name.as_bytes()],
        bump,
    )]
    pub mint_account: UncheckedAccount<'info>,

    #[account(
        init,
        seeds = [CONFIG_TAG, params.name.as_bytes()],
        bump,
        payer = payer,
        space = std::mem::size_of::<TokenConfiguration>() + 8
    )]
    pub config: Account<'info, TokenConfiguration>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Interface<'info, TokenInterface>,
}
