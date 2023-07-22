import Navbar from "./Navbar";
import { WalletConnectModals } from "@/features/WalletConnect/modals/WalletConnectModals";
import Balance from "./Balance";
import Credentials from "./Credentials";
import ConnectedDapps from "./ConnectedDapps";
import { useInitialization } from "@/features/WalletConnect/hooks/useInitialization";
import { useWalletConnectEventsManager } from "@/features/WalletConnect/hooks/useWalletConnectEventsManager";
import ChatsList from "./ChatsList";

export default function Home() {
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization();
  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized);

  console.log("WalletConnect", {
    initialized: initialized,
  });

  return (
    <div className="App min-h-screen">
      <Navbar />

      <div className="m-auto mt-10 w-2/4 flex flex-col gap-14">
        <Balance />
        <Credentials />
        <ConnectedDapps initialized={initialized} />
        <ChatsList />

        <WalletConnectModals />
      </div>
    </div>
  );
}
