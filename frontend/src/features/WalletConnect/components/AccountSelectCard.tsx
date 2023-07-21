interface IProps {
  address: string;
  index: number;
  selected: boolean;
  onSelect: (address: string) => void;
}

export default function AccountSelectCard({
  address,
  selected,
  index,
  onSelect,
}: IProps) {
  if (typeof address === "undefined") return <></>;

  return (
    <div
      onClick={() => onSelect(address)}
      key={address}
      className="flex cursor-pointer items-center justify-between"
    >
      <div
        className={`border-cta-disabled-black flex w-full items-center justify-between rounded-2xl border-b border-solid p-4 ${
          selected && "bg-[#f4f4f9]"
        }`}
      >
        <div className="flex gap-4">
          <div className="flex flex-col text-[14px]">
            <div className="text-cta-black text-base"> Account {index + 1}</div>
            <div className="text-fg-muted zero:block 2md:hidden text-sm">
              {address.slice(0, 5)}...{address.slice(37)}
            </div>
            <div className="text-fg-muted zero:hidden 2md:block text-sm">
              {address}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
