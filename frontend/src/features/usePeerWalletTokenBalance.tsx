import { useQuery } from "@tanstack/react-query";
import { IMintableERC20__factory } from "../../types/ethers-contracts";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { BigNumber } from "ethers";

export const usePeerWalletTokenBalance = () => {
  const account = useAccount();
  return useQuery({
    queryKey: ["peerWalletTokenBalance", account.address],
    queryFn: async () => {
      if (!account.address) return BigNumber.from(0);
      const peertoken = IMintableERC20__factory.connect(
        "0xEa412a48E2EDFB3771aa61aFc14E203828D1e237",
        new JsonRpcProvider(
          "https://polygon-mumbai.blockpi.network/v1/rpc/public"
        )
      );
      return await peertoken.balanceOf(account.address);
    },
    enabled: !!account.address,
    refetchInterval: 5000,
    staleTime: 5000,
  });
};
