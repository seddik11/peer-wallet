import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { type SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { providers } from "ethers";

import {
  EIP155_CHAINS,
  EIP155_SIGNING_METHODS,
  type TEIP155Chain,
} from "./EIP155Data";
import { eip155Addresses, eip155Wallets } from "./Eip155WalletUtil";
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
  getWalletAddressFromParams,
} from "./HelperUtil";

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments["session_request"]
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const wallet =
    eip155Wallets[getWalletAddressFromParams(eip155Addresses, params)];

  if (!wallet) throw getSdkError("WC_METHOD_UNSUPPORTED", "Wallet not found");
  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      const message = getSignParamsMessage(request.params);
      const signedMessage = await wallet.signMessage(message);
      return formatJsonRpcResult(id, signedMessage);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      const {
        // @ts-ignore
        domain,
        // @ts-ignore
        types,
        // @ts-ignore
        message: data,
      } = getSignTypedDataParamsData(request.params);
      // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
      delete types.EIP712Domain;
      const signedData = await wallet?._signTypedData(domain, types, data);
      return formatJsonRpcResult(id, signedData);

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      console.log("chainId", chainId);
      const provider = new providers.JsonRpcProvider(
        EIP155_CHAINS[chainId as TEIP155Chain].rpc
      );
      const sendTransaction = request.params[0];
      const connectedWallet = wallet.connect(provider);
      const { hash } = await connectedWallet.sendTransaction(sendTransaction);
      return formatJsonRpcResult(id, hash);

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      const signTransaction = request.params[0];
      const signature = await wallet.signTransaction(signTransaction);
      return formatJsonRpcResult(id, signature);

    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectEIP155Request(
  request: SignClientTypes.EventArguments["session_request"]
) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
}
