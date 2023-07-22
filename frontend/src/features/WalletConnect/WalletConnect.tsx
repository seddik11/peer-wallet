import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

export const WalletConnect = () => {
  const { open } = useWcModalStore((state) => ({
    open: state.open,
  }));

  const onWalletConnect = () => {
    open({
      modalView: {
        type: "OnConnectDappsModal",
      },
    });
  };

  return (
    <div className="m-auto">
      <button
        className={"btn btn-primary text-white"}
        onClick={onWalletConnect}
      >
        Connect to new Dapp
      </button>
    </div>
  );
};
