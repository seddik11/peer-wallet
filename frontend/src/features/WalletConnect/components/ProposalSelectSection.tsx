import AccountSelectCard from "./AccountSelectCard";

/**
 * Types
 */
interface IProps {
  chain: string;
  addresses: string[];
  selectedAddresses: string[] | undefined;
  onSelect: (chain: string, address: string) => void;
}

/**
 * Component
 */
export const ProposalSelectSection = ({
  addresses,
  selectedAddresses,
  chain,
  onSelect,
}: IProps) => {
  return (
    <div className="flex flex-col h-[358px] w-full overflow-y-auto">
      {addresses?.map((address, index) => (
        <AccountSelectCard
          key={address}
          address={address}
          index={index}
          onSelect={(address: string) => onSelect(chain, address)}
          selected={selectedAddresses?.includes(address) ?? false}
        />
      ))}
    </div>
  );
};
