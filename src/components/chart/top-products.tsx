import { apiAnalyticTopProducts } from "@/api/endpoints/analytic";
import BaseChart from "@/components/base/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { BaseButton } from "../base/button";
import { useFormatter } from "@/hooks/useFormatter";
import { LuCalendar, LuX } from "react-icons/lu";

export const ChartTopProducts = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<
    { productName: string; qtyOrder: number }[]
  >([]);
  const [date, setDate] = useState<Date | undefined>();
  const { formatDate } = useFormatter();

  const loadAnalyticTopProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await apiAnalyticTopProducts({
      purchasedAt: date ? date.toISOString().slice() : null,
    });
    if (!error) {
      const mappedData = data.map((d) => ({
        productName: d.productName,
        qtyOrder: d.qtyOrder,
      }));
      setChartData(mappedData);
    }
    setLoading(false);
  }, [date]);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      payload: {
        label: "productName",
        color: "#2563eb",
      },
    }),
    []
  );

  useEffect(() => {
    loadAnalyticTopProducts();
  }, [loadAnalyticTopProducts]);
  return (
    <BaseChart
      loading={loading}
      title="Top Product Sales"
      chartConfig={chartConfig}
      date
      selectedDate={date}
      onSelectDate={(date) => {
        setDate(date);
      }}
      triggerDate={
        <BaseButton model="transparent">
          <LuCalendar />
          {date ? formatDate(String(date)) : "Select Date"}
          {date && <LuX onClick={() => setDate(undefined)} />}
        </BaseButton>
      }
    >
      {chartData.length ? (
        <LineChart width={600} height={300} accessibilityLayer data={chartData}>
          <CartesianGrid />
          <XAxis
            dataKey="productName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            width="auto"
            label={{ value: "Qty Order", position: "insideLeft", angle: -90 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(label) => {
                  return <span>{label} orders</span>;
                }}
              />
            }
          />
          <Line strokeWidth={2} dataKey="qtyOrder" fill="#2563eb" />
        </LineChart>
      ) : (
        <div className="px-4 py-24 sticky left-0 w-full flex flex-col gap-8 items-center justify-center top-0 min-h-60">
          <img src="/img/empty.png" alt="empty" />
          <p className="text-center text-sm text-gray-500">No data</p>
        </div>
      )}
    </BaseChart>
  );
};
