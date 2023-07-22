import { useCallback, useEffect, useRef, useState } from "react";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import { Bundler, IBundler } from "@biconomy/bundler";
import truncateAddress from "@/utils/truncateAddress";
import useWalletStore from "@/store/wallet";

const bundler: IBundler = new Bundler({
  bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/abc", // you can get this value from biconomy dashboard.
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL || "",
});

const LoginButton = ({ text }: { text?: string }) => {
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  const { wallet, loginWallet, logoutWallet } = useWalletStore();

  const setupSmartAccount = useCallback(async () => {
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );
    setProvider(web3Provider);

    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
      };
      let biconomySmartAccount = new BiconomySmartAccount(
        biconomySmartAccountConfig
      );
      biconomySmartAccount = await biconomySmartAccount.init();
      setAddress(await biconomySmartAccount.getSmartAccountAddress());

      setSmartAccount(biconomySmartAccount);
      loginWallet(biconomySmartAccount);

      setLoading(false);
    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }, [loginWallet]);

  useEffect(() => {
    let configureLogin: any;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval, setupSmartAccount]);

  const login = useCallback(async () => {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      const signature1 = await socialLoginSDK.whitelistUrl(
        "http://localhost:3000/"
      );
      const signature2 = await socialLoginSDK.whitelistUrl(
        "https://peer-wallet.vercel.app/"
      );
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          "http://localhost:3000/": signature1,
          "https://peer-wallet.vercel.app/": signature2,
        },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }, [setupSmartAccount]);

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    logoutWallet();
    setAddress("");
    enableInterval(false);
  };

  useEffect(() => {
    if (wallet && !smartAccount) {
      login();
    }
  }, [login, smartAccount, wallet]);

  return (
    <div>
      {loading && !smartAccount && (
        <button className="btn">
          <span className="loading loading-spinner btn-neutral text-white"></span>
          loading
        </button>
      )}
      {smartAccount ? (
        <button className="btn btn-primary text-white" onClick={logout}>
          {truncateAddress(address)}
        </button>
      ) : (
        !loading &&
        !wallet && (
          <button className="btn btn-primary text-white" onClick={login}>
            {text || "Login"}
          </button>
        )
      )}
    </div>
  );
};

export default LoginButton;
