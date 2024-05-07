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

    ctx.accounts.initialize_metadata_pointer()?;

    // ctx.accounts.initialize_token_metadata(params.clone())?;

    ctx.accounts.initialize_permanent_delegate()?;

    ctx.accounts.initialize_mint(params.decimals)?;

    // // transfer minimum rent to mint account
    // update_account_lamports_to_minimum_balance(
    //     ctx.accounts.mint_account.to_account_info(),
    //     ctx.accounts.payer.to_account_info(),
    //     ctx.accounts.system_program.to_account_info(),
    // )?;

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

    /// CHECK: Validate with constraint, also checked by metadata program
    #[account(
        init,
        seeds = [CONFIG_TAG, params.name.as_bytes()],
        bump,
        payer = payer,
        space = std::mem::size_of::<TokenConfiguration>() + 8
    )]
    pub config: Account<'info, TokenConfiguration>,

    /// CHECK: mint initialisation
    #[account(
        mut,
        seeds = [MINT_TAG, params.name.as_bytes()],
        bump,
    )]
    pub mint_account: UncheckedAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreateToken<'info> {
    #[inline(never)]
    fn initialize_metadata_pointer(&self) -> ProgramResult {
        let cpi_accounts =
            anchor_spl::token_2022_extensions::metadata_pointer::MetadataPointerInitialize {
                token_program_id: self.token_program.to_account_info(),
                mint: self.mint_account.to_account_info(),
            };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        anchor_spl::token_2022_extensions::metadata_pointer::metadata_pointer_initialize(
            cpi_ctx,
            Some(self.payer.key()),
            Some(self.mint_account.key()),
        )?;

        Ok(())
    }

    #[inline(never)]
    fn initialize_token_metadata(&self, params: CreateTokenParams) -> ProgramResult {
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

    #[inline(never)]
    fn initialize_permanent_delegate(&self) -> ProgramResult {
        let cpi_accounts =
            anchor_spl::token_2022_extensions::permanent_delegate::PermanentDelegateInitialize {
                token_program_id: self.token_program.to_account_info(),
                mint: self.mint_account.to_account_info(),
            };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);
        anchor_spl::token_2022_extensions::permanent_delegate::permanent_delegate_initialize(
            cpi_ctx,
            &self.mint_account.key,
        )?;

        Ok(())
    }

    #[inline(never)]
    fn initialize_mint(&self, decimals: u8) -> ProgramResult {
        let accounts = anchor_spl::token_interface::InitializeMint2 {
            mint: self.mint_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), accounts);
        anchor_spl::token_interface::initialize_mint2(
            cpi_ctx,
            decimals,
            self.mint_account.key,
            Some(self.mint_account.key),
        )?;

        Ok(())
    }
}
