import {
  apiDeleteDivision,
  apiGetListDivision,
} from "@/api/endpoints/division";
import { BaseButton } from "@/components/base/button";
import { BaseTooltip } from "@/components/base/tooltip";
import type { BaseParam } from "@/types/common";
import type { Division } from "@/types/division";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import { DivisionSheet } from "./division-sheet";
import BaseAlert from "@/components/base/alert";
import BaseTable from "@/components/base/table";
import { BaseInput } from "@/components/base/input";
import { useRole } from "@/hooks/useRole";

export const DivisionTable = () => {
  const { canAccess } = useRole();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [params, setParams] = useState<BaseParam<Division>>({
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

  const loadDivisions = useCallback(
    async (keyword?: string | null) => {
      const { data, error } = await apiGetListDivision({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setDivisions(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  const deleteDivision = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteDivision(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Data deleted successfully!"
            : error?.message || "Failed to delete data admin",
          onConfirm: () => loadDivisions(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const divisionTableSlots = {
    actions: (division: Division) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("division_read") && (
          <DivisionSheet
            type="detail"
            divisionData={division}
            loadData={() => {
              loadDivisions(null);
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
                  <p>Detail Division</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("division_update") && (
          <DivisionSheet
            type="edit"
            divisionData={division}
            loadData={() => {
              loadDivisions(null);
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
                  <p>Edit Division</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("division_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteDivision(division.id)}
              >
                <LuTrash />
              </BaseButton>
            }
          >
            <p>Delete Division</p>
          </BaseTooltip>
        )}
      </div>
    ),
  };

  useEffect(() => {
    loadDivisions(params.keyword);
  }, [loadDivisions]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadDivisions(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadDivisions]
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
          {canAccess("division_create") && (
            <DivisionSheet
              type="add"
              loadData={() => {
                loadDivisions();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Division</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Division>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Division Name", key: "displayName" },
            { title: "Active", key: "active", type: "boolean" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={divisions}
          page={params.page || 1}
          slot={divisionTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
