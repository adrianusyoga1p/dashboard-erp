import { apiGetDetailStockSales } from "@/api/endpoints/stock";
import { BaseSheet } from "@/components/base/sheet";
import type { StockSales } from "@/types/stock";
import { useCallback, useEffect, useState, type ReactNode } from "react";

interface StockSalesSheetProps {
  salesId: string;
  trigger?: ReactNode;
}

export const StockSalesSheet = ({ salesId, trigger }: StockSalesSheetProps) => {
  const [state, setState] = useState({
    show: false,
  });

  const [stockData, setStockData] = useState<StockSales>();
  const loadDetailStockSales = useCallback(async () => {
    const { data, error } = await apiGetDetailStockSales(salesId);
    if (!error) {
      setStockData(data);
    }
  }, [salesId, state.show]);

  useEffect(() => {
    if (state.show && salesId) {
      loadDetailStockSales();
    }
  }, [loadDetailStockSales]);

  return (
    <BaseSheet
      open={state.show}
      onOpenChange={(isOpen) => {
        setState((prev) => ({
          ...prev,
          show: isOpen,
        }));
      }}
      trigger={trigger}
      headerTitle={`Detail Stock ${stockData?.salesName}`}
    >
      <div className="space-y-6 p-4 relative overflow-y-auto">
        <div className="border-b space-y-4 pb-4">
          <h1 className="text-xl font-semibold">Sales Data</h1>
          <div>
            <label className="font-semibold text-sm block mb-2">
              Sales Name
            </label>
            <p>{stockData?.salesName || "-"}</p>
          </div>
        </div>
        <div className="border-b space-y-4 pb-4">
          <h1 className="text-xl font-semibold">Product Data</h1>
          {stockData?.products.map((p) => (
            <div key={p.id} className="flex gap-2 justify-between items-end">
              <div>
                <label className="font-semibold text-sm block mb-2">
                  {p.name} - {p.brandName}
                  <div>({p.productSku})</div>
                </label>
                <p className="text-xs">{p.qtyStock} stock</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseSheet>
  );
};
