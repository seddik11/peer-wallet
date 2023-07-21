import { Wallet } from "ethers";

import { EIP155Lib } from "./Eip155Lib";

export let wallet3: EIP155Lib;
export let eip155Wallets: Record<string, EIP155Lib>;
export let eip155Addresses: string[];

let address3: string;

/**
 * Utilities
 */
export function createOrRestoreEIP155Wallet(wallet: Wallet) {
  wallet3 = new EIP155Lib(wallet);

  address3 = wallet3.getAddress();

  eip155Wallets = {
    [address3]: wallet3,
  };
  eip155Addresses = Object.keys(eip155Wallets);

  return {
    eip155Wallets,
    eip155Addresses,
  };
}
