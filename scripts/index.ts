import {
  addSubAdmins,
  fetchMaintainers,
  initTokenProgram,
  createToken,
  mint,
  fetchBalances,
  buyWithSol,
  getBaseKeys,
  initResources,
  fetchContractBalances,
  setConfig
} from "./token-program";

import { PublicKey } from "@solana/web3.js";

import BN from "bn.js";

const callTheFunction = async () => {
  console.log("Triggering functions , please wait !");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // await initTokenProgram();
  // await fetchMaintainers();
  // await addSubAdmins();
  await createToken();
  // await setConfig();
  // await initResources();
  // await mint();
  // await fetchBalances();
  // await buyWithSol();
  // await getBaseKeys();
  // await fetchContractBalances();

  console.log("Functions Triggered, success !");
  console.log("sent =>>>>>>>>");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

callTheFunction();

// npm start run
