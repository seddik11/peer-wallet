import {
  usePolygonIdStoredCreds,
  usePolygonIdWallet,
} from "@/features/polygon-id/usePolygonId";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export const PolygonIdWallet = () => {
  const { wallet, handleAuthQrOffer, handleCredentialQrOffer } =
    usePolygonIdWallet();

  const [authQr, setAuthQr] = useState<string>();
  const [credentialQr, setCredentialQr] = useState<string>();

  const polygonIdStoredCreds = usePolygonIdStoredCreds();
  const queryClient = useQueryClient();

  const did = wallet.data?.did;

  return (
    <div>
      <h1>PolygonId</h1>
      <p>{did?.toString()}</p>
      <div>
        Auth:{" "}
        <div>
          <input
            className={"w-full input"}
            type={"text"}
            id={"authQr"}
            onChange={(e) => setAuthQr(e.target.value)}
          />
          <button
            className={"btn"}
            onClick={async () => {
              if (!did) throw new Error("No did");
              if (!authQr) throw new Error("No authQr");
              wallet.data
                ?.handleAuthOffer({
                  did: did,
                  authRequest: authQr,
                })
                .then((auth) => {
                  toast.success("Auth successful");
                })
                .catch((err) => {
                  toast.error("Auth failed");
                });
            }}
          >
            Connect
          </button>
        </div>
      </div>
      <div>
        <input
          className={"w-full input"}
          type={"text"}
          id={"credentialQr"}
          onChange={(e) => setCredentialQr(e.target.value)}
        />
        <button
          className={"btn"}
          onClick={async () => {
            if (!did) throw new Error("No did");
            if (!credentialQr) throw new Error("No credentialQr");
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
              });
          }}
        >
          Get
        </button>

        <div>
          {polygonIdStoredCreds.data?.map((cred) => {
            return (
              <pre key={cred.id}>
                {JSON.stringify(cred.credentialSubject, null, 2)}
              </pre>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PolygonIdWallet;
