import { type IWalletConnectSession } from "@walletconnect/legacy-types";
import { type SessionTypes, type SignClientTypes } from "@walletconnect/types";
import { type Web3WalletTypes } from "@walletconnect/web3wallet";
import { create } from "zustand";

type ModalView =
  | {
      type: "SessionProposalModal";
      data: SignClientTypes.EventArguments["session_proposal"];
    }
  | {
      type: "SessionSignModal";
      data: {
        requestEvent: SignClientTypes.EventArguments["session_request"];
        requestSession: SessionTypes.Struct;
      };
    }
  | {
      type: "SessionSignTypedDataModal";
      data: {
        requestEvent: SignClientTypes.EventArguments["session_request"];
        requestSession: SessionTypes.Struct;
      };
    }
  | {
      type: "SessionSendTransactionModal";
      data: {
        requestEvent: SignClientTypes.EventArguments["session_request"];
        requestSession: SessionTypes.Struct;
      };
    }
  | {
      type: "SessionUnsuportedMethodModal";
      data: {
        requestEvent: SignClientTypes.EventArguments["session_request"];
        requestSession: SessionTypes.Struct;
      };
    }
  | {
      type: "AuthRequestModal";
      data: Web3WalletTypes.AuthRequest;
    }
  | { type: "OnConnectDappsModal" }
  | { type: "SuccessModal"; data: { title: string; subtitle: string } };

interface IModalStore {
  isOpen: boolean;
  title?: string;
  modalView?: ModalView;
  open: (props: { modalView: ModalView }) => void;
  close: () => void;
}

/**
 * Zustand Store
 */

export const useWcModalStore = create<IModalStore>((set) => ({
  isOpen: false,
  modalView: undefined,
  data: undefined,
  open: (props) => {
    set({
      isOpen: true,
      modalView: props.modalView,
    });
  },
  close: () => {
    set({
      isOpen: false,
      modalView: undefined,
    });
  },
}));
