import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

import { RequesDetailsCard } from "../components/RequestDetalilsCard";
import { BaseSessionModal } from "./BaseSessionModal";

export default function SessionUnsuportedMethodModal() {
  const { close, modalView } = useWcModalStore((state) => {
    return {
      close: state.close,
      modalView: state.modalView,
    };
  });

  if (modalView?.type !== "SessionUnsuportedMethodModal" || !modalView)
    throw new Error("Invalid modal type");
  // Get required request data
  const { params } = modalView.data.requestEvent;
  const { chainId, request } = params;

  const getContentPopup = () => {
    return (
      <div className="zero:pl-0 2md:pl-3 flex w-full flex-col justify-between">
        <div className="bg-background mb-5 mt-10 rounded-lg p-4">
          <RequesDetailsCard
            chains={[chainId]}
            protocol={modalView.data.requestSession.relay.protocol}
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
      onReject={close}
    />
  );
}
