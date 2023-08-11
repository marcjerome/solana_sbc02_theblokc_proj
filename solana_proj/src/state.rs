use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct WishAccountState {
    pub is_initialized: bool,
    pub name: String,
    pub wish: String
}