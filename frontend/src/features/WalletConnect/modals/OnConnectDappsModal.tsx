import { useCallback, useEffect, useState } from "react";
import { pair } from "@/features/WalletConnect/WalletConnectUtils";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { parseUri } from "@walletconnect/utils";
import { toast } from "react-toastify";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import { SessionTypes } from "@walletconnect/types";

export const OnConnectDappsModal = () => {
  const [walletConnectUrl, setWalletConnectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const view = useWcModalStore((state) => state.modalView);
  const close = useWcModalStore((state) => state.close);

  const {
    burnerWallets,
    generateBurnerWallet,
    removeBurnerWallet,
    selectBurnerWallet,
    activeBurnerWallet,
  } = useBurnerWalletStore();

  if (view?.type !== "OnConnectDappsModal") throw new Error("Invalid view");

  const onConnect = useCallback(async (uri: string) => {
    try {
      setLoading(true);

      setWalletConnectUrl(uri);
      const { version } = parseUri(uri);
      console.log("Connection version", version);

      if (!version) {
        console.error("Invalid connection");
        toast.error("Invalid connection");
        return;
      }
      if (version === 1) throw new Error("Version 1 not supported");
      if (version === 2) {
        console.log("Using wc2");
        await pair({ uri });
      }
    } catch (err: unknown) {
      console.log("Error onConnect", err);
      toast.error(err as string);
    } finally {
      console.log("Finally");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    generateBurnerWallet();
  }, [generateBurnerWallet]);

  useEffect(() => {
    if (burnerWallets?.length) {
      const [wallet] = burnerWallets.slice(-1);
      selectBurnerWallet(wallet.address);
    }
  }, [burnerWallets, selectBurnerWallet]);

  return (
    <div
      className={`modal rounded-md ${
        view?.type === "OnConnectDappsModal" ? "modal-open" : ""
      }`}
    >
      <div className="modal-box w-11/12 max-w-xl bg-teal-100 flex items-center flex-col">
        <input
          type="text"
          placeholder="Enter WalletConnect URI"
          className="input input-bordered w-full bg-white text-black"
          disabled={loading}
          value={walletConnectUrl}
          onChange={(event) => setWalletConnectUrl(event.target.value)}
        />
        <div className="pt-6 w-full">
          <button
            onClick={() => onConnect(walletConnectUrl)}
            disabled={!walletConnectUrl && !loading}
            className="btn btn-primary w-full mb-2 text-white"
          >
            {loading && (
              <span className="loading loading-spinner btn-neutral text-white"></span>
            )}
            {loading ? "loading" : "Connect"}
          </button>
          <button className="btn btn-neutral w-full" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
