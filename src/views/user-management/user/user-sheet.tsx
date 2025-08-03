import { BaseSheet } from "@/components/base/sheet";
import { useFormatter } from "@/hooks/useFormatter";
import type { User } from "@/types/user";
import { useState, type ReactNode } from "react";

interface UserSheetProps {
  userData?: User;
  loadData: () => void;
  trigger?: ReactNode;
}

export const UserSheet = ({ userData, loadData, trigger }: UserSheetProps) => {
  const [state, setState] = useState({
    show: false,
  });
  const { formatDateTime } = useFormatter();

  return (
    <BaseSheet
      open={state.show}
      onOpenChange={(isOpen) => {
        setState((prev) => ({
          ...prev,
          show: isOpen,
        }));
        loadData();
      }}
      trigger={trigger}
      headerTitle={`Detail User ${userData?.fullName || userData?.name}`}
    >
      <div className="space-y-6 p-4 relative overflow-y-auto">
        <div>
          <label className="font-semibold text-sm block mb-2">User Name</label>
          <p>{userData?.name || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Full Name
          </label>
          <p>{userData?.fullName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Division Name
          </label>
          <p>{userData?.division?.displayName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Role Name
          </label>
          <p>{userData?.role?.displayName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">User Email</label>
          <p>{userData?.email || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Phonenumber
          </label>
          <p>{userData?.phoneNumber || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Gender
          </label>
          <p className="capitalize">{userData?.gender || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Join At
          </label>
          <p className="capitalize">
            {formatDateTime(userData?.joinAt as string) || "-"}
          </p>
        </div>
      </div>
    </BaseSheet>
  );
};
