import { CodeBlock, codepen } from "react-code-blocks";
import { EIP155_CHAINS, type TEIP155Chain } from "../EIP155Data";

interface IRequesDetailsCard {
  chains: string[];
  protocol: string;
  message?: string;
  method?: string;
  data?: {
    name?: string;
  };
}

export function RequesDetailsCard(props: IRequesDetailsCard) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3 text-[14px]">
        <div className="flex items-center gap-3">
          <div>Blockchain</div>
        </div>
        <div>
          {props.chains
            .map((chain) => EIP155_CHAINS[chain as TEIP155Chain]?.name ?? chain)
            .join(", ")}
        </div>
      </div>

      {props.protocol && (
        <div className="flex items-center justify-between gap-3 text-[14px]">
          <div className="flex items-center gap-3">
            <div className="text-[green]">Relay Protocoll</div>
          </div>
          <div>
            {props.protocol === "wc" && (
              <div className="flex gap-3">Wallet Connect</div>
            )}
            {props.protocol !== "wc" && (
              <div className="flex gap-3">{props.protocol}</div>
            )}
          </div>
        </div>
      )}

      {props.message && (
        <div className="flex items-start justify-between gap-3 text-[14px]">
          <div className="flex items-center gap-3 text-[#5f606c]">
            <div>Message</div>
          </div>
          <p className="w-1/2">{props.message}</p>
        </div>
      )}

      {props.method && (
        <div className="flex items-center justify-between gap-3 text-[14px]">
          <div className="flex items-center gap-3 text-[#5f606c]">
            <div>Method</div>
          </div>
          <div>{props.method}</div>
        </div>
      )}

      {props.data && (
        <div className="flex flex-col gap-3  text-[14px]">
          <div className="flex items-center gap-3 text-[#5f606c]">
            <div>Data</div>
          </div>
          <CodeBlock
            showLineNumbers={false}
            wrapLongLines={true}
            startingLineNumber={0}
            text={JSON.stringify(props.data, null, 2)}
            language="json"
          />
        </div>
      )}
    </div>
  );
}
