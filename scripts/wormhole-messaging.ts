import * as anchor from "@project-serum/anchor";
import {
  getProvider,
  wormholeMessagingProgramID,
  wormholeMessagingInterface,
  baseTokenProgramID,
} from "./solanaService";
import { WormholeMessaging } from "../target/types/wormhole_messaging";
import { Program } from "@project-serum/anchor";
import {
  TOKEN_2022_PROGRAM_ID,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
import {
  AdminAddress,
  CONFIG,
  MINT,
  AdminPrivateKey,
  AptosKey,
  RECEIVED,
  BASE_TOKEN_PROGRAM_ID,
  PAYLOAD,
} from "./constant";
import * as fs from "fs";
import {
  getPostMessageCpiAccounts,
  deriveAddress,
} from "@certusone/wormhole-sdk/lib/cjs/solana";
import { CONTRACTS, ChainId, CHAINS } from "@certusone/wormhole-sdk";
import { getProgramSequenceTracker } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import { Wormhole, signSendWait, wormhole } from "@wormhole-foundation/sdk";
import algorand from "@wormhole-foundation/sdk/algorand";
import aptos from "@wormhole-foundation/sdk/aptos";
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";
import * as _solana from "@wormhole-foundation/sdk-solana";
import * as _aptos from "@wormhole-foundation/sdk-aptos";
import * as _evm from "@wormhole-foundation/sdk-evm";
import { BN } from "bn.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  wormholeMessagingInterface,
  wormholeMessagingProgramID,
  provider,
) as Program<WormholeMessaging>;

const [pdaConfig] = anchor.web3.PublicKey.findProgramAddressSync(
  [CONFIG],
  program.programId,
);

function deriveWormholeMessageKey(
  programId: PublicKeyInitData,
  sequence: bigint,
) {
  return deriveAddress(
    [
      Buffer.from("sent"),
      (() => {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64LE(sequence);
        return buf;
      })(),
    ],
    programId,
  );
}

function deriveForeignEmitterKey(programId: PublicKeyInitData, chain: ChainId) {
  return deriveAddress(
    [
      Buffer.from("foreign_emitter"),
      (() => {
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(chain);
        return buf;
      })(),
    ],
    programId,
  );
}

function deriveReceivedKey(orderId) {
  return deriveAddress(
    [RECEIVED, Buffer.from(orderId.toString())],
    program.programId,
  );
}

function getEnv(key: string): string {
  // If we're in the browser, return empty string
  if (typeof process === undefined) return "";

  // Otherwise, return the env var or error
  const val = process.env[key];
  if (!val)
    throw new Error(
      `Missing env var ${key}, did you forget to set valies in '.env'?`,
    );

  return val;
}

const NETWORK = "TESTNET";
const WORMHOLE_CONTRACTS = CONTRACTS[NETWORK];
const CORE_BRIDGE_PID = new PublicKey(WORMHOLE_CONTRACTS.solana.core);
let sequence = BigInt(1);
const message = deriveWormholeMessageKey(program.programId, sequence);
const wormholeAccounts = getPostMessageCpiAccounts(
  program.programId,
  CORE_BRIDGE_PID,
  AdminAddress,
  message,
);
const emitterChain = CHAINS.avalanche;
const emitterAddress = WORMHOLE_CONTRACTS.avalanche.core;

const pdaForeignEmitter = deriveForeignEmitterKey(
  program.programId,
  emitterChain,
);

const [pdaPayload] = anchor.web3.PublicKey.findProgramAddressSync(
  [PAYLOAD],
  program.programId,
);

const initWormholeMessagingProgram = async () => {
  await program.methods
    .initialize()
    .accounts({
      owner: AdminAddress,
      config: pdaConfig,
      wormholeProgram: new PublicKey(CORE_BRIDGE_PID),
      ...wormholeAccounts,
    })
    .rpc();
};

const fetchForeignEmitter = async () => {
  let config = await program.account.config.fetch(pdaConfig);
  console.log(config);

  let foreignEmitter =
    await program.account.foreignEmitter.fetch(pdaForeignEmitter);
  console.log(foreignEmitter);
};

const registerForeignEmitter = async () => {
  let address = Buffer.alloc(32, emitterAddress.substring(2), "hex");
  await program.methods
    .registerEmitter(emitterChain, address)
    .accounts({
      owner: AdminAddress,
      config: pdaConfig,
      foreignEmitter: pdaForeignEmitter,
    })
    .rpc();
};

const sendMessage = async () => {
  const message = Buffer.from(
    "0x01e6e21ddb0434468edda0ccffcb01fb501e741691241506df44ab6a13a6b4604564000000000000000000000000000000000000001d5f14250b767728db006993834e167c6ba740fa01000000000000000000000000000000000000000000000000000000000000000454657374",
  );
  const sequence =
    (
      await getProgramSequenceTracker(
        provider.connection,
        program.programId,
        CORE_BRIDGE_PID,
      )
    ).value() + BigInt(1);

  const messageKey = await getProgramSequenceTracker(
    provider.connection,
    program.programId,
    CORE_BRIDGE_PID,
  ).then((tracker) =>
    deriveWormholeMessageKey(program.programId, tracker.sequence + BigInt(1)),
  );

  const wormholeAccounts = getPostMessageCpiAccounts(
    program.programId,
    CORE_BRIDGE_PID,
    AdminAddress,
    messageKey,
  );

  console.log(sequence);

  let tx = await program.methods
    .sendMessage(message)
    .accounts({
      config: pdaConfig,
      wormholeProgram: CORE_BRIDGE_PID,
      ...wormholeAccounts,
    })
    .rpc();
  console.log(tx);
  return tx;
};

