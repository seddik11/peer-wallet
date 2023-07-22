/**
 * Loop over the 100 accounts and generate a private key for each one and send 0.1 matic to it, from the parent account
 */
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

const parentAccount = ethers.Wallet.createRandom();

export const generatePrivateKeys = () => {
  const signer = new ethers.Wallet(parentAccount.privateKey).connect(
    new JsonRpcProvider("https://polygon-mumbai.blockpi.network/v1/rpc/public")
  );

  console.log("Parent account address: ", parentAccount.address);
};

generatePrivateKeys();
