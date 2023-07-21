import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

import {
  approveEIP155Request,
  rejectEIP155Request,
} from "../Eip155RequestHandlerUtil";
import { web3wallet } from "../WalletConnectUtils";
import { RequesDetailsCard } from "../components/RequestDetalilsCard";
import { BaseSessionModal } from "./BaseSessionModal";

export default function SessionSendTransactionModal() {
  // Get request and wallet data from store
  const modalView = useWcModalStore((state) => state.modalView);
  const closeModal = useWcModalStore((state) => state.close);

  // Ensure request and wallet are defined
  if (!modalView) {
    return <p>Missing request data</p>;
  }

  // Get required proposal data
  if (modalView.type !== "SessionSendTransactionModal")
    throw new Error("Invalid modal type");

  const { topic, params } = modalView.data.requestEvent;
  const { request, chainId } = params;
  const transaction = request.params[0];

  // Handle approve action
  async function onApprove() {
    if (modalView?.type !== "SessionSendTransactionModal") return;
    if (modalView?.data.requestEvent) {
      const response = await approveEIP155Request(modalView.data.requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      closeModal();
    }
  }

  // Handle reject action
  async function onReject() {
    if (modalView?.type !== "SessionSendTransactionModal") return;
    const response = rejectEIP155Request(modalView.data.requestEvent);
    await web3wallet.respondSessionRequest({
      topic,
      response,
    });
    closeModal();
  }

  const getContentPopup = () => {
    return (
      <div className="zero:pl-0 2md:pl-3 flex w-full flex-col justify-between">
        <div className="bg-background mb-5 mt-10 rounded-lg p-4">
          {modalView.data.requestSession?.relay.protocol && (
            <RequesDetailsCard
              chains={[chainId]}
              protocol={modalView.data.requestSession?.relay.protocol}
              method={request.method}
              data={transaction}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <BaseSessionModal
      childen={getContentPopup()}
      action={"Sign Transaction"}
      message={`You are about to sign a message with your Smart Wallet to ${
        modalView.data.requestSession?.peer.metadata.url ?? "Unknow Site"
      }`}
      onApprove={onApprove}
      onReject={onReject}
    ></BaseSessionModal>
  );
}
