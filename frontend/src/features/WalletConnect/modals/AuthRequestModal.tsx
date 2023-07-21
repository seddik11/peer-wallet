import { Fragment } from "react";
import {
  eip155Addresses,
  eip155Wallets,
} from "@/features/WalletConnect/Eip155WalletUtil";
import { useSettingsStore } from "@/features/WalletConnect/hooks/useSettingsStore";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { getSdkError } from "@walletconnect/utils";

import { web3wallet } from "../WalletConnectUtils";
import { RequestModalContainer } from "./RequestModalContainer";

export default function AuthRequestModal() {
  const { account } = useSettingsStore();
  const { modalView, close } = useWcModalStore();
  console.log("modal data", modalView?.data, account);

  if (modalView?.type !== "AuthRequestModal")
    throw new Error("Invalid modal type");
  // Get request and wallet data from store
  const request = modalView?.data;

  // Ensure request and wallet are defined
  if (!request) {
    return <p>Missing request data</p>;
  }

  const address = eip155Addresses[account];
  const iss = `did:pkh:eip155:1:${address}`;

  // Get required request data
  const { params } = request;

  const message = web3wallet.formatMessage(params.cacaoPayload, iss);

  // Handle approve action (logic varies based on request method)
  async function onApprove() {
    if (request && address) {
      const signature = await eip155Wallets[address]?.signMessage(message);
      if (!signature) throw new Error("Failed to sign message");
      await web3wallet.respondAuthRequest(
        {
          id: request.id,
          signature: {
            s: signature,
            t: "eip191",
          },
        },
        iss
      );
      close();
    }
  }

  // Handle reject action
  async function onReject() {
    if (request) {
      await web3wallet.respondAuthRequest(
        {
          id: request.id,
          error: getSdkError("USER_REJECTED"),
        },
        iss
      );
      close();
    }
  }
  return (
    <Fragment>
      <RequestModalContainer title="Auth Message">
        <hr />
        <div className={"flex flex-col"}>
          <div>
            <h1>Message</h1>
            <div>
              <p>{message}</p>
            </div>
          </div>
        </div>
        <hr />
      </RequestModalContainer>

      <div>
        <button className="btn btn-accent" onClick={onReject}>
          Reject
        </button>
        <button className="btn btn-primary" onClick={onApprove}>
          Approve
        </button>
      </div>
    </Fragment>
  );
}
