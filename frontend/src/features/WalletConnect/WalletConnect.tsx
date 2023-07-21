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
    <div>
      <button className={"btn"} onClick={onWalletConnect}>
        Open
      </button>
    </div>
  );
};
