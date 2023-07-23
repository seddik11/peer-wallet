import { useMutation, useQuery } from "@tanstack/react-query";
import { PolygonIdMinter__factory } from "../../../types/ethers-contracts";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { toast } from "react-toastify";
import { usePolygonIdWallet } from "@/features/polygon-id/usePolygonId";
import { Biconomy } from "@biconomy/mexa";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { useState } from "react";

export const usePolygonIdMinter = () => {
  const burnerWallets = useBurnerWalletStore(
    (state) => state.burnerWalletsKeys
  );
  const { wallet } = usePolygonIdWallet();

  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<any>();

  const submitProof = useMutation({
    mutationFn: async () => {
      setLoading(true);

      const signer = new ethers.Wallet(burnerWallets[0]).connect(
        new JsonRpcProvider(
          "https://polygon-mumbai.blockpi.network/v1/rpc/public"
        )
      );
      const polygonIdMinter = PolygonIdMinter__factory.connect(
        "0x5B529d2c6f86320Ac977cfF6AdfcAd3bCffA5e41",
        signer
      );

      if (wallet.data?.credentialWallet === undefined)
        throw new Error("No polygonId");

      const { proof, requestId } = await wallet.data.handleZKP({
        userDID: wallet.data.did,
      });
      console.log("proof", {
        requestId,
        sigs: [...proof.pub_signals, 0],
        a: [proof.proof.pi_a[0], proof.proof.pi_a[1]],
        b: [
          [proof.proof.pi_b[0][1], proof.proof.pi_b[0][0]],
          [proof.proof.pi_b[1][1], proof.proof.pi_b[1][0]],
        ],
        c: [proof.proof.pi_c[0], proof.proof.pi_c[1]],
      });

      const tx1 = await polygonIdMinter.submitZKPResponse(
        requestId,
        proof.pub_signals,
        [proof.proof.pi_a[0], proof.proof.pi_a[1]],
        [
          [proof.proof.pi_b[0][1], proof.proof.pi_b[0][0]],
          [proof.proof.pi_b[1][1], proof.proof.pi_b[1][0]],
        ],
        [proof.proof.pi_c[0], proof.proof.pi_c[1]]
      );

      const hdWallet = new HDWalletProvider(
        signer.privateKey.replace("0x", ""),
        "https://polygon-mumbai.blockpi.network/v1/rpc/public"
      );

      console.log("tx1", tx1);
      toast.info("Transaction sent");
      const receipt = await tx1.wait();
      toast.success("Transaction confirmed");

      setLoading(false);
      setReceipt(receipt);

      return receipt;
    },
  });

  const values = useQuery({
    queryKey: ["polygonIdMinter", "getMinted", wallet.data?.did],
    queryFn: async () => {
      const signer = new ethers.Wallet(burnerWallets[0]).connect(
        new JsonRpcProvider(
          "https://polygon-mumbai.blockpi.network/v1/rpc/public"
        )
      );
      const polygonIdMinter = PolygonIdMinter__factory.connect(
        "0xF02DB9dfce29eAFDD57Dd493fE15F7f06E9Ea8a3",
        signer
      );

      const result = await polygonIdMinter.getZKPRequest(1);
      console.log("result", result);
      return result;
    },
  });

  return {
    submitProof,
    receipt,
    loading,
    values,
  };
};

export type ExternalProvider = {
  isMetaMask?: boolean;
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void;
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>;
};

export const gassLessPolygonidMinter = async (props: {
  wallet: ExternalProvider;
}) => {
  const biconomy = new Biconomy(props.wallet, {
    apiKey: "O6c13fPDI.c147eec5-c0de-4f06-857b-24070e2a4795",
    debug: true,
    contractAddresses: ["0x5B529d2c6f86320Ac977cfF6AdfcAd3bCffA5e41"], // list of contract address you want to enable gasless on
  });
  console.log("i'm here 2");

  const result = await biconomy.init();
  // To create contract instances you can do:
  const contractInstance = new ethers.Contract(
    "0x5B529d2c6f86320Ac977cfF6AdfcAd3bCffA5e41",
    [
      {
        inputs: [
          {
            internalType: "contract IMintableERC20",
            name: "_token",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        inputs: [],
        name: "TOKEN_AMOUNT_FOR_AIRDROP_PER_ID",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "TRANSFER_REQUEST_ID",
        outputs: [
          {
            internalType: "uint64",
            name: "",
            type: "uint64",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "addressToId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getSupportedRequests",
        outputs: [
          {
            internalType: "uint64[]",
            name: "arr",
            type: "uint64[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "requestId",
            type: "uint64",
          },
        ],
        name: "getZKPRequest",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "schema",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "claimPathKey",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "operator",
                type: "uint256",
              },
              {
                internalType: "uint256[]",
                name: "value",
                type: "uint256[]",
              },
              {
                internalType: "uint256",
                name: "queryHash",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "circuitId",
                type: "string",
              },
            ],
            internalType: "struct ICircuitValidator.CircuitQuery",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "idToAddress",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "",
            type: "uint64",
          },
        ],
        name: "proofs",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "",
            type: "uint64",
          },
        ],
        name: "requestQueries",
        outputs: [
          {
            internalType: "uint256",
            name: "schema",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimPathKey",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "operator",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "queryHash",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "circuitId",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "",
            type: "uint64",
          },
        ],
        name: "requestValidators",
        outputs: [
          {
            internalType: "contract ICircuitValidator",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "requestId",
            type: "uint64",
          },
          {
            internalType: "contract ICircuitValidator",
            name: "validator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "schema",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimPathKey",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "operator",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "value",
            type: "uint256[]",
          },
        ],
        name: "setZKPRequest",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "requestId",
            type: "uint64",
          },
          {
            internalType: "contract ICircuitValidator",
            name: "validator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "schema",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimPathKey",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "operator",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "value",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "queryHash",
            type: "uint256",
          },
        ],
        name: "setZKPRequestRaw",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "requestId",
            type: "uint64",
          },
          {
            internalType: "uint256[]",
            name: "inputs",
            type: "uint256[]",
          },
          {
            internalType: "uint256[2]",
            name: "a",
            type: "uint256[2]",
          },
          {
            internalType: "uint256[2][2]",
            name: "b",
            type: "uint256[2][2]",
          },
          {
            internalType: "uint256[2]",
            name: "c",
            type: "uint256[2]",
          },
        ],
        name: "submitZKPResponse",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "token",
        outputs: [
          {
            internalType: "contract IMintableERC20",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    biconomy.ethersProvider
  );
  console.log("i'm here 3");
  return contractInstance;
};
