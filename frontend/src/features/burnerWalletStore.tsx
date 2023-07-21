import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ethers } from "ethers";

export type Address = `0x${string}`;

export interface IBurnerStore {
  burnerWallets: ethers.Wallet[];
  generateBurnerWallet: () => void;
  removeBurnerWallet: (address: string) => void;
}

export const useBurnerWalletStore = create<IBurnerStore>()(
  persist(
    immer((set) => ({
      burnerWallets: [],
      generateBurnerWallet: () => {
        set((store) => {
          const account = ethers.Wallet.createRandom();
          store.burnerWallets.push(account);
        });
      },
      removeBurnerWallet: (address: Address) => {
        set((store) => {
          store.burnerWallets = store.burnerWallets.filter(
            (account) => account.address !== address
          );
        });
      },
    })),
    {
      name: "burner-wallet-store",
    }
  )
);
