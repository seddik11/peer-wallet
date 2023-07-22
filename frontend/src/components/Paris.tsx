import "@rainbow-me/rainbowkit/styles.css";
import Image from "next/image";
import headerImg from "../../public/Paris.png";
import landingPageImg from "../../public/landing_dao.svg";
import claimImg from "../../public/voting.svg";
import participateImg from "../../public/participate.svg";
import Card from "./Card";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { useAccount } from "wagmi";

const { chains, publicClient } = configureChains([goerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function ParisLanding() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Home />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function Home() {
  const { address } = useAccount();

  return (
    <div className="App min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <ParisNavbar />
      <div className="flex flex-col items-center py-6">
        <main className="flex flex-col items-center mt-10">
          <div className="flex gap-4 items-center">
            <Image className="w-32 h-full" alt="header-image" src={headerImg} />
            <div>
              <h1 className="text-6xl font-extrabold leading-1 text-white ">
                2nd arrondissement
              </h1>
              <h2 className="text-center text-2xl text-white">
                DAO for your local governance and neighbors coordination
              </h2>
            </div>
          </div>
          {!address && <Connect />}
          {address && <Claim />}
        </main>
      </div>
    </div>
  );
}

const Connect = () => (
  <>
    <Image className="mt-10 w-96" alt="landing-image" src={landingPageImg} />

    <div className="mt-10">
      <ConnectButton />

      {/* <div className="w-80 btn border-none text-black bg-yellow-200 hover:bg-yellow-400">
        Connect
      </div> */}
    </div>
  </>
);

const Claim = () => (
  <>
    <Image className="mt-10 w-96" alt="landing-image" src={claimImg} />

    <div className="mt-10">
      <Card>
        <div className="min-w-96 flex flex-col items-center text-center gap-6">
          <h1 className="text-black text-6xl font-extrabold leading-1 ">
            Welcome
          </h1>
          <h2 className="text-black text-center text-lg">
            To start participating claim your voting rights
          </h2>

          <div className="m-auto w-52 btn border-none text-black bg-yellow-200 hover:bg-yellow-400">
            Claim
          </div>
        </div>
      </Card>
    </div>
  </>
);

const Participate = () => (
  <>
    <Image className="mt-10 w-96" alt="landing-image" src={participateImg} />

    <div className="mt-10">
      <Card>
        <div className="min-w-96 flex flex-col items-center text-center gap-6">
          <h1 className="w-full text-black text-6xl font-extrabold leading-1 ">
            Lets build together
          </h1>
          <h2 className="text-black text-center text-lg">
            Every voice is important for our local development
          </h2>

          <div className="m-auto w-52 btn border-none text-black bg-yellow-200 hover:bg-yellow-400">
            Participate
          </div>
        </div>
      </Card>
    </div>
  </>
);

const ParisNavbar = () => (
  <div className="navbar">
    <div className="navbar-start">
      <a className="btn btn-ghost normal-case text-xl">Paris</a>
    </div>
    <div className="navbar-center hidden lg:flex"></div>
    <div className="navbar-end">
      <ConnectButton />
    </div>
  </div>
);
