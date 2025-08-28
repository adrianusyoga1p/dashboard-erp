import BaseTable from "@/components/base/table";
import type { Stocks } from "@/types/stock";

interface TableStockOutI {
  data: Stocks[];
  page: number;
  totalPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export const StockOutTable = ({
  data,
  page,
  totalPage,
  limit,
  onPageChange,
  loading,
}: TableStockOutI) => {
  return (
    <BaseTable<Stocks>
      columns={[
        { title: "#", key: "id", type: "increment" },
        { title: "Product Name", key: "product.name" },
        { title: "Current Qty", key: "product.currentQty" },
        { title: "Qty Reduced", key: "qty" },
        { title: "Type", key: "type", className: "uppercase" },
        { title: "Reason", key: "reason" },
        { title: "Created At", key: "createdAt", type: "datetime" },
        { title: "Created By", key: "createdBy.name", },
      ]}
      source={data}
      page={page}
      total={totalPage}
      limit={limit}
      onPageChange={onPageChange}
      noDataText="Data stock is empty"
      loading={loading}
    />
  );
};
