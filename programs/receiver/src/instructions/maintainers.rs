use super::*;

/// Function to update admin
pub fn update_admin(ctx: Context<UpdateAdmin>, address: Pubkey) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &mut ctx.accounts.maintainers;

    // Ensuring authorized sender
    require!(maintainers.admin.eq(&caller), CustomError::Unauthorized);
    maintainers.add_admin(address);

    Ok(())
}

/// Function to add sub_admins
pub fn add_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &mut ctx.accounts.maintainers;

    // Ensuring authorized sender
    require!(maintainers.admin.eq(&caller), CustomError::Unauthorized);

    maintainers.add_sub_admins(addresses.clone());

    Ok(())
}

/// Function to remove sub_admins
pub fn remove_sub_admins(ctx: Context<UpdateSubAdmins>, addresses: Vec<Pubkey>) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &mut ctx.accounts.maintainers;

    // Ensuring authorized sender
    require!(maintainers.admin.eq(&caller), CustomError::Unauthorized);
    maintainers.remove_sub_admins(addresses.clone());

    Ok(())
}

#[derive(Accounts)]
#[instruction(addresses: Vec<Pubkey>)]
pub struct UpdateSubAdmins<'info> {
    #[account(
        mut,
        seeds = [MAINTAINERS_TAG],
        bump,
        realloc = std::mem::size_of::<Maintainers>() + ((addresses.len() + maintainers.sub_admins.len()) * 32),
        realloc::payer = authority,
        realloc::zero = false,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        seeds = [MAINTAINERS_TAG],
        bump
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
