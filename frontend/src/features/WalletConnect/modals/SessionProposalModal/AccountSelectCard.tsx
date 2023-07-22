import truncateAddress from "@/utils/truncateAddress";

interface IProps {
  address: string;
  index: number;
  selected: boolean;
  onSelect: (address: string) => void;
}

export function AccountSelectCard({ address, selected, onSelect }: IProps) {
  if (typeof address === "undefined") return <></>;

  return (
    <div
      onClick={() => onSelect(address)}
      key={address}
      className="flex cursor-pointer items-center justify-between"
    >
      <div
        className={`btn flex flex-col justify-center w-full h-[64px] px-4 py-2 rounded-md ${
          selected ? "bg-secondary" : "bg-neutral"
        }`}
      >
        <div className="flex gap-4 items-center">
          <div className="flex flex-col text-[14px]">
            <div className="text-fg-muted zero:block 2md:hidden text-sm">
              {truncateAddress(address)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
