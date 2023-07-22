import { useState } from "react";
import Card from "./Card";
import { SismoButton } from "@/features/sismo";
import { useCredentialsStore } from "@/store/credentials";

import { BeakerIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import truncateAddress from "@/utils/truncateAddress";

const Credentials = () => {
  const polygonCredentials = false;

  const [openModal, setOpenModal] = useState<string>();
  const { sismoProof } = useCredentialsStore();

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
                  <div className="font-bold">Sismo proof</div>
                  <div>{truncateAddress(sismoProof)}</div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg text-center">No Sismo proof</div>
                <div
                  className="btn btn-primary text-white"
                  onClick={() => setOpenModal("sismo")}
                >
                  Add Sismo proof
                </div>
              </>
            )}
          </Card>
          {polygonCredentials ? (
            <Card />
          ) : (
            <Card>
              <div className="text-lg text-center">No Polygon credentials</div>
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
          Polygon Modal
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
