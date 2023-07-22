// import {
//   useAccount,
//   useConnect,
//   useDisconnect,
//   useNetwork,
//   useSwitchNetwork,
//   usePrepareContractWrite,
//   useContractWrite,
// } from "wagmi";
// import { waitForTransaction } from "@wagmi/core";
import {
  AuthType,
  SismoConnectButton,
  SismoConnectConfig,
  ClaimRequest,
} from "@sismo-core/sismo-connect-react";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import { useState } from "react";
import { useCredentialsStore } from "@/store/credentials";
import { polygonMumbai } from "wagmi/chains";
// import { abi as AirdropABI } from "../../abi/Airdrop.json";
import {
  // errorsABI,
  // formatError,
  // fundMyAccountOnLocalFork,
  signMessage,
} from "@/utils/misc";
// import { decodeEventLog, formatEther } from "viem";

const CHAIN = polygonMumbai;

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xbd06ffac2f190c04306e9f3e35bce454", //PeerWallet App
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

 export const CLAIMS: ClaimRequest[] = [
   {
     // Nouns DAO NFT
     groupId: "0xa4ff29395199edcc63221e5b9b5c202d",
     isSelectableByUser: true,
     isOptional: true,

   },
 ];

export const SismoButton = () => {
  const [sismoResponse, setSismoResponse] = useState<string>("");
  const { setSismoProof } = useCredentialsStore();
  const wallet = useBurnerWalletStore((s) => s.activeBurnerWallet);
  if (!wallet) return <div>Select active wallet before using sismo</div>;

  return (
    <>
      <div className="text-lg font-bold">Claim Sismo proof</div>
      <div className="break-all p-4 max-h-80 overflow-auto bg-slate-200 rounded-md my-5">
        {sismoResponse}
      </div>

      <SismoConnectButton
        // the client config created
        config={sismoConnectConfig}
        // the auth request we want to make
        // here we want the proof of a Sismo Vault ownership from our users
        auths={[{ authType: AuthType.VAULT }]}
        // Claims, NOUN DAO
        claims={CLAIMS}
        // we ask the user to sign a message
        // it will be used onchain to prevent frontrunning
        signature={{ message: signMessage(wallet?.address as `0x${string}`) }}
        // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
        onResponseBytes={(responseBytes: string) => {
          console.log("hello simsmo", responseBytes);
          setSismoResponse(responseBytes);
          setSismoProof(responseBytes);
        }}
        // Some text to display on the button
        text={"Claim with Sismo"}
      />
    </>
  );
};

// export const SismoClaimButton = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [amountClaimed, setAmountClaimed] = useState<string>("");
//   const [responseBytes, setResponseBytes] = useState<string>("");
//   const { address } = useAccount();

//   const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

//   const { connect, connectors, isLoading, pendingConnector } = useConnect();
//   const { disconnect } = useDisconnect();
//   const { chain } = useNetwork();

//   const contractCallInputs =
//     responseBytes && chain
//       ? {
//           address:
//             "0x784CC2d483c77C7A7CFDDC07Ff9BD350b4Dea488" as `0x${string}}`,
//           abi: [...AirdropABI, ...errorsABI],
//           functionName: "claimWithSismo",
//           args: [responseBytes],
//           chain,
//         }
//       : {};

//   const { config, error: wagmiSimulateError } =
//     usePrepareContractWrite(contractCallInputs);
//   const { writeAsync } = useContractWrite(config);

//   async function claimAirdrop() {
//     if (!address) return;
//     setError("");
//     setLoading(true);
//     try {
//       // Switch to the selected network if not already on it
//       if (chain?.id !== CHAIN.id) await switchNetworkAsync?.(CHAIN.id);

//       const tx = await writeAsync?.();

//       const txReceipt = tx && (await waitForTransaction({ hash: tx.hash }));
//       if (txReceipt?.status === "success") {
//         const mintEvent = decodeEventLog({
//           abi: AirdropABI,
//           data: txReceipt.logs[0]?.data,
//           topics: txReceipt.logs[0]?.topics,
//         });
//         const args = mintEvent?.args as {
//           value: string;
//         };
//         const ethAmount = formatEther(BigInt(args.value));
//         setAmountClaimed(ethAmount);
//       }
//     } catch (e: any) {
//       setError(formatError(e));
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       className="btn btn-primary"
//       disabled={loading || Boolean(error)}
//       onClick={() => claimAirdrop()}
//     >
//       {!loading ? "Claim" : "Claiming..."}
//     </button>
//   );
// };
