import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { shallow } from "zustand/shallow";

import AuthRequestModal from "./AuthRequestModal";
import { OnConnectDappsModal } from "./OnConnectDappsModal";
import SessionProposalModal from "./SessionProposalModal";
import SessionSendTransactionModal from "./SessionSendTransactionModal";
import SessionSignModal from "./SessionSignModal";
import SessionSignTypedDataModal from "./SessionSignTypedDataModal";
import SessionUnsuportedMethodModal from "./SessionUnsuportedMethodModal";

export const WalletConnectModals = () => {
  const { view, isOpen, close } = useWcModalStore(
    (state) => ({
      view: state.view,
      isOpen: state.isOpen,
      close: state.close,
    }),
    shallow
  );

  if (!isOpen) return null;
  return (
    <div>
      {view === "OnConnectDappsModal" && <OnConnectDappsModal />}
      {view === "SessionProposalModal" && <SessionProposalModal />}
      {view === "SessionSignModal" && <SessionSignModal />}
      {view === "SessionSignTypedDataModal" && <SessionSignTypedDataModal />}
      {view === "SessionSendTransactionModal" && (
        <SessionSendTransactionModal />
      )}
      {view === "SessionUnsuportedMethodModal" && (
        <SessionUnsuportedMethodModal />
      )}
      {view === "AuthRequestModal" && <AuthRequestModal />}
    </div>
  );
};
