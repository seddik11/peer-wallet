import Image from "next/image";
import LoginButton from "./LoginButton";
import Navbar from "./Navbar";

import landingPageImg from "../../public/landingpage.svg";

export default function Home() {
  return (
    <div className="App min-h-screen">
      <div className="flex flex-col items-center py-6">
        <main className="flex flex-col items-center mt-20">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            PEERwallet
          </h1>

          <Image
            className="mt-10 w-96"
            alt="landing-image"
            src={landingPageImg}
          />

          <h2 className="mt-10 text-center text-md tracking-tight text-white sm:text-[2rem]">
            The safest wallet to interact <br /> with web3 ever created
          </h2>

          <div className="mt-10">
            <LoginButton text="Create Wallet" />
          </div>
        </main>
      </div>
    </div>
  );
}
