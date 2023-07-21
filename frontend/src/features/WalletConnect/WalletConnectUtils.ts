import { Core } from "@walletconnect/core";
import { type ICore } from "@walletconnect/types";
import { Web3Wallet, type IWeb3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let core: ICore;

export async function createWeb3Wallet() {
  core = new Core({
    logger: "debug",
    projectId: "b769195d525fcd74f9ac88723ad1b8c5",
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "PeerWallet",
      description: "PeerWallet",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });
}

export async function pair(params: { uri: string }) {
  return await core.pairing.pair({ uri: params.uri });
}
