import { create } from "zustand";
import { persist } from "zustand/middleware";

type walletState = {
  wallet: any;
  loginWallet: (wallet: any) => void;
  logoutWallet: () => void;
};

const useWalletStore = create(
  persist<walletState>(
    (set) => ({
      wallet: undefined,
      loginWallet: (wallet: any) => set(() => ({ wallet })),
      logoutWallet: () => set(() => ({ wallet: undefined })),
    }),
    { name: "wallet" }
  )
);

export default useWalletStore;
