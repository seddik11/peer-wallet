import { useBurnerWalletStore } from "@/features/useBurnerWalletStore";

export const BurnerWallets = () => {
  const { burnerWallets, generateBurnerWallet, removeBurnerWallet } =
    useBurnerWalletStore();

  return (
    <div>
      <button className="btn" onClick={generateBurnerWallet}>
        Generate Burner Wallet
      </button>
      {burnerWallets.map((wallet) => (
        <div key={wallet.address}>
          <div>{wallet.address}</div>
          <button
            className={"btn"}
            onClick={() => removeBurnerWallet(wallet.address)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
