import "@/styles/globals.css";
import "@biconomy/web3-auth/dist/src/style.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { WalletConnectModals } from "@/features/WalletConnect/modals/WalletConnectModals";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200">
      <Component {...pageProps}></Component>
      <ToastContainer />
    </div>
  );
}
