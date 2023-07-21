import { useCallback, useEffect, useState } from "react";
import { createOrRestoreEIP155Wallet } from "@/features/WalletConnect/Eip155WalletUtil";
import { useSettingsStore } from "@/features/WalletConnect/hooks/useSettingsStore";
import { toast } from "react-toastify";

import { createWeb3Wallet } from "../WalletConnectUtils";
import { useActiveBurnerWallet } from "@/features/burner/useBurnerWalletStore";

export const useInitialization = () => {
  const [initialized, setInitialized] = useState(false);
  const wallet = useActiveBurnerWallet();

  const relayerRegionURL = useSettingsStore((state) => state.relayerRegionURL);
  const setEip155Address = useSettingsStore((state) => state.setEip155Address);

  const onInitialize = useCallback(async () => {
    console.log("onInitialize");
    try {
      if (!wallet) throw new Error("No wallet found");
      const signerObj = wallet;
      if (!signerObj || !wallet.address) {
        throw new Error("Signer not initialized");
      }
      const { eip155Addresses } = createOrRestoreEIP155Wallet(signerObj);

      if (!eip155Addresses[0]) throw new Error("No EIP155 addresses found");
      setEip155Address(eip155Addresses[0]);
      await createWeb3Wallet();

      setInitialized(true);
    } catch (err: unknown) {
      toast.error(`${err}`);
    }
  }, [setEip155Address, wallet]);

  useEffect(() => {
    if (!wallet?.address) {
      return;
    }
    if (!initialized) {
      void onInitialize();
    }
  }, [initialized, onInitialize, wallet?.address]);

  return initialized;
};
