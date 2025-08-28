import { apiDeleteUnit, apiGetListUnit } from "@/api/endpoints/unit";
import { useRole } from "@/hooks/useRole";
import type { BaseParam } from "@/types/common";
import type { Unit } from "@/types/unit";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UnitSheet } from "./unit-sheet";
import { BaseTooltip } from "@/components/base/tooltip";
import { BaseButton } from "@/components/base/button";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import BaseAlert from "@/components/base/alert";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import { UnitModal } from "./unit-modal";

export const UnitTable = () => {
  const { canAccess } = useRole();
  const [units, setUnits] = useState<Unit[]>([]);
  const [params, setParams] = useState<BaseParam<Unit>>({
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

  const loadUnits = useCallback(
    async (keyword?: string | null) => {
      setAlertState((prev) => ({
        ...prev,
        loading: true,
      }));
      const { data, error } = await apiGetListUnit({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setUnits(data.data);
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

  const deleteUnit = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this unit?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteUnit(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Unit deleted successfully!"
            : error?.message || "Failed to delete unit",
          onConfirm: () => loadUnits(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const unitTableSlots = {
    actions: (unit: Unit) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("unit_read") && (
          <UnitSheet
            type="detail"
            unitData={unit}
            loadData={() => {
              loadUnits();
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

        {canAccess("unit_update") && (
          <UnitSheet
            type="edit"
            unitData={unit}
            loadData={() => {
              loadUnits();
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

        {canAccess("unit_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteUnit(unit.id)}
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
    loadUnits(params.keyword);
  }, [loadUnits]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadUnits(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadUnits]
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
          <div className="flex gap-4 items-center">
            <UnitModal
              loadData={loadUnits}
              trigger={<BaseButton model="outline">Import Data</BaseButton>}
            />
            {canAccess("unit_create") && (
              <UnitSheet
                type="add"
                loadData={() => {
                  loadUnits();
                  params.keyword = null;
                }}
                trigger={<BaseButton>Add Unit</BaseButton>}
              />
            )}
          </div>
        </div>
        <BaseTable<Unit>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Name", key: "name", className: "relative" },
            { title: "Code", key: "code" },
            { title: "Unit Category", key: "unitCategory.name" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={units}
          page={params.page || 1}
          slot={unitTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
          noDataText="Data unit is empty"
          loading={alertState.loading}
        />
      </div>
    </>
  );
};
