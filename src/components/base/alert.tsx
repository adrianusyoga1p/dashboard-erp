import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { LuCircleAlert, LuCircleCheck } from "react-icons/lu";

interface BaseAlertI {
  type?: "warning" | "error" | "success";
  triggerSlot?: ReactNode;
  footerSlot?: ReactNode;
  title: string;
  message?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
}

const BaseAlert = ({
  type,
  message,
  title,
  triggerSlot,
  footerSlot,
  open,
  onOpenChange,
  loading,
}: BaseAlertI) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {triggerSlot && (
        <AlertDialogTrigger asChild>{triggerSlot}</AlertDialogTrigger>
      )}
      <AlertDialogContent className="justify-center items-center">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <AlertDialogHeader className="items-center justify-center">
              {type !== "success" ? (
                <LuCircleAlert
                  className={`text-6xl ${
                    type === "error" ? "text-red-500" : "text-yellow-500"
                  }`}
                />
              ) : (
                <LuCircleCheck className="text-green-700 text-6xl" />
              )}

              <AlertDialogTitle asChild>
                <h1 className="text-2xl! text-center">{title}</h1>
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <p className="text-base!">{message}</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            {footerSlot && (
              <AlertDialogFooter className="justify-center!">
                {footerSlot}
              </AlertDialogFooter>
            )}
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BaseAlert;
