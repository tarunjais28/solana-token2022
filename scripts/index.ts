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
  setConfig,
  setEscrow,
} from "./token-program";

import { initReceiverProgram, getReceiverBaseKeys, receive } from "./receiver";

const callTheFunction = async () => {
  console.log("Triggering functions , please wait !");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // await initTokenProgram();
  // await fetchMaintainers();
  // await addSubAdmins();
  // await createToken();
  // await setEscrow();
  // await setConfig();
  // await initResources();
  await mint();
  // await fetchBalances();
  // await buyWithSol();
  // await getBaseKeys();
  // await fetchContractBalances();

  // await initReceiverProgram();
  // await getReceiverBaseKeys();
  // await receive();

  console.log("Functions Triggered, success !");
  console.log("sent =>>>>>>>>");
  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // ==============================================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};

callTheFunction();

// npm start run
