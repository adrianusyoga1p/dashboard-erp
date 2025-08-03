import BaseTable from "@/components/base/table";
import type { StockIn } from "@/types/stock";

interface TableStockInI {
  data: StockIn[];
  page: number;
  totalPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const StockInTable = ({
  data,
  page,
  totalPage,
  limit,
  onPageChange,
}: TableStockInI) => {
  return (
    <BaseTable<StockIn>
      columns={[
        { title: "#", key: "id", type: "increment" },
        { title: "Product Name", key: "product.name" },
        { title: "Current Qty", key: "product.currentQty" },
        { title: "Qty Added", key: "qty" },
        { title: "Type", key: "type", className: "uppercase" },
        { title: "Reason", key: "reason" },
        { title: "Created At", key: "createdAt", type: "datetime" },
      ]}
      source={data}
      page={page}
      total={totalPage}
      limit={limit}
      onPageChange={onPageChange}
    />
  );
};
