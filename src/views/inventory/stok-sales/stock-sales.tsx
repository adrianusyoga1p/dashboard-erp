import { apiGetListStockSales } from "@/api/endpoints/stock";
import { BaseInput } from "@/components/base/input";
import { LayoutStock } from "@/components/layout/stock";
import type { BaseParam } from "@/types/common";
import type { StockSales } from "@/types/stock";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { StockSalesTable } from "./stock-sales-table";

const StockSalesPage = () => {
  const [dataStock, setDataStock] = useState<StockSales[]>([]);
  const [state, setState] = useState({
    loading: false,
  });
  const [params, setParams] = useState<BaseParam<StockSales>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "totalStock",
    keyword: null,
  });
  const [totalPage, setTotalPage] = useState(1);

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadStock = useCallback(
    async (keyword?: string | null) => {
      setState(() => ({
        loading: true,
      }));
      const { data, error } = await apiGetListStockSales({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setDataStock(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
      setState(() => ({
        loading: false,
      }));
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  useEffect(() => {
    loadStock(params.keyword);
  }, [loadStock]);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadStock(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadStock]
  );
  return (
    <LayoutStock>
      <div className="space-y-4">
        <h1 className="font-semibold text-lg">Stock Sales Table</h1>
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
        <StockSalesTable
          data={dataStock}
          page={params.page || 1}
          totalPage={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
          loading={state.loading}
        />
      </div>
    </LayoutStock>
  );
};

export default StockSalesPage;
