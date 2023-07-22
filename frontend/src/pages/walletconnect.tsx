import { WalletConnectModals } from "@/features/WalletConnect/modals/WalletConnectModals";
import { WalletConnect } from "@/features/WalletConnect/WalletConnect";
import { BurnerWallets } from "@/features/burner/BurnerWallets";
import dynamic from "next/dynamic";

function WalletConnectPage() {
  return (
    <>
      <BurnerWallets />
      <WalletConnect />
      <WalletConnectModals />
    </>
  );
}

const WalletConnectPageNoSSR = dynamic(
  () => Promise.resolve(WalletConnectPage),
  {
    ssr: false,
  }
);

export default WalletConnectPageNoSSR;
