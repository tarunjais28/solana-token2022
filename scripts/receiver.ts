import * as anchor from "@coral-xyz/anchor";
import { getProvider, receiverProgramInterface } from "./solanaService";
import { Receiver } from "../target/types/receiver";
import { Program } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { AdminAddress, MAINTAINERS, ESCROW, USER_DATA } from "./constant";
import { PublicKey } from "@solana/web3.js";

const { provider }: any = getProvider();
if (!provider) throw new Error("Provider not available");
let program: any = new anchor.Program(
  receiverProgramInterface,
  provider,
) as Program<Receiver>;

const [pdaMaintainers] = anchor.web3.PublicKey.findProgramAddressSync(
  [MAINTAINERS],
  program.programId,
);

const [pdaEscrow] = anchor.web3.PublicKey.findProgramAddressSync(
  [ESCROW],
  program.programId,
);

const [pdaUsers] = anchor.web3.PublicKey.findProgramAddressSync(
  [USER_DATA],
  program.programId,
);

const addReceiverSubAdmins = async () => {
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

const initReceiverProgram = async () => {
  await program.methods
    .init(AdminAddress)
    .accounts({
      maintainers: pdaMaintainers,
      escrowKey: pdaEscrow,
      userData: pdaUsers,
      authority: AdminAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

const fetchMaintainers = async () => {
  let maintainers = await program.account.maintainers.fetch(pdaMaintainers);
  console.log(maintainers.admin.toString());
  console.log(maintainers.subAdmins.toString());
};

const setEscrow = async (address: PublicKey) => {
  await program.methods
    .updateEscrow(address)
    .accounts({
      maintainers: pdaMaintainers,
      escrowKey: pdaEscrow,
      authority: AdminAddress,
    })
    .rpc();
};

const getReceiverBaseKeys = async () => {
  console.log("maintainers", pdaMaintainers.toString());
  console.log("users", pdaUsers.toString());
  console.log("pdaEscrow", pdaEscrow.toString());

  let escrow = await program.account.escrowKey.fetch(pdaEscrow);
  console.log("escrow_account", escrow.key.toBase58());
};

const fetchUsers = async () => {
  let userData = await program.account.userData.fetch(pdaUsers);
  console.log(userData.users.toString());
};

const updateReceiverAdmin = async (admin: PublicKey) => {
  await program.methods
    .manageAdmin(admin)
    .accounts({
      maintainers: pdaMaintainers,
      authority: AdminAddress,
    })
    .rpc();
};

const receive = async () => {
  let user = new PublicKey("ArZEdFt7rq9Eoc1T4DoppEYh9vrdBHgLATxsFKRytfxr");
  let amount = new BN(100);

  await program.methods
    .receive(amount)
    .accounts({
      userData: pdaUsers,
      user: AdminAddress,
      escrowKey: pdaEscrow,
      escrowAccount: AdminAddress,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
};

export {
  fetchMaintainers,
  updateReceiverAdmin,
  initReceiverProgram,
  addReceiverSubAdmins,
  receive,
  getReceiverBaseKeys,
  setEscrow,
};
