import { Wallet } from "@ethersproject/wallet";
import { Context, ContextParams } from "@aragon/sdk-client";
import { SupportedNetwork } from "@aragon/sdk-client-common";

// Set up your IPFS API key. You can get one either by running a local node or by using a service like Infura or Alechmy.
// Make sure to always keep these private in a file that is not committed to your public repository.
export const IPFS_API_KEY: string = "b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt";

// OPTION A: The simplest ContextParams you can have is this. This uses our default values and should work perfectly within your product.
const minimalContextParams: ContextParams = {
  // Choose the network you want to use. You can use "goerli" (Ethereum) or "maticmum" (Polygon) for testing, or "mainnet" (Ethereum) and "polygon" (Polygon) for mainnet.
  network: "maticmum",
  web3Providers: "https://polygon-mumbai.g.alchemy.com/v2/uzz40Ir26ueBXnli6qxv7QMn7GDhdUn8",
  // This is the signer account who will be signing transactions for your app. You can use also use a specific account where you have funds, through passing it `new Wallet("your-wallets-private-key")` or pass it in dynamically when someone connects their wallet to your dApp.
  signer: new Wallet("0xcc1149669c0f288ae228c316d93a8fd39b766a7d5ac3f41054f74e4ee7f1a09c"),
  ipfsNodes: [
    {
      url: "https://test.ipfs.aragon.network/api/v0",
      headers: { "X-API-KEY": IPFS_API_KEY || "" },
    },
  ],
};

export const minimalContext: Context = new Context(minimalContextParams);