use super::*;

#[account]
#[derive(Default)]
pub struct UserData {
    pub users: Vec<User>,
}

#[account]
#[derive(Default, PartialEq)]
pub struct User {
    pub user: Pubkey,
    pub amount: u64,
}

impl UserData {
    pub fn add_user(&mut self, user: Pubkey, amount: u64) {
        self.users.push(User { user, amount });
    }

    pub fn remove_users(&mut self, users: Vec<User>) {
        self.users.retain(|user| !users.contains(user));
    }
}

#[account]
pub struct EscrowKey {
    pub key: Pubkey,
}
