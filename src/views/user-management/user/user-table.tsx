import { apiGetListUser } from "@/api/endpoints/user";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import { useRole } from "@/hooks/useRole";
import type { BaseParam } from "@/types/common";
import type { User } from "@/types/user";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UserSheet } from "./user-sheet";
import { BaseTooltip } from "@/components/base/tooltip";
import { BaseButton } from "@/components/base/button";
import { LuEye } from "react-icons/lu";

export const UserTable = () => {
  const { canAccess } = useRole();
  const [dataUser, setDataUser] = useState<User[]>([]);
  const [params, setParams] = useState<BaseParam<User>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: null,
  });
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadUser = useCallback(
    async (keyword?: string | null) => {
      setLoading(true);
      const { data, error } = await apiGetListUser({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setDataUser(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
      setLoading(false);
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  useEffect(() => {
    loadUser(params.keyword);
  }, [loadUser]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadUser(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadUser]
  );

  const userTableSlots = {
    actions: (user: User) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("user_read") && (
          <UserSheet
            id={user.id}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuEye />
                    </BaseButton>
                  }
                >
                  <p>Detail</p>
                </BaseTooltip>
              </div>
            }
          />
        )}
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch}>
        <BaseInput
          className="w-fit min-w-60"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setParams((prev) => ({
              ...prev,
              keyword: e.target.value,
            }))
          }
          value={params.keyword || ""}
          placeholder="Search keyword..."
        />
      </form>
      <BaseTable<User>
        columns={[
          { title: "#", key: "id", type: "increment" },
          { title: "Actions", key: "actions", type: "slot" },
          { title: "User Name", key: "name" },
          { title: "Full Name", key: "fullName" },
          { title: "Division Name", key: "division.displayName" },
          { title: "Role Name", key: "role.displayName" },
          { title: "Phone Number", key: "phoneNumber" },
          { title: "Email", key: "email" },
          { title: "Active", key: "active", type: "boolean" },
          { title: "Gender", key: "gender", className: "capitalize" },
          { title: "Created At", key: "createdAt", type: "datetime" },
        ]}
        source={dataUser}
        page={params.page || 1}
        total={totalPage}
        limit={params.limit || 10}
        onPageChange={onPageChange}
        slot={userTableSlots}
        noDataText="Data user is empty"
        loading={loading}
      />
    </div>
  );
};
