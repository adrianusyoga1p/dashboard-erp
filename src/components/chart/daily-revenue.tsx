import { useCallback, useEffect, useMemo, useState } from "react";
import BaseChart from "../base/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { apiAnalyticDailyRevenue } from "@/api/endpoints/analytic";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useFormatter } from "@/hooks/useFormatter";

export const ChartDailyRevenue = () => {
  const { formatMoney, formatDate } = useFormatter();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<
    { date: string; revenue: number }[]
  >([]);

  const loadAnalyticDailyRevenue = useCallback(async () => {
    setLoading(true);
    const { data, error } = await apiAnalyticDailyRevenue();
    if (!error) {
      const mappedData = data.map((d) => ({
        date: formatDate(d.date),
        revenue: d.revenue,
      }));
      setChartData(mappedData);
    }
    setLoading(false);
  }, []);

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      payload: {
        label: "date",
        color: "#2563eb",
      },
    }),
    []
  );

  useEffect(() => {
    loadAnalyticDailyRevenue();
  }, [loadAnalyticDailyRevenue]);
  return (
    <BaseChart
      loading={loading}
      title="Daily Revenue"
      chartConfig={chartConfig}
    >
      {chartData.length ? (
        <LineChart width={200} height={300} accessibilityLayer data={chartData}>
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            width="auto"
            label={{ value: "Revenue", position: "insideLeft", angle: -90 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(label) => {
                  const toNumber = parseInt(label?.toString() as string);
                  return <span>{formatMoney(toNumber || 0)}</span>;
                }}
              />
            }
          />
          <Line strokeWidth={2} dataKey="revenue" fill="#2563eb" />
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
