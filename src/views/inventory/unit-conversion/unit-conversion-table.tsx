import { apiGetListUnitConversion } from "@/api/endpoints/unit-conversion";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import { useRole } from "@/hooks/useRole";
import type { BaseParam } from "@/types/common";
import type { UnitConversion } from "@/types/unit";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { UnitConversionSheet } from "./unit-conversion-sheet";
import { BaseButton } from "@/components/base/button";

export const UnitConversionTable = () => {
  const { canAccess } = useRole();
  const [unitConversions, setUnitConversions] = useState<UnitConversion[]>([]);
  const [params, setParams] = useState<BaseParam<UnitConversion>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: null,
  });

  const [totalPage, setTotalPage] = useState(1);
  const [alertState, setAlertState] = useState({
    // isOpen: false,
    // type: "success" as "success" | "warning" | "error",
    // title: "",
    // message: "",
    // onConfirm: () => {},
    // showCancel: false,
    loading: false,
  });

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadUnitConversions = useCallback(
    async (keyword?: string | null) => {
      setAlertState((prev) => ({
        ...prev,
        loading: true,
      }));
      const { data, error } = await apiGetListUnitConversion({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setUnitConversions(data.data);
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

  useEffect(() => {
    loadUnitConversions(params.keyword);
  }, [loadUnitConversions]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadUnitConversions(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadUnitConversions]
  );

  return (
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
          {canAccess("unit-conversion_create") && (
            <UnitConversionSheet
              type="add"
              loadData={() => {
                loadUnitConversions();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Unit Conversion</BaseButton>}
            />
          )}
        </div>
      </div>
      <BaseTable<UnitConversion>
        columns={[
          { title: "#", key: "id", type: "increment" },
          { title: "Name", key: "name", className: "relative" },
          { title: "Factor", key: "factor" },
          { title: "Base Unit", key: "baseUnit.name" },
          { title: "To Unit", key: "toUnit.name" },
          { title: "Created At", key: "createdAt", type: "datetime" },
        ]}
        source={unitConversions}
        page={params.page || 1}
        total={totalPage}
        limit={params.limit || 10}
        onPageChange={onPageChange}
        noDataText="Data unit conversion is empty"
        loading={alertState.loading}
      />
    </div>
  );
};
