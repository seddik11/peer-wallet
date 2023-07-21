import Image from "next/image";
import LoginButton from "./LoginButton";
import Navbar from "./Navbar";

import landingPageImg from "../../public/landingpage.svg";

export default function Home() {
  return (
    <div className="App min-h-screen">
      <div className="flex flex-col items-center py-6">
        <main className="flex flex-col items-center mt-20 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            PEERwallet
          </h1>

          <Image className="mt-10" alt="landing-image" src={landingPageImg} />

          <h2 className="mt-10 text-md tracking-tight text-white sm:text-[2rem]">
            Lorem Ipsum
          </h2>

          <div className="mt-10">
            <LoginButton text="Create Wallet" />
          </div>
        </main>
      </div>
    </div>
  );
}
