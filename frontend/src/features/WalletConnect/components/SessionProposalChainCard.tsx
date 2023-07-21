import { Fragment } from "react";
import { type ProposalTypes } from "@walletconnect/types";

import { EIP155_MAINNET_CHAINS, EIP155_TEST_CHAINS } from "../EIP155Data";
import { formatChainName } from "../HelperUtil";
import ChainCard from "./ChainCard";

/**
 * Utilities
 */
const CHAIN_METADATA = {
  ...EIP155_MAINNET_CHAINS,
  ...EIP155_TEST_CHAINS,
};

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const rgb = CHAIN_METADATA[chainId]?.rgb;

        return (
          <ChainCard
            key={chainId}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            rgb={rgb ?? ""}
            flexDirection="col"
            alignItems="flex-start"
          >
            <p>{formatChainName(chainId)}</p>
            <div color={"flex flex-col"}>
              <h6>Methods</h6>
              <p>{allMethods.length ? allMethods.join(", ") : "-"}</p>
            </div>
            <div color={"flex flex-col"}>
              <h6>Events</h6>
              <p>{allEvents.length ? allEvents.join(", ") : "-"}</p>
            </div>
          </ChainCard>
        );
      })}
    </Fragment>
  );
}
