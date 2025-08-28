import { ChartContainer, type ChartConfig } from "../ui/chart";
import type { ReactElement, ReactNode } from "react";
import BaseCalendar from "./calendar";

interface BaseChartProps {
  chartConfig: ChartConfig;
  children: ReactElement;
  title?: string;
  loading?: boolean;
  date?: boolean;
  triggerDate?: ReactNode;
  selectedDate?: Date | undefined;
  onSelectDate?: (date: Date | undefined) => void;
}

const BaseChart = ({
  chartConfig,
  children,
  title = "Chart Title",
  loading,
  date,
  triggerDate,
  selectedDate,
  onSelectDate,
  ...props
}: BaseChartProps) => {
  return (
    <div className="space-y-6 bg-white rounded-xl p-6">
      {loading ? (
        <div className="flex text-gray-700 items-center justify-center h-[400px]">
          Loading...
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-center flex-wrap justify-between">
            <h1 className="font-semibold text-xl">{title}</h1>
            {date && (
              <BaseCalendar
                onSelect={onSelectDate}
                selectedDate={selectedDate}
                trigger={triggerDate}
              />
            )}
          </div>
          <ChartContainer
            {...props}
            config={chartConfig}
            className="h-[400px] w-full"
          >
            {children}
          </ChartContainer>
        </>
      )}
    </div>
  );
};

export default BaseChart;
