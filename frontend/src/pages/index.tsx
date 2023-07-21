import dynamic from "next/dynamic";
import { Suspense } from "react";
import { BurnerWallets } from "@/features/burner/BurnerWallets";

const Index = () => {
  const AppDynamic = dynamic(
    () => import("../components/Main").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AppDynamic />
      </Suspense>
    </>
  );
};

export default Index;
