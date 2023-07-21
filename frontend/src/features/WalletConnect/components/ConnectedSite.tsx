import { type IWalletConnectionSession } from "@/features/WalletConnect/hooks/useConnectionSiteStore";
import React from "react";

export const ConnectedSite = (props: {
  connection: IWalletConnectionSession;
  removeConnection: (clientId: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex gap-3">
        {props.connection.peerMeta.icons.length > 0 && (
          <img
            src={props.connection.peerMeta.icons[0]}
            alt="site"
            width={34}
            height={34}
          />
        )}

        {!props.connection.peerMeta.icons.length && "unknown"}

        <div className="">
          <div>{props.connection.peerMeta.name || "Unknown Site"} </div>
          <div className="text-[14px] text-[#9296ad]">
            {props.connection.peerMeta.url}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex h-6 items-center justify-center gap-2 rounded-3xl border-[1px] border-solid border-green-200 bg-green-300 p-3">
          <div className="zero:hidden 2md:block text-green-100">Connected</div>
        </div>
      </div>
    </div>
  );
};
