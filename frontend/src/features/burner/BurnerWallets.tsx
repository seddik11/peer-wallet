import Card from "@/components/Card";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import truncateAddress from "@/utils/truncateAddress";
import { WalletConnect } from "../WalletConnect/WalletConnect";

export const BurnerWallets = () => {
  const {
    burnerWallets,
    generateBurnerWallet,
    removeBurnerWallet,
    selectBurnerWallet,
    activeBurnerWallet,
  } = useBurnerWalletStore();

  return (
    <div className="flex flex-col items-center">
      {burnerWallets.length > 0 ? (
        <div className="flex gap-4 flex-wrap items-center">
          {burnerWallets.map((wallet) => (
            <div
              key={wallet.address}
              className="p-4 flex flex-col gap-2 text-center"
            >
              <div>{truncateAddress(wallet.address)}</div>

              {wallet.address === activeBurnerWallet?.address ? (
                <WalletConnect />
              ) : (
                <button
                  className={`btn btn-primary text-white`}
                  disabled={wallet.address === activeBurnerWallet?.address}
                  onClick={() => selectBurnerWallet(wallet.address)}
                >
                  Set as active
                </button>
              )}
              {/* <button
                className={"btn btn-secondary"}
                onClick={() => removeBurnerWallet(wallet.address)}
              >
                Remove
              </button> */}
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-2xl">No burner wallets</h1>
      )}

      <button className="btn btn-secondary mt-4" onClick={generateBurnerWallet}>
        Generate Burner Wallet
      </button>
    </div>
  );
};
