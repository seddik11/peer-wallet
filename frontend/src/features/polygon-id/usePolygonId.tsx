import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import eccrypto from "eccrypto";
import { useLocalStorage } from "usehooks-ts";
import { DID } from "@iden3/js-iden3-core";

const POLYGON_ID_ISSUER = "https://issuer-demo.polygonid.me";
// https://0xpolygonid.github.io/tutorials/contracts/overview/
const POLYGON_ID_CONTRACT = "0x134B1BE34911E39A8397ec6289782989729807a4";

export const usePolygonIdWallet = () => {
  const wallet = useQuery({
    queryKey: ["polygonIdWallet"],
    queryFn: async () => {
      let privKey;

      const storedPrivateKey = localStorage.getItem("privateKey");
      const storedDid = localStorage.getItem("did");
      if (storedPrivateKey) {
        privKey = Buffer.from(storedPrivateKey, "hex");
      } else {
        privKey = eccrypto.generatePrivate();
        localStorage.setItem("privateKey", privKey.toString("hex"));
      }

      console.log("privKey", privKey);
      const polygonId = await import("@/features/polygon-id/polgyon-id");
      const wallet = await polygonId.getPolygonIdWallet({
        rpcUrl: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
        rhsUrl: POLYGON_ID_ISSUER,
        contractAddress: POLYGON_ID_CONTRACT,
        keyPair: {
          privateKey: privKey,
          publicKey: eccrypto.getPublic(privKey),
        },
        did: storedDid ? DID.parse(storedDid) : undefined,
      });

      localStorage.setItem("did", wallet.did.toString());

      await wallet.initCircuits({
        circuitsFolder: "/circuits",
      });

      return wallet;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const handleAuthQrOffer = async (qr: string) => {
    if (!wallet.data?.credentialWallet) throw new Error("No polygonId");
    const auth = await wallet.data.handleAuthOffer({
      authRequest: qr,
      did: wallet.data.did,
    });
    return auth;
  };

  const handleCredentialQrOffer = async (qr: string) => {
    if (!wallet.data?.credentialWallet) throw new Error("No polygonId");
    const cred = await wallet.data.handleCredentialOffer({
      credentialQrOffer: qr,
      userDID: wallet.data.did,
    });
    await wallet.data.credentialWallet.saveAll(cred);
    return cred;
  };

  return {
    wallet,
    handleAuthQrOffer,
    handleCredentialQrOffer,
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
      return creds.filter((c) => !c.type.includes("AuthBJJCredential"));
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

export const usePolygonIdStoredCreds = () => {
  const wallet = usePolygonIdWallet();
  return useQuery({
    queryKey: ["usePolygonIdStoredCreds"],
    enabled: !!wallet.wallet.data?.credentialWallet,
    queryFn: async () => {
      if (!wallet.wallet.data?.credentialWallet)
        throw new Error("No polygonId");
      return await wallet.wallet.data.credentialWallet.list();
    },
  });
};
