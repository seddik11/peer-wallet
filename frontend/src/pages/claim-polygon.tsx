import {
  usePolygonIdStoredCreds,
  usePolygonIdWallet,
} from "@/features/polygon-id/usePolygonId";
import Card from "@/components/Card";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { usePolygonIdMinter } from "@/features/polygon-id/usePolygonIdMinter";
import truncateAddress from "@/utils/truncateAddress";
import dynamic from "next/dynamic";

export const PolygonIdWallet2 = (props: {
  isOpen: boolean;
  close: () => void;
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address") || "";

  const { wallet } = usePolygonIdWallet();
  const polygonIdStoredCreds = usePolygonIdStoredCreds();

  const { submitProof, values } = usePolygonIdMinter();

  const polygonCredentials =
    polygonIdStoredCreds.data?.filter(
      ({ type }) => !type.includes("AuthBJJCredential")
    ) || [];

  const submitApproval = async () => {
    submitProof.mutate({ address });
  };

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="App min-h-screen">
      <div className="flex flex-col w-full p-10">
        <div className="text-lg  text-center font-bold">
          Polygon credentials
        </div>

        <div className="gap-2 my-6 grid grid-cols-3">
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

                  {submitProof.data?.transactionHash ? (
                    <div className="text-center mt-4">
                      <div>Transaction hash: </div>
                      <div>
                        <a
                          className="link"
                          target="_blank"
                          href={`https://mumbai.polygonscan.com/tx/${submitProof.data?.transactionHash}`}
                        >
                          {truncateAddress(submitProof.data?.transactionHash)}
                        </a>
                      </div>
                    </div>
                  ) : submitProof.isLoading ? (
                    <button className="btn">
                      <span className="loading loading-spinner btn-neutral text-white"></span>
                      loading
                    </button>
                  ) : (
                    <button
                      className={"btn text-white"}
                      onClick={submitApproval}
                    >
                      Approve
                    </button>
                  )}
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <div className="text-lg text-center">No Polygon credentials</div>
            </Card>
          )}
        </div>
        {submitProof.data?.transactionHash && (
          <button
            className={"btn btn-primary text-white"}
            onClick={handleClose}
          >
            Close page
          </button>
        )}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(PolygonIdWallet2), {
  ssr: false,
});
