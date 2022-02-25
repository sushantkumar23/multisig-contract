use anchor_lang::prelude::*;

declare_id!("7w1dEaqHLFVY9fp1zMg5CJYEPXGGS3QJfcZfQ8A71hCr");

#[program]
pub mod multisig_contract {
    use super::*;

    // Initializes a new multisig account with a set of owners and a threshold
    pub fn create_multisig(
        ctx: Context<CreateMultisig>,
        owners: Vec<Pubkey>,
        threshold: u64,
        nonce: u8,
    ) -> Result<()> {
        assert_unique_owners(&owners)?;
        require!(
            threshold > 0 && threshold <= owners.len() as u64,
            InvalidThreshold
        );
        require!(!owners.is_empty(), NoOwners);

        let multisig_account = &mut ctx.accounts.multisig_account;
        multisig_account.owners = owners;
        multisig_account.threshold = threshold;
        multisig_account.nonce = nonce;
        multisig_account.owner_set_seqno = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMultisig<'info> {
    #[account(zero, signer)]
    multisig_account: Box<Account<'info, MultisigAccount>>,
}

#[account]
pub struct MultisigAccount {
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
    pub nonce: u8,
    pub owner_set_seqno: u32,
}

fn assert_unique_owners(owners: &[Pubkey]) -> Result<()> {
    for (i, owner) in owners.iter().enumerate() {
        require!(
            !owners.iter().skip(i + 1).any(|item| item == owner),
            UniqueOwners
        )
    }
    Ok(())
}

#[error]
pub enum ErrorCode {
    #[msg("There should at least be one owner")]
    NoOwners,
    #[msg("Threshold must be less than or equal to the number of owners")]
    InvalidThreshold,
    #[msg("Owners must be unique")]
    UniqueOwners,
}
