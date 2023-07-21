import { useCallback, useEffect } from "react";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { type SignClientTypes } from "@walletconnect/types";
import { type Web3WalletTypes } from "@walletconnect/web3wallet";

import { EIP155_SIGNING_METHODS } from "../EIP155Data";
import { web3wallet } from "../WalletConnectUtils";

export const useWalletConnectEventsManager = (initialized: boolean) => {
  const openModal = useWcModalStore((state) => state.open);
  /******************************************************************************
   * 1. Open session proposal modal for confirmation / rejection
   *****************************************************************************/
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      openModal({
        modalView: {
          type: "SessionProposalModal",
          data: proposal,
        },
      });
    },
    [openModal]
  );

  const onAuthRequest = useCallback(
    (request: Web3WalletTypes.AuthRequest) => {
      openModal({
        modalView: {
          data: request,
          type: "AuthRequestModal",
        },
      });
    },
    [openModal]
  );

  /******************************************************************************
   * 3. Open request handling modal based on method that was used
   *****************************************************************************/
  const onSessionRequest = useCallback(
    (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      console.log("session_request", requestEvent);
      const { topic, params } = requestEvent;
      const { request } = params;
      // const requestSession = signClient.session.get(topic)
      const requestSession = web3wallet.engine.signClient.session.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return openModal({
            modalView: {
              type: "SessionSignModal",
              data: requestEvent,
            },
          });

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return openModal({
            modalView: {
              type: "SessionSignTypedDataModal",
              data: requestSession,
            },
          });

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          return openModal({
            modalView: {
              type: "SessionSendTransactionModal",
              data: requestSession,
            },
          });

        default:
          return openModal({
            modalView: {
              type: "SessionUnsuportedMethodModal",
              data: requestEvent,
            },
          });
      }
    },
    [openModal]
  );

  /******************************************************************************
   * Set up WalletConnect event listeners
   *****************************************************************************/
  useEffect(() => {
    if (initialized) {
      // sign
      // @ts-ignore
      web3wallet.on("session_proposal", onSessionProposal);
      // @ts-ignore
      web3wallet.on("session_request", onSessionRequest);
      // auth
      web3wallet.on("auth_request", onAuthRequest);

      // TODOs
      // signClient.on('session_ping', data => console.log('ping', data))
      // signClient.on('session_event', data => console.log('event', data))
      // signClient.on('session_update', data => console.log('update', data))
      // signClient.on('session_delete', data => console.log('delete', data))
    }
  }, [initialized, onSessionProposal, onSessionRequest, onAuthRequest]);
};
