use super::*;

#[account]
pub struct TokenConfiguration {
    /// Royalty
    pub royalty: u8,
}
