use borsh::{BorshDeserialize};
use solana_program::{program_error::ProgramError};

pub enum WishInstruction {
  AddWish {
    name: String,
    wish: String
  }
}

#[derive(BorshDeserialize)]
struct WishPayload {
  name: String,
  wish: String
}

impl WishInstruction {
  pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        let payload = WishPayload::try_from_slice(rest).unwrap();
        Ok(match variant {
            // 0 => Self::AddWish { title: payload.title, rating: payload.rating, description: payload.description },
            0 => Self::AddWish { name: payload.name, wish: payload.wish},
            _ => return Err(ProgramError::InvalidInstructionData)
        })
    }
}

//9gUaPyV7fuPGGpqtz5gxMkrhbsScsm1gZ8cvp7ipGymA