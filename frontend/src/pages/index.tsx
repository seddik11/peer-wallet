import useWalletStore from "@/store/wallet";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useEffect } from "react";

const Index = () => {
  const AppDynamic = dynamic(
    () => import("../components/Main").then((res) => res.default),
    {
      ssr: false,
    }
  );

  const router = useRouter();
  const { wallet } = useWalletStore();

  useEffect(() => {
    if (wallet) {
      router.push({ pathname: "/home" });
    }
  }, [router, wallet]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AppDynamic />
      </Suspense>
    </>
  );
};

export default Index;
