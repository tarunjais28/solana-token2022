import * as anchor from "@coral-xyz/anchor";
import {
  getProvider,
  tokenProgramInterface,
} from "./solanaService";
import { TokenProgram } from "../target/types/token_program";
import { Program } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  AdminAddress,
  MAINTAINERS,
  CONFIG,
  TEST,
  TEST_TOKEN,
  MINT,
  WHITELIST,
  ESCROW,
  VAULT,
} from "./constant";
import * as fs from "fs";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  tokenProgramInterface,
  provider,
) as Program<TokenProgram>;

const [pdaMaintainers] = anchor.web3.PublicKey.findProgramAddressSync(
  [MAINTAINERS],
  program.programId,
);

const [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
  [CONFIG, TEST],
  program.programId,
);

const [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  [MINT, TEST],
  program.programId,
);

const [pdaWhitelist] = anchor.web3.PublicKey.findProgramAddressSync(
  [WHITELIST],
  program.programId,
);

const [pdaEscrow] = anchor.web3.PublicKey.findProgramAddressSync(
  [ESCROW, TEST],
  program.programId,
);

const [pdaVault] = anchor.web3.PublicKey.findProgramAddressSync(
  [VAULT, TEST],
  program.programId,
);

const addSubAdmins = async () => {
  await program.methods
    .addSubAdminAccounts([
      new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr"),
    ])
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
    })
    .rpc();
};

const initTokenProgram = async () => {
  await program.methods
    .init([])
    .accounts({
      maintainers: pdaMaintainers,
      whitelist: pdaWhitelist,
      authority: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
};

const fetchMaintainers = async () => {
  let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
  console.log(maintainers.admin.toString());
  console.log(maintainers.subAdmins.toString());
};

const createToken = async () => {
  let createTokenParams = {
    name: TEST_TOKEN,
    symbol: "tes",
    uri: "https://arweave.net/dEGah51x5Dlvbfcl8UUGz52KovgWh6QmrYIW48hi244?ext=png",
    decimals: 9,
    royalty: 1,
    tokensPerSol: new BN(150),
  };

  console.log({
    maintainers: pdaMaintainers,
    config: pdaConfig,
    mintAccount,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    payer: AdminAddress,
    systemProgram: anchor.web3.SystemProgram.programId,
  });
  // await program.methods
  //   .create(createTokenParams)
  //   .accounts({
  //     maintainers: pdaMaintainers,
  //     config: pdaConfig,
  //     mintAccount,
  //     tokenProgram: TOKEN_2022_PROGRAM_ID,
  //     payer: AdminAddress,
  //     systemProgram: anchor.web3.SystemProgram.programId,
  //   })
  //   .rpc();
};

const initResources = async () => {
  await program.methods
    .initResources(TEST_TOKEN)
    .accounts({
      mintAccount,
      escrowAccount: pdaEscrow,
      vaultAccount: pdaVault,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      payer: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

const getBaseKeys = async () => {
  console.log("mint", mintAccount.toString());
  console.log("config", pdaConfig.toString());
  console.log("maintainers", pdaMaintainers.toString());
  console.log("pdaWhitelist", pdaWhitelist.toString());
  console.log("pdaEscrow", pdaEscrow.toString());
  console.log("pdaVault", pdaVault.toString());

  // let supply = await provider.connection.getTokenSupply(mintAccount);
  // console.log(Number(supply.value.amount));
};

const fetchBalances = async () => {
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");
  let userATA = await getAssociatedTokenAddress(
    mintAccount,
    user,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log("user: ", user.toString());
  console.log("ata: ", userATA.toString());

  let supply = (await provider.connection.getTokenSupply(mintAccount)).value
    .amount;

  let userAccountBalance = Number(
    (
      await getAccount(
        provider.connection,
        userATA,
        undefined,
        TOKEN_2022_PROGRAM_ID,
      )
    ).amount,
  );

  console.log("supply: ", supply);
  console.log("user balance: ", userAccountBalance);
};

const fetchContractBalances = async () => {
  let escrowBalance = (
    await getAccount(
      provider.connection,
      pdaEscrow,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    )
  ).amount;

  let vaultBalance = (
    await getAccount(
      provider.connection,
      pdaVault,
      undefined,
      TOKEN_2022_PROGRAM_ID,
    )
  ).amount;

  console.log("escrow balance: ", escrowBalance);
  console.log("vault balance: ", vaultBalance);
};

const updateTokenProgramAdmin = async (admin: PublicKey) => {
  await program.methods
    .manageAdmin(admin)
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
    })
    .rpc();
};

const mint = async () => {
  // let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");

  let tokenParams = {
    name: TEST_TOKEN,
    amount: new BN((1000000 * LAMPORTS_PER_SOL * 40) / 100),
  };

  const rawPayerKeypair = JSON.parse(
    fs.readFileSync("/home/tarunjais/.config/solana/id.json", "utf-8"),
  );
  const adminKey = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(rawPayerKeypair),
  );

  // Creating associated token for user for Test
  let userATA = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    adminKey,
    mintAccount,
    AdminAddress,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  await program.methods
    .mintToken(tokenParams)
    .accounts({
      maintainers: pdaMaintainers,
      mintAccount,
      toAccount: userATA.address,
      authority: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
};

const buyWithSol = async () => {
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");

  const rawPayerKeypair = JSON.parse(
    fs.readFileSync("/home/tarunjais/.config/solana/id.json", "utf-8"),
  );
  const adminKey = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(rawPayerKeypair),
  );

  // Creating associated token for user for Test
  let userATA = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    adminKey,
    mintAccount,
    AdminAddress,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  let vaultAta = await getAssociatedTokenAddress(
    mintAccount,
    user,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  let buyWithSolParams = {
    token: TEST_TOKEN,
    solAmount: new BN(1 * LAMPORTS_PER_SOL),
  };

  await program.methods
    .buyWithSol(buyWithSolParams)
    .accounts({
      mintAccount,
      config: pdaConfig,
      user: AdminAddress,
      whitelist: pdaWhitelist,
      escrowAccount: pdaEscrow,
      vaultAccount: pdaVault,
      vaultAta,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

export {
  fetchMaintainers,
  updateTokenProgramAdmin,
  initTokenProgram,
  addSubAdmins,
  createToken,
  initResources,
  mint,
  fetchBalances,
  buyWithSol,
  getBaseKeys,
  fetchContractBalances,
};
