import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { BN } from "bn.js";
import { assert } from "chai";
import { TokenProgram } from "../target/types/token_program";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { it } from "node:test";

// Create test keypairs
const admin = anchor.web3.Keypair.generate();
const payer = anchor.web3.Keypair.generate();
const user1 = anchor.web3.Keypair.generate();
const user2 = anchor.web3.Keypair.generate();
const vault = anchor.web3.Keypair.generate();
const mintAuthority = anchor.web3.Keypair.generate();

// Create constant amount fields
const MINT_AMOUNT = new BN(1000 * LAMPORTS_PER_SOL);
const BURN_AMOUNT = new BN(600 * LAMPORTS_PER_SOL);
const BURN_FROM_AMOUNT = new BN(200 * LAMPORTS_PER_SOL);
const TOKEN_AMOUNT = new BN(150);

// Constant seeds
const TEST_TOKEN = "Test";
const TEST_1_TOKEN = "Test-1";
const MINT = Buffer.from("mint");
const MAINTAINERS = Buffer.from("maintainers");
const CONFIG = Buffer.from("config");
const WHITELIST = Buffer.from("whitelist");
const VAULT = Buffer.from("vault");
const TEST = Buffer.from(TEST_TOKEN);
const TEST_1 = Buffer.from(TEST_1_TOKEN);
const ESCROW = Buffer.from("escrow");

