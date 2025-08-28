import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BaseButton } from "./button";

interface BaseModalProps {
  description?: string;
  action?: ReactNode;
  title: string;
  trigger: ReactNode;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const BaseModal = ({
  title,
  description,
  action,
  trigger,
  children,
  onOpenChange,
  open,
}: BaseModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {action && (
          <DialogFooter>
            <DialogClose asChild>
              <BaseButton model="outline">Close</BaseButton>
            </DialogClose>
            {action}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
