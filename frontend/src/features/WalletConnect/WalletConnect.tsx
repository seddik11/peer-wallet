import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { useInitialization } from "@/features/WalletConnect/hooks/useInitialization";
import { useWalletConnectEventsManager } from "@/features/WalletConnect/hooks/useWalletConnectEventsManager";

export const WalletConnect = () => {
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization();

  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized);
  const { open } = useWcModalStore((state) => ({
    open: state.open,
  }));

  const onWalletConnect = () => {
    open({
      modalView: {
        type: "OnConnectDappsModal",
      },
    });
  };

  console.log("WalletConnect.tsx", {
    initialized: initialized,
    open: open,
  });
  return (
    <div>
      <button
        className={"btn"}
        onClick={onWalletConnect}
        disabled={!initialized}
      >
        WalletConnect
      </button>
    </div>
  );
};