describe("token_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TokenProgram as Program<TokenProgram>;

  // Declare PDAs
  let pdaMaintainers,
    pdaConfig,
    pdaWhitelist,
    pdaEscrow,
    pdaVault,
    mintAccount = null;

  const confirmTransaction = async (tx) => {
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: tx,
    });
  };

  const createToken = async (createTokenParams) => {
    // Test create_token instruction
    let createToken = await program.methods
      .create(createTokenParams)
      .accounts({
        maintainers: pdaMaintainers,
        config: pdaConfig,
        mintAccount,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(createToken);
  };

  const setConfig = async (token, royalty, tokensPerSol) => {
    let set = await program.methods
      .setConfig(token, royalty, tokensPerSol)
      .accounts({
        maintainers: pdaMaintainers,
        config: pdaConfig,
        caller: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(set);
  };

  const initResources = async (token) => {
    let init = await program.methods
      .initResources(token)
      .accounts({
        mintAccount,
        escrowAccount: pdaEscrow,
        vaultAccount: pdaVault,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        payer: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await confirmTransaction(init);
  };

  const mint = async (tokenParams, user1ATA, signer) => {
    // Test mint_token instruction
    let mintToken = await program.methods
      .mintToken(tokenParams)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        toAccount: user1ATA,
        authority: signer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(mintToken);
  };

  const burn = async (tokenParams, user1ATA) => {
    // Test burn_token instruction
    let burnToken = await program.methods
      .burnToken(tokenParams)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        from: user1ATA,
        authority: user1.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(burnToken);
  };

  const burnFrom = async (tokenParams, user1ATA, signer) => {
    // Burn from user1 account by admin
    let burnToken = await program.methods
      .burnTokenFrom(tokenParams)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        from: user1ATA,
        tokenAccount: user1ATA,
        authority: signer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(burnToken);
  };

  const transfer = async (transferParams, fromATA, toATA) => {
    // Test transfer token instruction
    let transferToken = await program.methods
      .transferTokens(transferParams)
      .accounts({
        config: pdaConfig,
        whitelist: pdaWhitelist,
        mintAccount,
        escrowAccount: pdaEscrow,
        fromAccount: fromATA,
        toAccount: toATA,
        authority: user1.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    await confirmTransaction(transferToken);
  };

  const forceTransfer = async (forceTransferParams, fromATA, toATA, signer) => {
    // Test force transfer token instruction
    let forceTransferToken = await program.methods
      .forceTransferTokens(forceTransferParams)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount,
        tokenAccount: fromATA,
        fromAccount: fromATA,
        toAccount: toATA,
        authority: signer.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([signer])
      .rpc();

    await confirmTransaction(forceTransferToken);
  };

  const manageWhitelists = async (updateType, users) => {
    let manageWhitelist = await program.methods
      .manangeWhitelistUsers(updateType, users)
      .accounts({
        maintainers: pdaMaintainers,
        whitelist: pdaWhitelist,
        authority: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(manageWhitelist);
  };

  const buyWithSol = async (buyWithSolParams, user, userAta) => {
    let buyWithSol = await program.methods
      .buyWithSol(buyWithSolParams)
      .accounts({
        mintAccount,
        config: pdaConfig,
        user: user.publicKey,
        whitelist: pdaWhitelist,
        escrowAccount: pdaEscrow,
        userAta,
        vaultAccount: pdaVault,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    await confirmTransaction(buyWithSol);
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

    [pdaWhitelist] = anchor.web3.PublicKey.findProgramAddressSync(
      [WHITELIST],
      program.programId,
    );

    // Test initialize instruction
    let init = await program.methods
      .init([vault.publicKey])
      .accounts({
        maintainers: pdaMaintainers,
        whitelist: pdaWhitelist,
        authority: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(init);

    let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
    assert.equal(maintainers.admin.toString(), admin.publicKey.toString());
    assert.isTrue(
      JSON.stringify(maintainers.subAdmins).includes(
        JSON.stringify(admin.publicKey),
      ),
    );

    let whitelist = await program.account.whitelistedUser.fetch(pdaWhitelist);
    assert.isTrue(
      JSON.stringify(whitelist.users).includes(JSON.stringify(vault.publicKey)),
    );
  });

  it("Test Create Token", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    let createTokenParams = {
      name: TEST_TOKEN,
      symbol: "tes",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      decimals: 9,
    };

    await createToken(createTokenParams);

    // Creating another token
    createTokenParams = {
      name: TEST_1_TOKEN,
      symbol: "tes-1",
      uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
      decimals: 1,
    };

    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST_1],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1],
      program.programId,
    );

    await createToken(createTokenParams);
  });

  it("Test Set Config", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    let royalty = 1;
    let tokensPerSol = TOKEN_AMOUNT;

    await setConfig(TEST_TOKEN, royalty, tokensPerSol);

    // Check the configuration after transaction
    let config = await program.account.tokenConfiguration.fetch(pdaConfig);
    assert.equal(config.royalty, royalty);
    assert.equal(
      Number(config.tokensPerSol),
      Number(tokensPerSol),
    );

    // For Test-1 token
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST_1],
      program.programId,
    );

    await setConfig(TEST_1_TOKEN, royalty, tokensPerSol);

    // Check the configuration after transaction
    config = await program.account.tokenConfiguration.fetch(pdaConfig);
    assert.equal(config.royalty, royalty);
    assert.equal(
      Number(config.tokensPerSol),
      Number(tokensPerSol),
    );
  });

  it("Test Init Resources", async () => {
    [pdaEscrow] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, TEST],
      program.programId,
    );

    [pdaVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [VAULT, TEST],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    await initResources(TEST_TOKEN);
  });

  it("Test Mint Token", async () => {
    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    let tokenParams = {
      name: TEST_TOKEN,
      amount: MINT_AMOUNT,
    };

    // Creating associated token for user1 for Test
    let user1ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      user1.publicKey,
      undefined,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await mint(tokenParams, user1ATA.address, admin);

    // Check balance after mint
    let supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(Number(supply.value.amount), Number(MINT_AMOUNT));

    let user1Account = await getAccount(
      provider.connection,
      user1ATA.address,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), Number(MINT_AMOUNT));

    // Minting Token Test-1
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST_1],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1],
      program.programId,
    );

    tokenParams = {
      name: TEST_1_TOKEN,
      amount: MINT_AMOUNT,
    };

    // Creating associated token for user1 for Test-1
    user1ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      user1.publicKey,
      undefined,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await mint(tokenParams, user1ATA.address, admin);

    // Check balance after mint
    supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(Number(supply.value.amount), Number(MINT_AMOUNT));

    user1Account = await getAccount(
      provider.connection,
      user1ATA.address,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(Number(user1Account.amount), Number(MINT_AMOUNT));

    let balance = await provider.connection.getBalance(user1.publicKey);
    // Here balance is divided by 10^6 to remove decimal values return by getBalance method
    assert.equal(balance, Number(MINT_AMOUNT));
  });

  it("Test Burn Token", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    let tokenParams = {
      name: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: BURN_AMOUNT,
    };

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await burn(tokenParams, user1ATA);

    // Check balance after mint
    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(
      Number(user1Account.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
    let supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(
      Number(supply.value.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );

    // Burning Token Test-1
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST_1],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1],
      program.programId,
    );

    tokenParams = {
      name: TEST_1_TOKEN,
      toAccount: user1.publicKey,
      amount: BURN_AMOUNT,
    };

    // Creating associated token for user1 and Test-1
    user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    await burn(tokenParams, user1ATA);

    // Check balance after mint
    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(
      Number(user1Account.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
    supply = await provider.connection.getTokenSupply(mintAccount);
    assert.equal(
      Number(supply.value.amount),
      Number(MINT_AMOUNT) - Number(BURN_AMOUNT),
    );
  });

  it("Test Burn Token From", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    // Check balance before burn from
    let user1AccountBeforeBurn = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    // Check supply before burn
    let supplyBeforeBurn =
      await provider.connection.getTokenSupply(mintAccount);

    let tokenParams = {
      name: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: BURN_FROM_AMOUNT,
    };

    await burnFrom(tokenParams, user1ATA, admin);

    // Check balance after burn from
    let user1AccountAfterBurn = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(
      Number(user1AccountAfterBurn.amount),
      Number(user1AccountBeforeBurn.amount) - Number(tokenParams.amount),
    );

    // Check supply after burn
    let supplyAfterBurn = await provider.connection.getTokenSupply(mintAccount);

    assert.equal(
      Number(supplyAfterBurn.value.amount),
      Number(supplyBeforeBurn.value.amount) - Number(tokenParams.amount),
    );

    // Burning Token Test-1
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST_1],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST_1],
      program.programId,
    );

    tokenParams = {
      name: TEST_1_TOKEN,
      toAccount: user1.publicKey,
      amount: BURN_FROM_AMOUNT,
    };

    // Creating associated token for user1 and Test-1
    user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    // Check balance before burn from
    user1AccountBeforeBurn = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    // Check supply before burn
    supplyBeforeBurn = await provider.connection.getTokenSupply(mintAccount);

    await burnFrom(tokenParams, user1ATA, admin);

    // Check balance after burn from
    user1AccountAfterBurn = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    assert.equal(
      Number(user1AccountAfterBurn.amount),
      Number(user1AccountBeforeBurn.amount) - Number(tokenParams.amount),
    );

    // Check supply after burn
    supplyAfterBurn = await provider.connection.getTokenSupply(mintAccount);

    assert.equal(
      Number(supplyAfterBurn.value.amount),
      Number(supplyBeforeBurn.value.amount) - Number(tokenParams.amount),
    );
  });

  it("Test Transfer Token", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [MINT, TEST],
      program.programId,
    );

    [pdaEscrow] = anchor.web3.PublicKey.findProgramAddressSync(
      [ESCROW, TEST],
      program.programId,
    );

    let transferAmount = new BN(50);

    let transferParams = {
      token: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: transferAmount,
    };

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceBeforeTransfer = Number(user1Account.amount);

    let user2ATA = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer,
      mintAccount,
      user2.publicKey,
      undefined,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user2Account = await getAccount(
      provider.connection,
      user2ATA.address,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user2BalanceBeforeTransfer = Number(user2Account.amount);

    await transfer(transferParams, user1ATA, user2ATA.address);

    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceAfterTransfer = Number(user1Account.amount);

    user2Account = await getAccount(
      provider.connection,
      user2ATA.address,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user2BalanceAfterTransfer = Number(user2Account.amount);

    // Check balances after transfer
    assert.equal(
      user1BalanceAfterTransfer,
      user1BalanceBeforeTransfer - Number(transferAmount),
    );
    assert.equal(
      user2BalanceAfterTransfer,
      user2BalanceBeforeTransfer + Number(transferAmount),
    );
  });

  it("Test Buy with Sol Token", async () => {
    [pdaVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [VAULT, TEST],
      program.programId,
    );

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceBeforeBuy = Number(user1Account.amount);

    let user1SolBalanceBeforeBuy = await provider.connection.getBalance(
      user1.publicKey,
    );
    let escrowSolBalanceBeforeBuy =
      await provider.connection.getBalance(pdaEscrow);

    // Mint to vault account
    let tokenParams = {
      name: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: MINT_AMOUNT,
    };

    await mint(tokenParams, pdaEscrow, admin);

    let vaultAccount = await getAccount(
      provider.connection,
      pdaVault,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let vaultBalanceBeforeBuy = Number(vaultAccount.amount);

    let escrowAccountBalanceBeforeBuy = (
      await getAccount(
        provider.connection,
        pdaEscrow,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount;

    let buyWithSolParams = {
      token: TEST_TOKEN,
      solAmount: new BN(LAMPORTS_PER_SOL),
    };

    await buyWithSol(buyWithSolParams, user1, user1ATA);

    let user1SolBalanceAfterBuy = await provider.connection.getBalance(
      user1.publicKey,
    );
    let escrowSolBalanceAfterBuy =
      await provider.connection.getBalance(pdaEscrow);

    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceAfterBuy = Number(user1Account.amount);

    vaultAccount = await getAccount(
      provider.connection,
      pdaVault,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let vaultBalanceAfterBuy = Number(vaultAccount.amount);

    // Check balances after buy
    assert.equal(
      user1SolBalanceAfterBuy,
      user1SolBalanceBeforeBuy - Number(buyWithSolParams.solAmount),
    );
    assert.equal(
      escrowSolBalanceAfterBuy,
      escrowSolBalanceBeforeBuy + Number(buyWithSolParams.solAmount),
    );

    let config = await program.account.tokenConfiguration.fetch(pdaConfig);

    let tokenAmount =
      Number(buyWithSolParams.solAmount) * Number(config.tokensPerSol);
    let royaltyAmount = (config.royalty * tokenAmount) / 100;
    let transferrableAmount = tokenAmount - royaltyAmount;

    assert.equal(
      user1BalanceAfterBuy,
      user1BalanceBeforeBuy + transferrableAmount,
    );
    assert.equal(vaultBalanceAfterBuy, vaultBalanceBeforeBuy + royaltyAmount);

    let escrowAccountBalanceAfterBuy = (
      await getAccount(
        provider.connection,
        pdaEscrow,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount;
    assert.equal(
      Number(escrowAccountBalanceAfterBuy),
      Number(escrowAccountBalanceBeforeBuy) - tokenAmount,
    );
  });

  it("Test Claim", async () => {
    let vaultAccountBalance = (
      await getAccount(
        provider.connection,
        pdaVault,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount;
    console.log(vaultAccountBalance);

    let userATA = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let claim = await program.methods
      .claim(TEST_TOKEN)
      .accounts({
        maintainers: pdaMaintainers,
        mintAccount: mintAccount,
        vaultAccount: pdaVault,
        toAccount: userATA,
        authority: admin.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(claim);

    vaultAccountBalance = (
      await getAccount(
        provider.connection,
        pdaVault,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount;
    console.log(vaultAccountBalance);
  });

  it("Test Force Transfer Token", async () => {
    let transferAmount = new BN(50);

    let forceTransferParams = {
      token: TEST_TOKEN,
      toAccount: user1.publicKey,
      fromAccount: user2.publicKey,
      amount: transferAmount,
    };

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceBeforeTransfer = Number(user1Account.amount);

    let user2ATA = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user2Account = await getAccount(
      provider.connection,
      user2ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user2BalanceBeforeTransfer = Number(user2Account.amount);

    await forceTransfer(forceTransferParams, user2ATA, user1ATA, admin);

    // Check balances after Force Transfer
    user1Account = await getAccount(
      provider.connection,
      user1ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user1BalanceAfterTransfer = Number(user1Account.amount);

    user2Account = await getAccount(
      provider.connection,
      user2ATA,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );
    let user2BalanceAfterTransfer = Number(user2Account.amount);

    // Check balances after transfer
    assert.equal(
      user1BalanceAfterTransfer,
      user1BalanceBeforeTransfer + Number(transferAmount),
    );
    assert.equal(
      user2BalanceAfterTransfer,
      user2BalanceBeforeTransfer - Number(transferAmount),
    );
  });

  it("Test Mint Token by other user", async () => {
    let tokenParams = {
      name: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: MINT_AMOUNT,
    };

    // Creating associated token for user1 for Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let balanceBeforeMint = (
      await getAccount(
        provider.connection,
        user1ATA,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount;

    try {
      await mint(tokenParams, user1ATA, user1);
    } catch (e) {
      assert.equal(e.error.errorCode.code, "Unauthorized");
    }
  });

  it("Test Burn Token From by other user", async () => {
    let tokenParams = {
      name: TEST_TOKEN,
      toAccount: user1.publicKey,
      amount: BURN_FROM_AMOUNT,
    };

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    try {
      await burnFrom(tokenParams, user1ATA, user1);
    } catch (e) {
      assert.equal(e.error.errorCode.code, "Unauthorized");
    }
  });

  it("Test Force Transfer Token by other user", async () => {
    let transferAmount = new BN(50);

    let forceTransferParams = {
      token: TEST_TOKEN,
      toAccount: user2.publicKey,
      fromAccount: user1.publicKey,
      amount: transferAmount,
    };

    // Creating associated token for user1 and Test
    let user1ATA = await getAssociatedTokenAddress(
      mintAccount,
      user1.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    let user2ATA = await getAssociatedTokenAddress(
      mintAccount,
      user2.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    );

    try {
      await forceTransfer(forceTransferParams, user1ATA, user2ATA, user1);
    } catch (e) {
      assert.equal(e.error.errorCode.code, "Unauthorized");
    }
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

  it("Test Update Royalty", async () => {
    [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [CONFIG, TEST],
      program.programId,
    );

    let royalty = 2;

    let updateRoyalty = await program.methods
      .updateRoyalty(TEST_TOKEN, royalty)
      .accounts({
        maintainers: pdaMaintainers,
        config: pdaConfig,
        caller: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(updateRoyalty);

    let newRoyalty = (await program.account.tokenConfiguration.fetch(pdaConfig))
      .royalty;
    assert.equal(newRoyalty, royalty);
  });

  it("Test Update Tokens Per Sol Value", async () => {
    let tokensPerSol = new BN(1000);

    let updateTokensPerSol = await program.methods
      .updateTokensPerSol(TEST_TOKEN, tokensPerSol)
      .accounts({
        maintainers: pdaMaintainers,
        config: pdaConfig,
        caller: admin.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    await confirmTransaction(updateTokensPerSol);

    let config = await program.account.tokenConfiguration.fetch(pdaConfig);
    assert.equal(Number(config.tokensPerSol), Number(tokensPerSol));
  });

  it("Test add to whitelist", async () => {
    let users = [user1.publicKey, user2.publicKey];
    let updateType = { add: {} };

    // Check before whitelisting
    let whitelist = await program.account.whitelistedUser.fetch(pdaWhitelist);
    assert.equal(whitelist.users.length, 1);

    await manageWhitelists(updateType, users);

    // Check after whitelisting
    whitelist = await program.account.whitelistedUser.fetch(pdaWhitelist);
    assert.equal(whitelist.users.length, 3);
    assert.isTrue(
      JSON.stringify(whitelist.users).includes(JSON.stringify(vault.publicKey)),
    );
    assert.isTrue(
      JSON.stringify(whitelist.users).includes(JSON.stringify(user1.publicKey)),
    );
    assert.isTrue(
      JSON.stringify(whitelist.users).includes(JSON.stringify(user2.publicKey)),
    );
  });

  it("Test remove from whitelist", async () => {
    let users = [user1.publicKey, user2.publicKey];
    let updateType = { remove: {} };

    // Check before whitelisting
    let whitelist = await program.account.whitelistedUser.fetch(pdaWhitelist);
    assert.equal(whitelist.users.length, 3);

    await manageWhitelists(updateType, users);

    // Check after whitelisting
    whitelist = await program.account.whitelistedUser.fetch(pdaWhitelist);
    assert.equal(whitelist.users.length, 1);
    assert.isTrue(
      JSON.stringify(whitelist.users).includes(JSON.stringify(vault.publicKey)),
    );
    assert.isFalse(
      JSON.stringify(whitelist.users).includes(JSON.stringify(user1.publicKey)),
    );
    assert.isFalse(
      JSON.stringify(whitelist.users).includes(JSON.stringify(user2.publicKey)),
    );
  });
});
