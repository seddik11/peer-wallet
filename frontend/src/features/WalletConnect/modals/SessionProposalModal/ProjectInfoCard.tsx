import Link from "next/link";
import { type SignClientTypes } from "@walletconnect/types";

/**
 * Types
 */
interface IProps {
  metadata: SignClientTypes.Metadata;
}

/**
 * Components
 */
export function ProjectInfoCard({ metadata }: IProps) {
  const { icons, name, url } = metadata;

  return (
    <div className={"flex flex-col"}>
      <div>
        <img src={icons[0]} height={12} width={12} alt={"project-info-card"} />
      </div>
      <div>
        <h1>{name}</h1>
        <Link href={url}>{url}</Link>
      </div>
    </div>
  );
}
