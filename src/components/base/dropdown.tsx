import type { ReactElement, ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown";

interface BaseDropdownI {
  trigger: ReactNode | ReactElement;
  children: ReactNode | ReactElement;
}

export const BaseDropdown = ({ trigger, children }: BaseDropdownI) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
};
