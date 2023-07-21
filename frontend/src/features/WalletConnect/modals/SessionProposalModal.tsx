import { Fragment, useState } from "react";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";
import { type SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { eip155Addresses } from "../Eip155WalletUtil";
import { isEIP155Chain } from "../HelperUtil";
import { web3wallet } from "../WalletConnectUtils";
import { ProjectInfoCard } from "../components/ProjectInfoCard";
import { ProposalSelectSection } from "../components/ProposalSelectSection";
import { SessionProposalChainCard } from "../components/SessionProposalChainCard";
import { RequestModalContainer } from "./RequestModalContainer";

const SessionProposalModal = () => {
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string[]>
  >({});
  const hasSelected = Object.keys(selectedAccounts).length;

  // Get proposal data and wallet address from store
  const { closeModal, modalView } = useWcModalStore((state) => {
    return {
      closeModal: state.close,
      modalView: state.modalView,
    };
  });

  if (modalView?.type !== "SessionProposalModal")
    throw new Error("Invalid modal type");

  // Ensure proposal is defined
  if (!modalView?.data) {
    return <p>Missing proposal data</p>;
  }

  // Get required proposal data
  const { id, params } = modalView?.data;
  const { proposer, requiredNamespaces, relays } = params;

  // Add / remove address from EIP155 selection
  function onSelectAccount(chain: string, account: string) {
    if (selectedAccounts[chain]?.includes(account)) {
      const newSelectedAccounts =
        selectedAccounts[chain]?.filter((a) => a !== account) ?? [];
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: newSelectedAccounts,
      }));
    } else {
      const prevChainAddresses = selectedAccounts[chain] ?? [];
      setSelectedAccounts((prev) => ({
        ...prev,
        [chain]: [...prevChainAddresses, account],
      }));
    }
  }

  // Hanlde approve action, construct session namespace
  function onApprove() {
    if (modalView?.type === "SessionProposalModal") {
      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach((key) => {
        const accounts: string[] = [];
        requiredNamespaces[key]?.chains?.map((chain) => {
          selectedAccounts[key]?.map((acc) => accounts.push(`${chain}:${acc}`));
        });
        namespaces[key] = {
          accounts,
          // @ts-ignore
          methods: requiredNamespaces[key].methods,
          // @ts-ignore
          events: requiredNamespaces[key].events,
        };
      });

      void web3wallet.approveSession({
        id,
        relayProtocol: relays[0]?.protocol,
        namespaces,
      });
    }
    closeModal();
  }

  // Handle reject action
  function onReject() {
    if (modalView?.type === "SessionProposalModal") {
      void web3wallet.rejectSession({
        id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
    }
    closeModal();
  }

  return (
    <Fragment>
      <RequestModalContainer title="Session Proposal">
        <ProjectInfoCard metadata={proposer.metadata} />

        {/* TODO(ilja) Relays selection */}

        <hr />

        {Object.keys(requiredNamespaces)
          .filter((chain) => {
            if (!!requiredNamespaces[chain]) return true;
          })
          .map((chain) => {
            return (
              <Fragment key={chain}>
                <p>{`Review ${chain} permissions`}</p>
                <SessionProposalChainCard
                  // @ts-ignore
                  requiredNamespace={requiredNamespaces[chain]}
                />
                {isEIP155Chain(chain) && (
                  <ProposalSelectSection
                    addresses={eip155Addresses}
                    selectedAddresses={selectedAccounts[chain]}
                    onSelect={onSelectAccount}
                    chain={chain}
                  />
                )}
              </Fragment>
            );
          })}
      </RequestModalContainer>

      <div>
        <button className="btn btn-accent" onClick={onReject}>
          <>Reject</>
        </button>

        <button className="btn btn-primary" onClick={onApprove}>
          <>Approve</>
        </button>
      </div>
    </Fragment>
  );
};

export default SessionProposalModal;
