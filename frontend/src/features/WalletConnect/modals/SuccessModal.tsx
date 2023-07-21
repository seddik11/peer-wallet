import React from "react";
import { useWcModalStore } from "@/features/WalletConnect/hooks/useWcModalStore";

export const SuccessModal = () => {
  const { close, modalView } = useWcModalStore((state) => ({
    close: state.close,
    modalView: state.modalView,
  }));

  if (modalView?.type !== "SuccessModal" || !modalView)
    throw new Error("Invalid modal type");
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center">
        <p className="text-cta-black text-center text-2xl font-extrabold">
          {modalView?.data?.title}
        </p>
        <p className="text-fg-muted text-center text-base font-normal">
          {modalView?.data.subtitle}
        </p>
      </div>
      <div
        className="text-cta-default cursor-pointer text-sm font-bold"
        onClick={close}
      >
        Close
      </div>
    </div>
  );
};
