import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { ReactElement, ReactNode } from "react";

interface BaseTooltipI {
  trigger: ReactNode | ReactElement;
  children: ReactNode;
  asChild?: boolean;
}

export const BaseTooltip = ({
  trigger,
  children,
  asChild = true,
}: BaseTooltipI) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};
