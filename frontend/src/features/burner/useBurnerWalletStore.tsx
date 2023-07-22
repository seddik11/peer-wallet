import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ethers } from "ethers";

export type Address = `0x${string}`;

const initBurnerWallet = ethers.Wallet.createRandom();

export interface IBurnerStore {
  activeBurnerWallet?: ethers.Wallet;
  burnerWalletsKeys: string[];
  burnerWallets: ethers.Wallet[];
  generateBurnerWallet: () => void;
  removeBurnerWallet: (address: string) => void;
  selectBurnerWallet: (address: string) => void;
}

export const useBurnerWalletStore = create<IBurnerStore>()(
  persist(
    immer((set) => ({
      activeBurnerWallet: initBurnerWallet,
      burnerWalletsKeys: [initBurnerWallet.privateKey],
      burnerWallets: [initBurnerWallet],
      generateBurnerWallet: () => {
        set((store) => {
          const account = ethers.Wallet.createRandom();
          store.burnerWalletsKeys.push(account.privateKey);
          store.burnerWallets.push(account);
        });
      },
      removeBurnerWallet: (address) => {
        set((store) => {
          store.burnerWallets = store.burnerWallets.filter(
            (account) => account.address !== address
          );
        });
      },
      selectBurnerWallet: (address) => {
        set((store) => {
          store.activeBurnerWallet = store.burnerWallets.find(
            (account) => account.address === address
          );
        });
      },
    })),
    {
      name: "burner-wallet-store",
    }
  )
);

export const useActiveBurnerWallet = () => {
  return useBurnerWalletStore((state) => state.activeBurnerWallet);
};
