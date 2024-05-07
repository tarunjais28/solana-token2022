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

    // let space =
    //     ExtensionType::try_calculate_account_len::<MintState>(&[ExtensionType::PermanentDelegate])
    //         .expect("Error while calculating account length!");
    // let rent = Rent::get()?.minimum_balance(space);

    // let cpi_accounts = anchor_lang::system_program::CreateAccount {
    //     from: ctx.accounts.payer.to_account_info(),
    //     to: ctx.accounts.mint_account.to_account_info(),
    // };

    // let seeds = [MINT_TAG, params.name.as_bytes(), &[ctx.bumps.mint_account]];
    // let signer_seeds = [&seeds[..]];

    // let cpi_ctx = CpiContext::new_with_signer(
    //     ctx.accounts.system_program.to_account_info(),
    //     cpi_accounts,
    //     &signer_seeds,
    // );

    // anchor_lang::system_program::create_account(
    //     cpi_ctx,
    //     rent,
    //     space as u64,
    //     ctx.accounts.token_program.key,
    // )?;

    // let ix = spl_token_2022::instruction::initialize_permanent_delegate(
    //     ctx.accounts.token_program.key,
    //     ctx.accounts.mint_account.key,
    //     ctx.accounts.mint_account.key,
    // )?;

    // invoke(
    //     &ix,
    //     &[
    //         ctx.accounts.token_program.to_account_info(),
    //         ctx.accounts.mint_account.to_account_info(),
    //     ],
    // )?;

    // let accounts = anchor_spl::token_2022_extensions::metadata_pointer::MetadataPointerInitialize {
    //     token_program_id: ctx.accounts.token_program.to_account_info(),
    //     mint: ctx.accounts.mint_account.to_account_info(),
    // };
    // let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    // anchor_spl::token_2022_extensions::metadata_pointer::metadata_pointer_initialize(
    //     cpi_ctx,
    //     Some(ctx.accounts.payer.key()),
    //     Some(ctx.accounts.mint_account.key()),
    // )?;

    // let accounts = anchor_spl::token_interface::InitializeMint2 {
    //     mint: ctx.accounts.mint_account.to_account_info(),
    // };
    // let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), accounts);
    // anchor_spl::token_interface::initialize_mint2(
    //     cpi_ctx,
    //     params.decimals,
    //     ctx.accounts.payer.key,
    //     Some(ctx.accounts.mint_account.key),
    // )?;

    ctx.accounts.initialize_token_metadata(
        params.clone(),
    )?;
    ctx.accounts.mint_account.reload()?;

    // transfer minimum rent to mint account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint_account.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
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
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        init,
        seeds = [MINT_TAG, params.name.as_bytes()],
        bump,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = params.decimals,
        mint::authority = payer,
        mint::freeze_authority = payer,
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = mint_account,
        extensions::group_member_pointer::authority = payer,
        extensions::group_member_pointer::member_address = mint_account,
        // extensions::transfer_hook::authority = mint_account,
        // extensions::transfer_hook::program_id = crate::ID,
        extensions::close_authority::authority = payer,
        extensions::permanent_delegate::delegate = mint_account,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        seeds = [CONFIG_TAG, params.name.as_bytes()],
        bump,
        payer = payer,
        space = std::mem::size_of::<TokenConfiguration>()
    )]
    pub config: Box<Account<'info, TokenConfiguration>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,
}

impl<'info> CreateToken<'info> {
    fn initialize_token_metadata(
        &self,
        params: CreateTokenParams,
    ) -> ProgramResult {
        let cpi_accounts = TokenMetadataInitialize {
            token_program_id: self.token_program.to_account_info(),
            mint: self.mint_account.to_account_info(),
            metadata: self.mint_account.to_account_info(), // metadata account is the mint, since data is stored in mint
            mint_authority: self.payer.to_account_info(),
            update_authority: self.payer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        token_metadata_initialize(cpi_ctx, params.name, params.symbol, params.uri)?;
        Ok(())
    }
}
