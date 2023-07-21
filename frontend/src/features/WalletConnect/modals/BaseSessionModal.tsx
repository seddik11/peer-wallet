import { type ReactNode } from "react";
import Image from "next/image";

interface IBaseSesionModal {
  action?: string;
  message?: string;
  isApproveBtn?: boolean;
  onApprove?: () => void | Promise<void>;
  onReject: () => void | Promise<void>;
  childen: ReactNode;
  approveDisabled?: boolean;
}

export function BaseSessionModal(props: IBaseSesionModal) {
  return (
    <div className="flex flex-col h-full max-h-[90vh] justify-between">
      {props.action && (
        <div className="zero:hidden 2md:block">
          <div className="bg-web-background flex h-full max-w-[487px] flex-col justify-between overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-2 rounded-2xl p-6">
              <div className="text-2xl font-bold">{props.action}</div>
              <div>{props.message}</div>
            </div>
            <Image
              src="/connectSiteBg.svg"
              alt=""
              width={32}
              height={32}
              className="rounded-2xl"
            />
          </div>
        </div>
      )}

      <div className="flex w-full flex-col justify-between">
        {props.childen}

        <div className="flex flex-col items-center justify-between gap-3">
          {props.onApprove && (
            <button
              className={"btn btn-primary"}
              onClick={props.onApprove}
              disabled={props.approveDisabled}
            >
              Approve
            </button>
          )}

          <button onClick={props.onReject} className="btn btn-ghost">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
