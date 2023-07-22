import { usePolygonIdWallet } from "@/features/polygon-id/usePolygonId";

export const PolygonIdWallet = () => {
  const { wallet } = usePolygonIdWallet();

  const did = wallet.data?.did;

  return (
    <div>
      <h1>PolygonId</h1>
      <p>{did}</p>
    </div>
  );
};

export default PolygonIdWallet;
