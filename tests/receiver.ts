import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "bn.js";
import { assert } from "chai";
import { Receiver } from "../target/types/receiver";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { it } from "node:test";

// Create test keypairs
const admin = anchor.web3.Keypair.generate();
const payer = anchor.web3.Keypair.generate();
const user1 = anchor.web3.Keypair.generate();
const user2 = anchor.web3.Keypair.generate();
const vault = anchor.web3.Keypair.generate();
const mintAuthority = anchor.web3.Keypair.generate();

// Constant seeds
const MAINTAINERS = Buffer.from("maintainers");
const USER_DATA = Buffer.from("user_data");
const ESCROW = Buffer.from("escrow");

describe("receiver", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Receiver as Program<Receiver>;

  // Declare PDAs
  let pdaMaintainers,
    pdaUsers,
    pdaEscrow = null;

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const setEscrow = async (address) => {
    let setEscrow = await program.methods
      .updateEscrow(address)
      .accounts({
        maintainers: pdaMaintainers,
        escrowKey: pdaEscrow,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(setEscrow);
  };

  const receive = async (amount, user, escrowAccount) => {
    let receive = await program.methods
      .receive(amount)
      .accounts({
        userData: pdaUsers,
        user: user.publicKey,
        escrowKey: pdaEscrow,
        escrowAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    await confirmTransaction(receive);
  };

  it("Initialize test accounts", async () => {
    // Airdrop sol to the test users
    let adminSol = await provider.connection.requestAirdrop(
      admin.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(adminSol);

    let payerSol = await provider.connection.requestAirdrop(
      payer.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(payerSol);

    let user1Sol = await provider.connection.requestAirdrop(
      user1.publicKey,
      1000 * anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(user1Sol);

    let user2Sol = await provider.connection.requestAirdrop(
      user2.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(user2Sol);

    let mintAuthoritySol = await provider.connection.requestAirdrop(
      mintAuthority.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(mintAuthoritySol);

    let vaultSol = await provider.connection.requestAirdrop(
      vault.publicKey,
      anchor.web3.LAMPORTS_PER_SOL,
    );
    await confirmTransaction(vaultSol);
  });

  it("Initialize global account", async () => {
    [pdaMaintainers] = anchor.web3.PublicKey.findProgramAddressSync(
      [MAINTAINERS],
      program.programId,
    );

    [pdaUsers] = anchor.web3.PublicKey.findProgramAddressSync(
      [USER_DATA],
      program.programId,
    );

    [pdaEscrow] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW],
      program.programId,
    );

    // Test initialize instruction
    let initialize = await program.methods
      .init(vault.publicKey)
      .accounts({
        maintainers: pdaMaintainers,
        escrowKey: pdaEscrow,
        userData: pdaUsers,
        authority: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(initialize);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.equal(maintainers.admin.toString(), admin.publicKey.toString());
    assert.isTrue(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(admin.publicKey),
      ),
    );

    let escrow = await program.account.escrowKey.fetch(pdaEscrow);
    assert.equal(escrow.key.toBase58(), vault.publicKey.toBase58());

    let userData = await program.account.userData.fetch(pdaUsers);
    assert.equal(userData.users.length, 0);
  });

  it("Test Receive", async () => {
    let user1BalanceBefore = await provider.connection.getBalance(
      user1.publicKey,
    );
    let escrowBalanceBefore = await provider.connection.getBalance(
      vault.publicKey,
    );

    let userInfo = {
      user: user1.publicKey,
      amount: new BN(0.5 * LAMPORTS_PER_SOL),
    };

    await receive(userInfo.amount, user1, vault.publicKey);

    let user1BalanceAfter = await provider.connection.getBalance(
      user1.publicKey,
    );
    let escrowBalanceAfter = await provider.connection.getBalance(
      vault.publicKey,
    );

    assert.equal(
      Number(escrowBalanceAfter),
      Number(escrowBalanceBefore) + Number(userInfo.amount),
    );

    assert.equal(
      Number(user1BalanceAfter),
      Number(user1BalanceBefore) - Number(userInfo.amount),
    );

    let userData = await program.account.userData.fetch(pdaUsers);
    assert.equal(userData.users.length, 1);
    assert.isTrue(
      JSON.stringify(userData.users).includes(JSON.stringify(userInfo)),
    );
  });

  it("Test Receive for other than escrow account", async () => {
    let userInfo = {
      user: user1.publicKey,
      amount: new BN(0.5 * LAMPORTS_PER_SOL),
    };

    let userDataBefore = (await program.account.userData.fetch(pdaUsers)).users
      .length;

    try {
      await receive(userInfo.amount, user1, user2.publicKey);
    } catch (err) {
      assert.equal(err.error.errorCode.code, "UnknownReceiver");
    }

    let userDataAfter = (await program.account.userData.fetch(pdaUsers)).users
      .length;
    assert.equal(userDataAfter, userDataBefore);
  });

  it("Test Update Escrow Account", async () => {
    let escrow = await program.account.escrowKey.fetch(pdaEscrow);
    assert.equal(escrow.key.toBase58(), vault.publicKey.toBase58());

    await setEscrow(user2.publicKey);

    escrow = await program.account.escrowKey.fetch(pdaEscrow);
    assert.equal(escrow.key.toBase58(), user2.publicKey.toBase58());
  });

  it("Test Receive After escrow update", async () => {
    let payerBalanceBefore = await provider.connection.getBalance(
      payer.publicKey,
    );
    let escrowBalanceBefore = await provider.connection.getBalance(
      user2.publicKey,
    );

    let userInfo = {
      user: payer.publicKey,
      amount: new BN(0.5 * LAMPORTS_PER_SOL),
    };

    // Try with old escrow account
    try {
      await receive(userInfo.amount, payer, vault.publicKey);
    } catch (err) {
      assert.equal(err.error.errorCode.code, "UnknownReceiver");
    }

    // Calling receive with new wallet
    await receive(userInfo.amount, payer, user2.publicKey);

    let payerBalanceAfter = await provider.connection.getBalance(
      payer.publicKey,
    );
    let escrowBalanceAfter = await provider.connection.getBalance(
      user2.publicKey,
    );

    assert.equal(
      Number(escrowBalanceAfter),
      Number(escrowBalanceBefore) + Number(userInfo.amount),
    );

    assert.isTrue(Number(payerBalanceAfter) < Number(payerBalanceBefore));

    let userData = await program.account.userData.fetch(pdaUsers);
    assert.equal(userData.users.length, 2);
    assert.isTrue(
      JSON.stringify(userData.users).includes(JSON.stringify(userInfo)),
    );
  });

  it("Test Update Admin", async () => {
    let oldAdmin = (await program.account.maintainers.fetch(pdaMaintainers))
      .admin;
    assert.equal(oldAdmin.toString(), admin.publicKey.toString());

    let updateAdmin = await program.methods
      .manageAdmin(user1.publicKey)
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(updateAdmin);

    let newAdmin = (await program.account.maintainers.fetch(pdaMaintainers))
      .admin;
    assert.equal(newAdmin.toString(), user1.publicKey.toString());

    updateAdmin = await program.methods
      .manageAdmin(admin.publicKey)
      .accounts({
        maintainers: pdaMaintainers,
        authority: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(updateAdmin);
    newAdmin = (await program.account.maintainers.fetch(pdaMaintainers)).admin;
    assert.equal(oldAdmin.toString(), admin.publicKey.toString());
  });

  it("Test Add Sub Admins", async () => {
    let addSubAdmins = await program.methods
      .addSubAdminAccounts([user1.publicKey])
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(addSubAdmins);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.isTrue(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(user1.publicKey),
      ),
    );
  });

  it("Test Remove Sub Admins", async () => {
    let removeSubAdmins = await program.methods
      .removeSubAdminAccounts([user1.publicKey])
      .accounts({
        maintainers: pdaMaintainers,
        authority: admin.publicKey,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(removeSubAdmins);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.isFalse(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(user1.publicKey),
      ),
    );
  });
});
