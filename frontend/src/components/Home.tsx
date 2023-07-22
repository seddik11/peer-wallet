import Card from "./Card";
import Navbar from "./Navbar";
import { BurnerWallets } from "@/features/burner/BurnerWallets";
import { WalletConnect } from "@/features/WalletConnect/WalletConnect";
import { WalletConnectModals } from "@/features/WalletConnect/modals/WalletConnectModals";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";

export default function Home() {
  const { activeBurnerWallet } = useBurnerWalletStore();

  return (
    <div className="App min-h-screen">
      <Navbar />

      <div className="m-auto mt-10 w-3/4">
        <div className="text-5xl text-center mb-10">$ 10.000,00</div>

        <div className="mb-10 gap-4 flex ">
          <Card></Card> <Card></Card>
        </div>
        <Card>
          {/* <BurnerWallets /> */}
          <WalletConnect />
        </Card>
        <WalletConnectModals />
      </div>
    </div>
  );
}
