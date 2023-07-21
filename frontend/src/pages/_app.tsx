import "@/styles/globals.css";
import "@biconomy/web3-auth/dist/src/style.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Component {...pageProps}></Component>
      <ToastContainer />
    </div>
  );
}
