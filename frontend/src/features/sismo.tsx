import {
  AuthType,
  SismoConnectButton,
  SismoConnectConfig,
} from "@sismo-core/sismo-connect-react";
import { encodeAbiParameters } from "viem";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import { useState } from "react";

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xf4977993e52606cfd67b7a1cde717069",
  vault: {
    // For development purposes
    // insert any account that you want to impersonate  here
    // Never use this in production
    impersonate: [
      "leo21.sismo.eth",
      "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
      "0x1b9424ed517f7700e7368e34a9743295a225d889",
      "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
      "0xc281bd4db5bf94f02a8525dca954db3895685700",
      "twitter:leo21_eth",
      "github:leo21",
    ],
  },
};

export const signMessage = (address: `0x${string}` | undefined) => {
  return encodeAbiParameters(
    [{ type: "address", name: "airdropAddress" }],
    [address as `0x${string}`]
  );
};

export const SismoButton = () => {
  const [sismoResponse, setSismoResponse] = useState<string>("");
  const wallet = useBurnerWalletStore((s) => s.activeBurnerWallet);
  if (!wallet) return <div>Select active wallet before using sismo</div>;
  return (
    <>
      <SismoConnectButton
        // the client config created
        config={sismoConnectConfig}
        // the auth request we want to make
        // here we want the proof of a Sismo Vault ownership from our users
        auths={[{ authType: AuthType.VAULT }]}
        // we ask the user to sign a message
        // it will be used onchain to prevent frontrunning
        signature={{ message: signMessage(wallet?.address as `0x${string}`) }}
        // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
        onResponseBytes={(responseBytes: string) => {
          console.log("hello simsmo", responseBytes);
          setSismoResponse(responseBytes);
        }}
        // Some text to display on the button
        text={"Claim with Sismo"}
      />
      <div>
        <pre>{JSON.stringify(sismoResponse, null, 2)}</pre>
      </div>
    </>
  );
};
