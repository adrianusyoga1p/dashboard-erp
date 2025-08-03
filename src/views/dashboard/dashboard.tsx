import {
  apiAnalyticStockIn,
  apiAnalyticStockOut,
  apiAnalyticStockReturn,
} from "@/api/endpoints/analytic";
import { useRole } from "@/hooks/useRole";
import type {
  AnalyticStockIn,
  AnalyticStockOut,
  AnalyticStockReturn,
} from "@/types/analytic";
import { useCallback, useEffect, useState } from "react";
import { LuArrowBigDownDash, LuTruck, LuUndo2 } from "react-icons/lu";

const Dashboard = () => {
  const { hasGroup } = useRole();
  const [data, setData] = useState<{
    stockIn: AnalyticStockIn | null;
    stockOut: AnalyticStockOut | null;
    stockReturn: AnalyticStockReturn | null;
  }>({
    stockIn: null,
    stockOut: null,
    stockReturn: null,
  });

  const loadAnalyticStockIn = useCallback(async () => {
    const { data: resData, error } = await apiAnalyticStockIn();
    if (!error && resData) {
      setData((prev) => ({
        ...prev,
        stockIn: resData,
      }));
    }
  }, []);

  const loadAnalyticStockOut = useCallback(async () => {
    const { data: resData, error } = await apiAnalyticStockOut();
    if (!error && resData) {
      setData((prev) => ({
        ...prev,
        stockOut: resData,
      }));
    }
  }, []);

  const loadAnalyticStockReturn = useCallback(async () => {
    const { data: resData, error } = await apiAnalyticStockReturn();
    if (!error && resData) {
      setData((prev) => ({
        ...prev,
        stockReturn: resData,
      }));
    }
  }, []);

  useEffect(() => {
    loadAnalyticStockIn();
    loadAnalyticStockOut();
    loadAnalyticStockReturn();
  }, [loadAnalyticStockIn, loadAnalyticStockOut, loadAnalyticStockReturn]);
  return (
    <div className="space-y-6">
      {hasGroup("dashboard") ? (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 flex gap-4 items-center justify-between transition-shadow hover:shadow-lg duration-300">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-black">
                {data.stockIn?.summary.totalQty}{" "}
                <span className="text-sm font-normal">qty</span>
              </h1>
              <p className="text-gray-400">
                {data.stockIn?.summary.totalProducts} Product In
              </p>
            </div>
            <div className="flex items-center justify-center bg-green-100 rounded-full p-2">
              <LuArrowBigDownDash className="text-green-600 text-3xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex gap-4 items-center justify-between transition-shadow hover:shadow-lg duration-300">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-black">
                {data.stockOut?.summary.totalQty}{" "}
                <span className="text-sm font-normal">qty</span>
              </h1>
              <p className="text-gray-400">
                {data.stockOut?.summary.totalProducts} Product Out
              </p>
            </div>
            <div className="flex items-center justify-center bg-yellow-100 rounded-full p-2">
              <LuTruck className="text-yellow-600 text-3xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex gap-4 items-center justify-between transition-shadow hover:shadow-lg duration-300">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-black">
                {data.stockReturn?.summary.totalQty}{" "}
                <span className="text-sm font-normal">qty</span>
              </h1>
              <p className="text-gray-400">
                {data.stockReturn?.summary.totalProducts} Product Return
              </p>
            </div>
            <div className="flex items-center justify-center bg-red-100 rounded-full p-2">
              <LuUndo2 className="text-red-600 text-3xl" />
            </div>
          </div>
        </div>
      ) : (
        <h1 className="font-semibold text-lg">Welcome to Dashboard Page</h1>
      )}
    </div>
  );
};

export default Dashboard;
