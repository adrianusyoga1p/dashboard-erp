import { apiDeleteAdmin, apiGetListAdmin } from "@/api/endpoints/admin";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import { BaseTooltip } from "@/components/base/tooltip";
import type { Admin } from "@/types/admin";
import type { BaseParam } from "@/types/common";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import { AdminSheet } from "./admin-sheet";
import { useRole } from "@/hooks/useRole";

export const AdminTable = () => {
  const { canAccess } = useRole();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [params, setParams] = useState<BaseParam<Admin>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: null,
  });
  const [totalPage, setTotalPage] = useState(1);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "success" as "success" | "warning" | "error",
    title: "",
    message: "",
    onConfirm: () => {},
    showCancel: false,
    loading: false,
  });

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadAdmins = useCallback(
    async (keyword?: string | null) => {
      setAlertState((prev) => ({
        ...prev,
        loading: true,
      }));
      const { data, error } = await apiGetListAdmin({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setAdmins(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
      setAlertState((prev) => ({
        ...prev,
        loading: false,
      }));
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  const deleteAdmin = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteAdmin(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Data deleted successfully!"
            : error?.message || "Failed to delete data admin",
          onConfirm: () => loadAdmins(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const adminTableSlots = {
    actions: (admin: Admin) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("admin_read") && (
          <AdminSheet
            type="detail"
            adminData={admin}
            loadData={() => {
              loadAdmins();
            }}
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

        {canAccess("admin_update") && (
          <AdminSheet
            type="edit"
            adminData={admin}
            loadData={() => {
              loadAdmins();
            }}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuPencil />
                    </BaseButton>
                  }
                >
                  <p>Edit</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("admin_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteAdmin(admin.id)}
              >
                <LuTrash />
              </BaseButton>
            }
          >
            <p>Delete</p>
          </BaseTooltip>
        )}
      </div>
    ),
  };

  useEffect(() => {
    loadAdmins(params.keyword);
  }, [loadAdmins]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadAdmins(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadAdmins]
  );

  const AlertFooter = () => {
    return (
      <>
        {alertState.showCancel && (
          <BaseButton
            model="outline"
            onClick={() => setAlertState({ ...alertState, isOpen: false })}
          >
            Cancel
          </BaseButton>
        )}
        <BaseButton
          model={alertState.type === "warning" ? "fill" : "outline"}
          className={
            alertState.type === "warning"
              ? "bg-red-500 hover:bg-red-600 border-red-600"
              : ""
          }
          onClick={() => {
            alertState.onConfirm();
            if (alertState.type !== "warning") {
              setAlertState({ ...alertState, isOpen: false });
            }
          }}
        >
          {alertState.type === "warning" ? "Delete" : "OK"}
        </BaseButton>
      </>
    );
  };

  return (
    <>
      <BaseAlert
        open={alertState.isOpen}
        onOpenChange={(open) => setAlertState({ ...alertState, isOpen: open })}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        footerSlot={<AlertFooter />}
        loading={alertState.loading}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
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
          {canAccess("admin_create") && (
            <AdminSheet
              type="add"
              loadData={() => {
                loadAdmins();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Admin</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Admin>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Admin Name", key: "name" },
            { title: "User Name", key: "user.fullName" },
            { title: "Division Name", key: "division.displayName" },
            { title: "Role Name", key: "role.displayName" },
            { title: "Active", key: "active", type: "boolean" },
            { title: "Email", key: "email" },
            { title: "Phone Number", key: "user.phoneNumber" },
            { title: "Gender", key: "user.gender", className: "capitalize" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={admins}
          page={params.page || 1}
          slot={adminTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
          noDataText="Data admin is empty"
          loading={alertState.loading}
        />
      </div>
    </>
  );
};
