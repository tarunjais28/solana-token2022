import { initTokenProgram } from "./token-program";

import { PublicKey } from "@solana/web3.js";

import { ChainName } from "@certusone/wormhole-sdk";
import BN from "bn.js";

const callTheFunction = async () => {
  console.log("Triggering functions , please wait !");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  await initTokenProgram();

  console.log("Functions Triggered, success !");
  console.log("sent =>>>>>>>>");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

callTheFunction();

// npm start run