const fetchWormholeMessage = async (tx, chain) => {
  const wh = await wormhole("Testnet", [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
  ]);
  let ctx = wh.getChain(chain);
  let [whm] = await ctx.parseTransaction(tx);
  let vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);

  return vaa;
};

const fetchWormholeReceiveStatus = async (orderId) => {
  let pdaReceived = deriveReceivedKey(orderId);
  let received = await program.account.received.fetch(pdaReceived);
  console.log("orderId: ", received.orderId.toNumber());
  console.log("isCompleted: ", received.isCompleted);
};

const signAndVerifySolana = async (tx) => {
  const wh = await wormhole("Testnet", [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
  ]);
  let ctx = wh.getChain("Solana");
  const coreBridge = await ctx.getWormholeCore();
  let [whm] = await ctx.parseTransaction(tx);
  let vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);

  let signer = await _solana.getSolanaSignAndSendSigner(
    await ctx.getRpc(),
    AdminPrivateKey,
  );
  let address = Wormhole.chainAddress(ctx.chain, signer.address());

  const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
  console.log(await signSendWait(ctx, verifyTxs, signer));

  console.log(
    await signSendWait(
      ctx,
      coreBridge.verifyMessage(address.address, vaa!),
      signer,
    ),
  );
};

const signAndVerifyAptos = async (tx) => {
  const wh = await wormhole("Testnet", [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
  ]);
  let ctx = wh.getChain("Aptos");
  const coreBridge = await ctx.getWormholeCore();
  let [whm] = await ctx.parseTransaction(tx);
  let vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);

  let signer = await _aptos.getAptosSigner(await ctx.getRpc(), AptosKey);
  let address = Wormhole.chainAddress(ctx.chain, signer.address());

  console.log(address.address);

  const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
  console.log(await signSendWait(ctx, verifyTxs, signer));

  // console.log(
  //   await signSendWait(
  //     ctx,
  //     coreBridge.verifyMessage(address.address, vaa!),
  //     signer,
  //   ),
  // );
};

const signAndVerifyAvalanche = async (tx) => {
  const wh = await wormhole("Testnet", [
    evm,
    solana,
    aptos,
    algorand,
    cosmwasm,
  ]);
  let ctx = wh.getChain("Avalanche");
  const coreBridge = await ctx.getWormholeCore();
  let [whm] = await ctx.parseTransaction(tx);
  let vaa = await wh.getVaa(whm!, "Uint8Array", 60_000);

  // let signer = await _evm.getEvmSigner(
  //   await ctx.getRpc(),
  //   AvalancheKey,
  // );
  // console.log(await ctx.getRpc());
  // let address = Wormhole.chainAddress(ctx.chain, signer.address());

  // console.log(address.address);

  // const verifyTxs = coreBridge.verifyMessage(address.address, vaa!);
  // console.log(await signSendWait(ctx, verifyTxs, signer));

  // console.log(
  //   await signSendWait(
  //     ctx,
  //     coreBridge.verifyMessage(address.address, vaa!),
  //     signer,
  //   ),
  // );
};

const extractPayload = async (payload) => {
  // let message = new TextDecoder().decode(payload);
  // console.log(message);
  await program.methods
    .extractPayloadData(payload)
    .accounts({
      payload: pdaPayload,
      authority: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  let data = await program.account.payload.fetch(pdaPayload);
  console.log("Payload: ", data);
  console.log(data.orderId.toNumber());
};

const receiveMessage = async (tx, chain) => {
  let vaa = await fetchWormholeMessage(tx, chain);

  let payload = Buffer.from(vaa.payload);
  extractPayload(payload);

  let fetchedPayload = await program.account.payload.fetch(pdaPayload);

  const [mintAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [MINT, fetchedPayload.token],
    baseTokenProgramID,
  );

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
    fetchedPayload.investor,
    undefined,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );

  // Balance Before
  let userAccount = await getAccount(
    provider.connection,
    userATA.address,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log(Number(userAccount.amount));

  let pdaReceived = deriveReceivedKey(fetchedPayload.orderId);

  await program.methods
    .receiveMessage([...vaa.hash], fetchedPayload.orderId, payload)
    .accounts({
      payer: AdminAddress,
      config: pdaConfig,
      wormholeProgram: CORE_BRIDGE_PID,
      received: pdaReceived,
      mintAccount,
      user: userATA.address,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      baseTokenProgram: BASE_TOKEN_PROGRAM_ID,
    })
    .rpc();

  // Balance After
  userAccount = await getAccount(
    provider.connection,
    userATA.address,
    undefined,
    TOKEN_2022_PROGRAM_ID,
  );
  console.log(userAccount.amount);
};

export {
  initWormholeMessagingProgram,
  fetchForeignEmitter,
  registerForeignEmitter,
  sendMessage,
  fetchWormholeMessage,
  receiveMessage,
  signAndVerifyAptos,
  signAndVerifySolana,
  signAndVerifyAvalanche,
  extractPayload,
  fetchWormholeReceiveStatus,
};
