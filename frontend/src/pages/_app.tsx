import "@/styles/globals.css";
import "@biconomy/web3-auth/dist/src/style.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gradient-to-br from-base-100 to-base-200">
      <Component {...pageProps} />
    </div>
  );
}
