import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Index = () => {
  const AppDynamic = dynamic(
    () => import("../../components/Home").then((res) => res.default),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute>
          <AppDynamic />
        </ProtectedRoute>
      </Suspense>
    </>
  );
};

export default Index;
