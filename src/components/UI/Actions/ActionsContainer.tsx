import { PropsWithChildren } from "react";

type ActionsContainerProps = PropsWithChildren<{
  className: string;
}>;

export default function ActionsContainer({
  children,
  className,
}: ActionsContainerProps) {
  return <div className={className}>{children}</div>;
}
