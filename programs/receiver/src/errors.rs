use super::*;

#[error_code]
pub enum CustomError {
    #[msg("Error: Unauthorized User!")]
    Unauthorized,

    #[msg("Error: Unknown Receiver!")]
    UnknownReceiver,
}
