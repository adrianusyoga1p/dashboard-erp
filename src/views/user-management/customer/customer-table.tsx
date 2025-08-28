import { useRole } from "@/hooks/useRole";
import type { Customer } from "@/types/customer";
import type { BaseParam } from "@/types/common";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CustomerSheet } from "./customer-sheet";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import {
  apiDeleteCustomer,
  apiGetListCustomer,
} from "@/api/endpoints/customer";
import { BaseTooltip } from "@/components/base/tooltip";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import BaseAlert from "@/components/base/alert";
import BaseTable from "@/components/base/table";

export const CustomerTable = () => {
  const { canAccess } = useRole();
  const [customer, setCustomer] = useState<Customer[]>([]);
  const [params, setParams] = useState<BaseParam<Customer>>({
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

  const loadCustomer = useCallback(
    async (keyword?: string | null) => {
      setAlertState((prev) => ({
        ...prev,
        loading: true,
      }));
      const { data, error } = await apiGetListCustomer({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setCustomer(data.data);
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

  const deleteCustomer = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteCustomer(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Data deleted successfully!"
            : error?.message || "Failed to delete data customer",
          onConfirm: () => loadCustomer(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const customerTableSlots = {
    actions: (customer: Customer) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("customer_read") && (
          <CustomerSheet
            type="detail"
            customerData={customer}
            loadData={() => {
              loadCustomer();
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

        {canAccess("customer_update") && (
          <CustomerSheet
            type="edit"
            customerData={customer}
            loadData={() => {
              loadCustomer();
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

        {canAccess("customer_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteCustomer(customer.id)}
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
    loadCustomer(params.keyword);
  }, [loadCustomer]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadCustomer(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadCustomer]
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
          {canAccess("customer_create") && (
            <CustomerSheet
              type="add"
              loadData={() => {
                loadCustomer();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Customer</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Customer>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Customer Name", key: "name" },
            { title: "Store Name", key: "storeName" },
            { title: "Email", key: "email" },
            { title: "Phone Number", key: "phoneNumber" },
            { title: "Address", key: "address" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={customer}
          page={params.page || 1}
          slot={customerTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
          noDataText="Data customer is empty"
          loading={alertState.loading}
        />
      </div>
    </>
  );
};
