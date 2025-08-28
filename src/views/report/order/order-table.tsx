import { apiGetListReportOrder } from "@/api/endpoints/report";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import type { BaseParam } from "@/types/common";
import type { ReportOrder } from "@/types/report";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ReportOrderSheet } from "./order-sheet";
import { BaseTooltip } from "@/components/base/tooltip";
import { BaseButton } from "@/components/base/button";
import { LuEye } from "react-icons/lu";

export const ReportOrderTable = () => {
  const [dataOrder, setDataOrder] = useState<ReportOrder[]>([]);
  const [params, setParams] = useState<BaseParam<ReportOrder>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: null,
  });
  const [totalPage, setTotalPage] = useState(1);

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadReportOrder = useCallback(
    async (keyword?: string | null) => {
      const { data, error } = await apiGetListReportOrder({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setDataOrder(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  useEffect(() => {
    loadReportOrder(params.keyword);
  }, [loadReportOrder]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadReportOrder(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadReportOrder]
  );

  // const loadDetailOrder = useCallback(async (id: string) => {
  //   const { data } = await apiGetDetailReportOrder(id);
  //   if (data) {
  //     setDataOrder(data)
  //   }
  // });

  const reportOrderTableSlots = {
    actions: (reportOrder: ReportOrder) => (
      <div className="flex items-center justify-center gap-2">
        <ReportOrderSheet
          reportOrderData={reportOrder}
          trigger={
            <div>
              <BaseTooltip
                trigger={
                  <BaseButton model="outline" size="sm">
                    <LuEye />
                  </BaseButton>
                }
              >
                <p>Detail Report</p>
              </BaseTooltip>
            </div>
          }
        />
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
      <BaseTable<ReportOrder>
        columns={[
          { title: "#", key: "id", type: "increment" },
          { title: "Actions", key: "actions", type: "slot" },
          { title: "Order ID", key: "id", className: "text-nowrap" },
          { title: "Total Amount", key: "totalAmount", type: "price" },
          { title: "Status", key: "status", className: "capitalize" },
          { title: "Type Order", key: "typeOrder", className: "capitalize" },
          { title: "New Order", key: "isNewOrder", type: "boolean" },
          { title: "Description", key: "description" },
          { title: "Purchased At", key: "purchasedAt", type: "datetime" },
          { title: "Created At", key: "createdAt", type: "datetime" },
        ]}
        source={dataOrder}
        page={params.page || 1}
        total={totalPage}
        limit={params.limit || 10}
        onPageChange={onPageChange}
        slot={reportOrderTableSlots}
        noDataText="Data order is empty"
      />
    </div>
  );
};
