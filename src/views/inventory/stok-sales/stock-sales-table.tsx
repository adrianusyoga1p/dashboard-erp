import BaseTable from "@/components/base/table";
import { useRole } from "@/hooks/useRole";
import type { StockSales } from "@/types/stock";
import { StockSalesSheet } from "./stock-sales-sheet";
import { BaseTooltip } from "@/components/base/tooltip";
import { BaseButton } from "@/components/base/button";
import { LuEye } from "react-icons/lu";

interface StockSalesTableProps {
  data: StockSales[];
  page: number;
  totalPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const StockSalesTable = ({
  data,
  page,
  totalPage,
  limit,
  onPageChange,
  loading,
}: StockSalesTableProps) => {
  const { canAccess } = useRole();

  const stockSalesSlots = {
    actions: (stock: StockSales) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("stock-sales_read") && (
          <StockSalesSheet
            salesId={stock.salesId}
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
    <BaseTable<StockSales>
      columns={[
        { title: "#", key: "id", type: "increment" },
        { title: "Actions", key: "actions", type: "slot" },
        { title: "Sales Name", key: "salesName" },
        { title: "Total Stock Handed", key: "totalStock", type: "number" },
        { title: "Created At", key: "createdAt", type: "datetime" },
      ]}
      source={data}
      page={page}
      total={totalPage}
      limit={limit}
      onPageChange={onPageChange}
      noDataText="Data stock is empty"
      loading={loading}
      slot={stockSalesSlots}
    />
  );
};
