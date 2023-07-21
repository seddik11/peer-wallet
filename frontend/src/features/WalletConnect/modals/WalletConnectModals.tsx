import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { shallow } from "zustand/shallow";

import AuthRequestModal from "./AuthRequestModal";
import { OnConnectDappsModal } from "./OnConnectDappsModal";
import SessionProposalModal from "./SessionProposalModal/SessionProposalModal";
import SessionSendTransactionModal from "./SessionSendTransactionModal";
import SessionSignModal from "./SessionSignModal";
import SessionSignTypedDataModal from "./SessionSignTypedDataModal";
import SessionUnsuportedMethodModal from "./SessionUnsuportedMethodModal";

export const WalletConnectModals = () => {
  const { modalView, isOpen, close } = useWcModalStore(
    (state) => ({
      modalView: state.modalView,
      isOpen: state.isOpen,
      close: state.close,
    }),
    shallow
  );

  if (!isOpen) return null;
  return (
    <div>
      {modalView?.type === "OnConnectDappsModal" && <OnConnectDappsModal />}
      {modalView?.type === "SessionProposalModal" && <SessionProposalModal />}
      {modalView?.type === "SessionSignModal" && <SessionSignModal />}
      {modalView?.type === "SessionSignTypedDataModal" && (
        <SessionSignTypedDataModal />
      )}
      {modalView?.type === "SessionSendTransactionModal" && (
        <SessionSendTransactionModal />
      )}
      {modalView?.type === "SessionUnsuportedMethodModal" && (
        <SessionUnsuportedMethodModal />
      )}
      {modalView?.type === "AuthRequestModal" && <AuthRequestModal />}
    </div>
  );
};
