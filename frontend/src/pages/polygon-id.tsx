import {
  usePolygonIdStoredCreds,
  usePolygonIdWallet,
} from "@/features/polygon-id/usePolygonId";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export const PolygonIdWallet = ({ isOpen, close }: any) => {
  const { wallet } = usePolygonIdWallet();

  const [authenticated, setAuthenticated] = useState<any>();
  const [authQr, setAuthQr] = useState<string>("");
  const [credentialQr, setCredentialQr] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const did = wallet.data?.did;

  const handleAuth = async () => {
    if (!did) throw new Error("No did");
    if (!authQr) throw new Error("No authQr");

    setLoading(true);

    wallet.data
      ?.handleAuthOffer({
        did: did,
        authRequest: authQr,
      })
      .then((auth) => {
        setAuthenticated(true);
        toast.success("Auth successful");
      })
      .catch((err) => {
        toast.error("Auth failed");
      })
      .finally(() => setLoading(false));
  };

  const handleCredential = async () => {
    if (!did) throw new Error("No did");
    if (!credentialQr) throw new Error("No credentialQr");

    setLoading(true);

    wallet.data
      ?.handleCredentialOffer({
        userDID: did,
        credentialQrOffer: credentialQr,
      })
      .then((cred) => {
        toast.success("Credential stored");
        queryClient.invalidateQueries(["useGetPolygonIdVcs"]);
      })
      .catch((err) => {
        toast.error("Credential failed");
      })
      .finally(() => {
        setLoading(false);
        if (close) close();
      });
  };

  useEffect(() => {
    if (!isOpen) {
      setAuthenticated(false);
      setAuthQr("");
      setCredentialQr("");
    }
  }, [authenticated, isOpen]);

  return (
    <div className="w-full">
      <div className="text-lg font-bold">Polygon-id</div>
      {!authenticated ? (
        <div className="flex gap-2 my-6">
          <input
            placeholder="Enter authentication string"
            className="input input-bordered input-accent w-full bg-white text-black"
            type={"text"}
            value={authQr}
            onChange={(e) => setAuthQr(e.target.value)}
          />
          {!loading ? (
            <button
              className={"btn btn-primary text-white"}
              onClick={handleAuth}
            >
              Connect
            </button>
          ) : (
            <button className="btn">
              <span className="loading loading-spinner btn-neutral text-white"></span>
              loading
            </button>
          )}
        </div>
      ) : (
        <div className="flex gap-2 my-6">
          <input
            placeholder="Enter credential string"
            className="input input-bordered input-accent w-full bg-white text-black"
            type={"text"}
            value={credentialQr}
            onChange={(e) => setCredentialQr(e.target.value)}
          />
          {!loading ? (
            <button
              className={"btn btn-primary text-white"}
              onClick={handleCredential}
            >
              Get
            </button>
          ) : (
            <button className="btn">
              <span className="loading loading-spinner btn-neutral text-white"></span>
              loading
            </button>
          )}
          {/* <div>
          {polygonIdStoredCreds.data?.map((cred) => {
            return (
              <pre key={cred.id}>
                {JSON.stringify(cred.credentialSubject, null, 2)}
              </pre>
            );
          })}
        </div> */}
        </div>
      )}
    </div>
  );
};

export default PolygonIdWallet;
