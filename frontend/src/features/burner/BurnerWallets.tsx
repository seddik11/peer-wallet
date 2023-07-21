import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";

export const BurnerWallets = () => {
  const {
    burnerWallets,
    generateBurnerWallet,
    removeBurnerWallet,
    selectBurnerWallet,
    activeBurnerWallet,
  } = useBurnerWalletStore();

  return (
    <div>
      <button className="btn" onClick={generateBurnerWallet}>
        Generate Burner Wallet
      </button>
      {burnerWallets.map((wallet) => (
        <div key={wallet.address}>
          <div>{wallet.address}</div>
          <button
            className={`btn btn-primary`}
            disabled={wallet.address === activeBurnerWallet?.address}
            onClick={() => selectBurnerWallet(wallet.address)}
          >
            Set as active
          </button>

          <button
            className={"btn btn-secondary"}
            onClick={() => removeBurnerWallet(wallet.address)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
