import * as anchor from "@project-serum/anchor";
import {
  getProvider,
  tokenProgramID,
  tokenProgramInterface,
} from "./solanaService";
import { TokenProgram } from "../target/types/token_program";
import { Program } from "@project-serum/anchor";
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
} from "./constant";
import * as fs from "fs";
import { PublicKey } from "@solana/web3.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  tokenProgramInterface,
  tokenProgramID,
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
    decimals: 1,
    royalty: 1,
    tokensPerSol: new BN(100),
  };

  await program.methods
    .create(createTokenParams)
    .accounts({
      maintainers: pdaMaintainers,
      config: pdaConfig,
      mintAccount,
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
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");

  let tokenParams = {
    name: TEST_TOKEN,
    toAccount: user,
    amount: new BN(100000),
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
    user,
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
      tokenAccount: userATA.address,
      toAccount: userATA.address,
      authority: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
};

export {
  fetchMaintainers,
  updateTokenProgramAdmin,
  initTokenProgram,
  addSubAdmins,
  createToken,
  mint,
  fetchBalances,
};
