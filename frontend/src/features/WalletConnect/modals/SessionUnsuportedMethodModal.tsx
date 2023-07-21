import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

import { RequesDetailsCard } from "../components/RequestDetalilsCard";
import { BaseSessionModal } from "./BaseSessionModal";

export default function SessionUnsuportedMethodModal() {
  // Get request and wallet data from store
  const requestEvent = useWcModalStore((state) => state.data?.requestEvent);
  const requestSession = useWcModalStore((state) => state.data?.requestSession);
  const closeModal = useWcModalStore((state) => state.close);

  // Ensure request and wallet are defined
  if (!requestEvent || !requestSession) {
    return <p>Missing request data</p>;
  }

  // Get required request data
  const { params } = requestEvent;
  const { chainId, request } = params;

  const getContentPopup = () => {
    return (
      <div className="zero:pl-0 2md:pl-3 flex w-full flex-col justify-between">
        <div className="bg-background mb-5 mt-10 rounded-lg p-4">
          <RequesDetailsCard
            chains={[chainId]}
            protocol={requestSession.relay.protocol}
            method={request.method}
          />
        </div>
      </div>
    );
  };

  return (
    <BaseSessionModal
      childen={getContentPopup()}
      action={"Unsupported Method"}
      message={"The method is not supported"}
      onReject={closeModal}
    />
  );
}
