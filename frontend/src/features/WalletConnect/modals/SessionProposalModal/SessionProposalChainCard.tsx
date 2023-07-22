import { Fragment } from "react";
import { type ProposalTypes } from "@walletconnect/types";

import ChainCard from "@/features/WalletConnect/components/ChainCard";
import { formatChainName } from "@/features/WalletConnect/HelperUtil";
import { EIP155_CHAINS } from "@/features/WalletConnect/EIP155Data";

/**
 * Types
 */
interface IProps {
  requiredNamespace: ProposalTypes.RequiredNamespace;
}

/**
 * Component
 */
export function SessionProposalChainCard({ requiredNamespace }: IProps) {
  return (
    <Fragment>
      {requiredNamespace.chains?.map((chainId) => {
        const extensionMethods: ProposalTypes.RequiredNamespace["methods"] = [];
        const extensionEvents: ProposalTypes.RequiredNamespace["events"] = [];

        const allMethods = [...requiredNamespace.methods, ...extensionMethods];
        const allEvents = [...requiredNamespace.events, ...extensionEvents];
        // @ts-expect-error(80001) - chainId is a number
        const rgb = EIP155_CHAINS[chainId]?.rgb;

        return (
          <ChainCard
            key={chainId}
            rgb={rgb ?? ""}
            flexDirection="col"
            alignItems="flex-start"
          >
            <p className="text-center">{formatChainName(chainId)}</p>
          </ChainCard>
        );
      })}
    </Fragment>
  );
}
