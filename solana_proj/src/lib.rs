use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    account_info::{next_account_info, AccountInfo},
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
    program::{invoke_signed},
    borsh::try_from_slice_unchecked,
};
use std::convert::TryInto;
pub mod instruction;
pub mod state;
use instruction::WishInstruction;
use state::WishAccountState;
use borsh::BorshSerialize;

entrypoint!(process_instruction);

pub fn process_instruction(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  instruction_data: &[u8]
) -> ProgramResult {
  let instruction = WishInstruction::unpack(instruction_data)?;
  match instruction {
    WishInstruction::AddWish { name, wish, } => {
      add_wish(program_id, accounts, name, wish)
    }
  }
}

pub fn add_wish(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  name: String,
  wish: String
) -> ProgramResult {
  msg!("Adding wish...");
  msg!("Name: {}", name);
  msg!("Wish: {}", wish);

// Get Account iterator
  let account_info_iter = &mut accounts.iter();
  
// Get accounts
  let initializer = next_account_info(account_info_iter)?;
  let pda_account = next_account_info(account_info_iter)?;
  let system_program = next_account_info(account_info_iter)?;

// Derive PDA and check that it matches client
  let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), name.as_bytes().as_ref(),], program_id);

// Calculate account size required
  let account_len: usize = 1 + 1 + (4 + name.len()) + (4 + wish.len());

// Calculate rent required
  let rent = Rent::get()?;
  let rent_lamports = rent.minimum_balance(account_len);

// Create the account
  invoke_signed(
    &system_instruction::create_account(
      initializer.key,
      pda_account.key,
      rent_lamports,
      account_len.try_into().unwrap(),
      program_id,
    ),
    &[initializer.clone(), pda_account.clone(), system_program.clone()],
    &[&[initializer.key.as_ref(), name.as_bytes().as_ref(), &[bump_seed]]],
  )?;

  msg!("PDA created: {}", pda);
  
  msg!("unpacking state account");
  let mut account_data = try_from_slice_unchecked::<WishAccountState>(&pda_account.data.borrow()).unwrap();
  msg!("borrowed account data");

  account_data.name = name;
  account_data.wish = wish;
  account_data.is_initialized = true;
  
  msg!("serializing account");
  account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
  msg!("state account serialized");

  Ok(())
}