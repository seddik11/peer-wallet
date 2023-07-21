import { Fragment, type ReactNode } from "react";

/**
 * Types
 */
interface IProps {
  title: string;
  children: ReactNode | ReactNode[];
}

/**
 * Component
 */
export function RequestModalContainer({ children, title }: IProps) {
  return (
    <Fragment>
      <div className={"flex flex-row"}>
        <h1>{title}</h1>
      </div>

      <div>
        <div>{children}</div>
      </div>
    </Fragment>
  );
}
