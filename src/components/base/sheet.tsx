import type { ReactElement, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

interface BaseSheetProps
  extends React.ComponentProps<typeof SheetPrimitive.Root> {
  trigger: ReactNode | ReactElement;
  children: ReactNode;
  headerTitle?: string;
  headerDescription?: string;
  footer?: ReactNode | ReactElement;
}

export const BaseSheet = ({
  trigger,
  children,
  headerTitle,
  headerDescription,
  footer,
  ...props
}: BaseSheetProps) => {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          {headerTitle && <SheetTitle>{headerTitle}</SheetTitle>}
          {headerDescription && (
            <SheetDescription>{headerDescription}</SheetDescription>
          )}
        </SheetHeader>
        {children}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};
