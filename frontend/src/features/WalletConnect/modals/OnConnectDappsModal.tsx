import { useState } from "react";
import { pair } from "@/features/WalletConnect/WalletConnectUtils";
import { useInitialization } from "@/features/WalletConnect/hooks/useInitialization";
import { useWalletConnectEventsManager } from "@/features/WalletConnect/hooks/useWalletConnectEventsManager";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { parseUri } from "@walletconnect/utils";
import { toast } from "react-toastify";

export const OnConnectDappsModal = () => {
  const [walletConnectUrl, setWalletConnectUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const view = useWcModalStore((state) => state.modalView);

  if (view?.type !== "OnConnectDappsModal") throw new Error("Invalid view");

  async function onConnect(uri: string) {
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
  }

  return (
    <>
      <div className="h-full bg-white px-4 py-6">
        <input
          type="text"
          placeholder="Enter WalletConnect URI"
          className="input input-bordered w-full max-w-xs"
          disabled={loading}
          value={walletConnectUrl}
          onChange={(event) => setWalletConnectUrl(event.target.value)}
        />
        <div
          className="pt-6"
          style={{ paddingBottom: "96px", paddingTop: "24px" }}
        >
          <button
            onClick={() => onConnect(walletConnectUrl)}
            disabled={!walletConnectUrl && !loading}
            className="btn btn-primary w-full mb-2"
          >
            <>{loading ? "spinner" : <>Connect</>}</>
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="btn btn-secondary w-full"
            disabled={true}
          >
            <>Scan and connect (TODO)</>
          </button>
        </div>
      </div>
      {showScanner && "TODO: Add QR code scanner here."}
    </>
  );
};
