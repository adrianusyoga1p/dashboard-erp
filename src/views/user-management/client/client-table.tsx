import { useRole } from "@/hooks/useRole";
import type { Client } from "@/types/client";
import type { BaseParam } from "@/types/common";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ClientSheet } from "./client-sheet";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { apiDeleteClient, apiGetListClient } from "@/api/endpoints/client";
import { BaseTooltip } from "@/components/base/tooltip";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import BaseAlert from "@/components/base/alert";
import BaseTable from "@/components/base/table";

export const CLientTable = () => {
  const { canAccess } = useRole();
  const [client, setClient] = useState<Client[]>([]);
  const [params, setParams] = useState<BaseParam<Client>>({
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

  const loadClient = useCallback(
    async (keyword?: string | null) => {
      const { data, error } = await apiGetListClient({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setClient(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  const deleteClient = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteClient(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Data deleted successfully!"
            : error?.message || "Failed to delete data client",
          onConfirm: () => loadClient(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const clientTableSlots = {
    actions: (client: Client) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("client_read") && (
          <ClientSheet
            type="detail"
            clientData={client}
            loadData={() => {
              loadClient("");
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
                  <p>Detail Client</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("client_update") && (
          <ClientSheet
            type="edit"
            clientData={client}
            loadData={() => {
              loadClient("");
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
                  <p>Edit Client</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("client_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteClient(client.id)}
              >
                <LuTrash />
              </BaseButton>
            }
          >
            <p>Delete Sales</p>
          </BaseTooltip>
        )}
      </div>
    ),
  };

  useEffect(() => {
    loadClient(params.keyword);
  }, [loadClient]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadClient(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadClient]
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
          {canAccess("client_create") && (
            <ClientSheet
              type="add"
              loadData={() => {
                loadClient();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Client</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Client>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Client Name", key: "name" },
            { title: "Store Name", key: "storeName" },
            { title: "Email", key: "email" },
            { title: "Phone Number", key: "phoneNumber" },
            { title: "Address", key: "address" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={client}
          page={params.page || 1}
          slot={clientTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
