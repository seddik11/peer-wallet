import { SismoButton } from "@/features/sismo";
import { BurnerWallets } from "@/features/burner/BurnerWallets";
import dynamic from "next/dynamic";

const SismoPage = () => {
  return (
    <>
      <BurnerWallets />;
      <SismoButton />;
    </>
  );
};

export default dynamic(() => Promise.resolve(SismoPage), {
  ssr: false,
});
