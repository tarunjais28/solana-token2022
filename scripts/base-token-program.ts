import * as anchor from "@project-serum/anchor";
import {
  getProvider,
  baseTokenProgramID,
  baseTokenProgramInterface,
} from "./solanaService";
import { BaseTokenProgram } from "../target/types/base_token_program";
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
} from "./constant";
import * as fs from "fs";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  baseTokenProgramInterface,
  baseTokenProgramID,
  provider,
) as Program<BaseTokenProgram>;

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

const initBaseTokenProgram = async () => {
  await program.methods
    .init()
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
};

const fetchBaseMaintainers = async () => {
  let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
  console.log(maintainers.admin.toString());
  console.log(maintainers.subAdmins.toString());
};

const createToken = async () => {
  let createTokenParams = {
    id: "unique",
    name: TEST_TOKEN,
    symbol: "tes",
    uri: "some/uri",
    issuer: AdminAddress,
    transferAgent: AdminAddress,
    tokenizationAgent: AdminAddress,
  };

  await program.methods
    .create(createTokenParams)
    .accounts({
      maintainers: pdaMaintainers,
      config: pdaConfig,
      mintAccount,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
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

const requestOrders = async () => {
  const rawPayerKeypair = JSON.parse(
    fs.readFileSync("/Users/tarunjaiswal/.config/solana/id.json", "utf-8"),
  );
  const adminKey = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(rawPayerKeypair),
  );
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

  let requestParams = {
    orderId: new BN(1),
    token: TEST_TOKEN,
    toAccount: AdminAddress,
    amount: new BN(100),
    requestType: { mint: {} },
  };

  console.log(userATA.address.toBase58());

  await program.methods
    .requestOrders(requestParams)
    .accounts({
      mintAccount,
      user: userATA.address,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
    .rpc();
};

const fetchBalances = async () => {
  let userATA = await getAssociatedTokenAddress(
    mintAccount,
    AdminAddress,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

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

export {
  initBaseTokenProgram,
  fetchBaseMaintainers,
  createToken,
  getBaseKeys,
  requestOrders,
  fetchBalances,
};
