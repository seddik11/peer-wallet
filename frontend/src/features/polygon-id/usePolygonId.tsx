import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";

const NEXERA_ID_ISSUER = "https://polygon-id-mumbai-issuer-dev.nexera.id";
// https://0xpolygonid.github.io/tutorials/contracts/overview/
const POLYGON_ID_CONTRACT = "0x134B1BE34911E39A8397ec6289782989729807a4";

export const usePolygonIdWallet = () => {
  const { activeBurnerWallet } = useBurnerWalletStore();

  const wallet = useQuery({
    queryKey: ["polygonIdWallet", activeBurnerWallet?.address],
    queryFn: async () => {
      if (!activeBurnerWallet?.privateKey) throw new Error("No private key");
      if (!activeBurnerWallet?.publicKey) throw new Error("No public key");
      const polygonId = await import("@/features/polygon-id/polgyon-id");
      return await polygonId.getPolygonIdWallet({
        rpcUrl: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
        rhsUrl: NEXERA_ID_ISSUER,
        contractAddress: POLYGON_ID_CONTRACT,
        keyPair: {
          privateKey: Buffer.from(activeBurnerWallet?.privateKey, "hex"),
          publicKey: Buffer.from(activeBurnerWallet?.publicKey, "hex"),
        },
      });
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: !!activeBurnerWallet?.address,
  });

  return {
    wallet,
  };
};

export const useGetPolygonIdVcs = () => {
  const { wallet } = usePolygonIdWallet();
  return useQuery({
    queryKey: ["useGetPolygonIdVcs"],
    enabled: !!wallet.data,
    queryFn: async () => {
      if (!wallet.data) throw new Error("No polygonId");
      const creds = await wallet.data.credentialWallet.list();
      return creds.sort((a, b) => {
        return (
          z.coerce.date().parse(b.issuanceDate).getTime() -
          z.coerce.date().parse(a.issuanceDate).getTime()
        );
      });
    },
  });
};

export const useGetPolygonIdVcByIds = (props: { ids?: string[] }) => {
  const { wallet } = usePolygonIdWallet();
  return useQuery({
    queryKey: ["useGetPolygonIdVcById", props.ids],
    enabled: !!wallet.data && !!props.ids,
    queryFn: async () => {
      if (!wallet.data || !props.ids) throw new Error("No polygonId");
      return Promise.all(
        props.ids.map(async (id) => {
          return await wallet.data.credentialWallet.findById(id);
        })
      );
    },
  });
};

export const useGetPolygonIdVcByJourneyId = (props: {
  journeyId?: string | null;
}) => {
  const { wallet } = usePolygonIdWallet();
  return useQuery({
    queryKey: ["useGetPolygonIdVcByJourneyId", props.journeyId],
    enabled: !!wallet.data && !!props.journeyId,
    queryFn: async () => {
      if (!wallet.data || !props.journeyId) throw new Error("No polygonId");
      const vc = await wallet.data.credentialWallet.findByQuery({
        allowedIssuers: ["*"],
        credentialSubject: {
          journeyId: {
            $eq: props.journeyId,
          },
        },
      });
      if (!vc) throw new Error("No vc");
      return vc;
    },
  });
};
