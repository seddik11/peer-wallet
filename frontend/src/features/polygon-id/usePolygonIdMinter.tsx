import { useMutation } from "@tanstack/react-query";
import { PolygonIdMinter__factory } from "../../../types/ethers-contracts";
import { useBurnerWalletStore } from "@/features/burner/useBurnerWalletStore";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { toast } from "react-toastify";
import { usePolygonIdWallet } from "@/features/polygon-id/usePolygonId";

export const usePolygonIdMinter = () => {
  const burnerWallets = useBurnerWalletStore(
    (state) => state.burnerWalletsKeys
  );
  const { wallet } = usePolygonIdWallet();
  const submitProof = useMutation({
    mutationFn: async () => {
      const signer = new ethers.Wallet(burnerWallets[0]).connect(
        new JsonRpcProvider(
          "https://polygon-mumbai.blockpi.network/v1/rpc/public"
        )
      );
      const polygonIdMinter = PolygonIdMinter__factory.connect(
        "0xf8738e3748aE50D006EebD2cc5999bf7959150E1",
        signer
      );

      if (wallet.data?.credentialWallet === undefined)
        throw new Error("No polygonId");

      const { proof, requestId } = await wallet.data.handleZKP({
        userDID: wallet.data.did,
      });

      const tx1 = await polygonIdMinter.submitZKPResponse(
        requestId,
        proof.pub_signals,
        [proof.proof.pi_a[0], proof.proof.pi_a[1]],
        [
          [proof.proof.pi_b[0][0], proof.proof.pi_b[0][1]],
          [proof.proof.pi_b[1][0], proof.proof.pi_b[1][0]],
        ],
        [proof.proof.pi_c[0], proof.proof.pi_c[1]]
      );
      console.log("tx1", tx1);
      toast.info("Transaction sent");
      const receipt = await tx1.wait();
      toast.success("Transaction confirmed");

      return receipt;
    },
  });

  return {
    submitProof,
  };
};
