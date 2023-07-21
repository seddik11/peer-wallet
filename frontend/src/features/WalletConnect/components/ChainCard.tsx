import { type ReactNode } from "react";

interface Props {
  children: ReactNode | ReactNode[];
  rgb: string;
  flexDirection: "row" | "col";
  alignItems: "center" | "flex-start";
}

export default function ChainCard({ children }: Props) {
  return (
    <div className={"flex flex-row"}>
      <div>{children}</div>
    </div>
  );
}
