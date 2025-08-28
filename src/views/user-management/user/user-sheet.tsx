import { apiGetDetailUser } from "@/api/endpoints/user";
import { BaseSheet } from "@/components/base/sheet";
import { useFormatter } from "@/hooks/useFormatter";
import type { User } from "@/types/user";
import { useCallback, useState, type ReactNode } from "react";

interface UserSheetProps {
  id: string;
  trigger?: ReactNode;
}

export const UserSheet = ({ id, trigger }: UserSheetProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState({
    show: false,
  });
  const { formatDateTime } = useFormatter();

  const loadDetailUser = useCallback(async () => {
    const { data } = await apiGetDetailUser(id);
    if (data) {
      setUser(data as User);
    }
  }, []);

  return (
    <BaseSheet
      open={state.show}
      onOpenChange={(isOpen) => {
        setState((prev) => ({
          ...prev,
          show: isOpen,
        }));
        if (isOpen) loadDetailUser();
      }}
      trigger={trigger}
      headerTitle={`Detail User ${user?.fullName || user?.name}`}
    >
      <div className="space-y-6 p-4 relative overflow-y-auto">
        <div>
          <label className="font-semibold text-sm block mb-2">User Name</label>
          <p>{user?.name || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Full Name
          </label>
          <p>{user?.fullName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Division Name
          </label>
          <p>{user?.division?.displayName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Role Name
          </label>
          <p>{user?.role?.displayName || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">User Email</label>
          <p>{user?.email || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Phonenumber
          </label>
          <p>{user?.phoneNumber || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Gender
          </label>
          <p className="capitalize">{user?.gender || "-"}</p>
        </div>
        <div>
          <label className="font-semibold text-sm block mb-2">
            User Join At
          </label>
          <p className="capitalize">
            {formatDateTime(user?.joinAt as string) || "-"}
          </p>
        </div>
      </div>
    </BaseSheet>
  );
};
