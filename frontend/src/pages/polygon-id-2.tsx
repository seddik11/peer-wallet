import {
  usePolygonIdStoredCreds,
  usePolygonIdWallet,
} from "@/features/polygon-id/usePolygonId";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Card from "@/components/Card";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { usePolygonIdMinter } from "@/features/polygon-id/usePolygonIdMinter";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";

export const PolygonIdWallet2 = (props: {
  isOpen: boolean;
  close: () => void;
}) => {
  const [openModal, setOpenModal] = useState<string>();
  const burnerWallet = useBurnerWalletStore((state) => state.burnerWallets[0]);
  console.log("burnerWallet", burnerWallet);
  const { isOpen, close } = props;
  const { wallet } = usePolygonIdWallet();
  const polygonIdStoredCreds = usePolygonIdStoredCreds();
  const [authenticated, setAuthenticated] = useState<any>();
  const [authQr, setAuthQr] = useState<string>("");
  const [credentialQr, setCredentialQr] = useState<string>("");
  const { submitProof, values } = usePolygonIdMinter();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const did = wallet.data?.did;

  const polygonCredentials =
    polygonIdStoredCreds.data?.filter(
      ({ type }) => !type.includes("AuthBJJCredential")
    ) || [];

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
      <div className="flex gap-2 my-6">
        <input
          placeholder="Enter authentication string"
          className="input input-bordered input-accent w-full bg-white text-black"
          type={"text"}
          value={authQr}
          onChange={(e) => setAuthQr(e.target.value)}
        />
        {!loading ? (
          <button className={"btn btn-primary text-white"} onClick={handleAuth}>
            Connect
          </button>
        ) : (
          <button className="btn">
            <span className="loading loading-spinner btn-neutral text-white"></span>
            loading
          </button>
        )}
      </div>
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
        {polygonCredentials.length > 0 ? (
          <>
            {polygonCredentials.map((cred) => (
              <Card key={cred.id}>
                <div className="flex gap-4 items-center">
                  <div className="text-green-300 w-12">
                    <CheckCircleIcon />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">
                      {cred.credentialSubject.type as string}
                    </div>
                    <div>
                      {cred.credentialSubject.birthday as string}
                      {cred.credentialSubject.countryCode as string}
                    </div>
                  </div>
                </div>
                <button
                  className={"btn"}
                  onClick={() => submitProof.mutate({ address: "" })}
                >
                  <span className="btn-neutral text-white"></span>
                  Submit
                </button>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <div className="text-lg text-center">No Polygon credentials</div>

            <div>
              {polygonIdStoredCreds.data?.map((cred) => {
                return (
                  <pre key={cred.id}>
                    {JSON.stringify(cred.credentialSubject, null, 2)}
                  </pre>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PolygonIdWallet2;
