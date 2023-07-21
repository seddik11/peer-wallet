import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

import {
  approveEIP155Request,
  rejectEIP155Request,
} from "../Eip155RequestHandlerUtil";
import { getSignTypedDataParamsData } from "../HelperUtil";
import { web3wallet } from "../WalletConnectUtils";
import { RequesDetailsCard } from "../components/RequestDetalilsCard";
import { BaseSessionModal } from "./BaseSessionModal";

export default function SessionSignTypedDataModal() {
  const { close, modalView } = useWcModalStore((state) => {
    return {
      close: state.close,
      modalView: state.modalView,
    };
  });

  if (modalView?.type !== "SessionSignTypedDataModal" || !modalView)
    throw new Error("Invalid modal type");
  // Get required request data
  const { topic, params } = modalView.data.requestEvent;
  const { request, chainId } = params;

  // Get data
  const data = getSignTypedDataParamsData(request.params);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (modalView?.type !== "SessionSignTypedDataModal") return;
    const response = await approveEIP155Request(modalView?.data.requestEvent);
    await web3wallet.respondSessionRequest({
      topic,
      response,
    });
    close();
  }

  // Handle reject action
  async function onReject() {
    if (modalView?.type !== "SessionSignTypedDataModal") return;
    if (modalView?.data.requestEvent) {
      const response = rejectEIP155Request(modalView?.data.requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      close();
    }
  }

  const getContentPopup = () => {
    return (
      <div className="zero:pl-0 2md:pl-3 flex w-full flex-col justify-between">
        <div className="bg-background mb-5 mt-10 rounded-lg p-4">
          <RequesDetailsCard
            chains={[chainId]}
            protocol={modalView.data.requestSession.relay.protocol}
            method={request.method}
            // @ts-ignore
            data={data}
          />
        </div>
      </div>
    );
  };

  return (
    <BaseSessionModal
      childen={getContentPopup()}
      action={"Sign Typed Data"}
      message={`You are about to sign a message with your Smart Wallet to ${
        modalView.data.requestSession.peer.metadata.url ?? "Unknow Site"
      }`}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
}
