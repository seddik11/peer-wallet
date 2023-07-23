import { useEffect, useState } from "react";
import Card from "./Card";
import { SismoButton } from "@/features/sismo";
import { useCredentialsStore } from "@/store/credentials";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import truncateAddress from "@/utils/truncateAddress";
import PolygonIdWallet from "@/pages/polygon-id";
import { usePolygonIdStoredCreds } from "@/features/polygon-id/usePolygonId";

const Credentials = () => {
  const [openModal, setOpenModal] = useState<string>();
  const { sismoProof } = useCredentialsStore();

  const polygonIdStoredCreds = usePolygonIdStoredCreds();

  const polygonCredentials =
    polygonIdStoredCreds.data?.filter(
      ({ type }) => !type.includes("AuthBJJCredential")
    ) || [];

  return (
    <>
      <div>
        <div>Credentials</div>
        <div className="mt-2 gap-4 flex flex-col">
          <Card>
            {sismoProof ? (
              <div className="flex gap-4 items-center">
                <div className="text-green-300 w-12">
                  <CheckCircleIcon />
                </div>
                <div className="flex-1">
                  <div className="font-bold">
                    Verify NOUN DAO membership succesfully
                  </div>
                  <div>{truncateAddress(sismoProof)}</div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg text-center">
                  Verify NOUN DAO membership
                </div>
                <div
                  className="btn btn-primary text-white"
                  onClick={() => setOpenModal("sismo")}
                >
                  Add Sismo proof
                </div>
              </>
            )}
          </Card>
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
                </Card>
              ))}

              <div
                className="btn btn-primary text-white m-auto"
                onClick={() => setOpenModal("polygon")}
              >
                Add residency verification
              </div>
            </>
          ) : (
            <Card>
              <div className="text-lg text-center">Verify your residency</div>

              <div
                className="btn btn-primary text-white"
                onClick={() => setOpenModal("polygon")}
              >
                Add Polygon credentials
              </div>
            </Card>
          )}
        </div>
      </div>
      <div className={`modal ${openModal === "sismo" && "modal-open"}`}>
        <div className="modal-box w-11/12 max-w-xl bg-white text-black flex items-center flex-col">
          <SismoButton />

          <button
            className="btn btn-neutral w-full mt-4"
            onClick={() => setOpenModal("")}
          >
            Close
          </button>
        </div>
      </div>

      <div className={`modal ${openModal === "polygon" && "modal-open"}`}>
        <div className="modal-box w-11/12 max-w-xl bg-white text-black flex items-center flex-col">
          <PolygonIdWallet
            isOpen={openModal === "polygon"}
            close={() => setOpenModal("")}
          />

          <button
            className="btn btn-neutral w-full"
            onClick={() => setOpenModal("")}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Credentials;
