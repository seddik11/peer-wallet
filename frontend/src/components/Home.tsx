import Navbar from "./Navbar";
import { BurnerWallets } from "@/features/burner/BurnerWallets";
import { WalletConnect } from "@/features/WalletConnect/WalletConnect";
import { WalletConnectModals } from "@/features/WalletConnect/modals/WalletConnectModals";

export default function Home() {
  return (
    <div className="App min-h-screen">
      <Navbar />
      <BurnerWallets />
      <WalletConnect />
      <WalletConnectModals />
    </div>
  );
}
