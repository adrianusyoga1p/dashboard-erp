import { useMoney } from "@/hooks/useMoney";
import BasePagination from "./pagination";
import { useFormatter } from "@/hooks/useFormatter";
import { cn } from "@/utils/utils";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";

export interface ColumnDefinition {
  title: string;
  key: string;
  type?:
    | "default"
    | "increment"
    | "slot"
    | "price"
    | "datetime"
    | "date"
    | "number"
    | "boolean";
  align?: "left" | "center" | "right";
  width?: number | string;
  className?: string;
}

interface BaseTableProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  columns: ColumnDefinition[];
  source: T[];
  page?: number;
  slot?: Record<string, (data: T, index: number) => React.ReactNode>;
  loading?: boolean;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  noDataText?: string;
  loadingText?: string;
}

const BaseTable = <T extends Record<string, unknown>>({
  columns,
  source,
  slot = {},
  loading = false,
  page,
  total,
  limit,
  onPageChange,
  noDataText = "No Data",
  loadingText = "Loading...",
  ...props
}: BaseTableProps<T>) => {
  const getDataByKey = <T extends Record<string, unknown>>(
    data: T,
    path: string
  ): unknown => {
    return path.split(".").reduce((acc: unknown, part) => {
      if (
        acc &&
        typeof acc === "object" &&
        part in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, data);
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
  };

  const PriceCell = ({ value }: { value: number | null | undefined }) => {
    const formattedValue = useMoney(value);
    return <span>{formattedValue}</span>;
  };

  const { formatDate, formatDateTime } = useFormatter();

  return (
    <div className="-mx-6 px-6">
      <div {...props} className="overflow-x-auto relative">
        <table className="w-full border-separate border-spacing-y-3">
          <thead className="text-sm">
            <tr>
              {columns.map((column, i) => (
                <th
                  key={`header-${i}`}
                  className={`
                    font-medium text-gray-500 p-2.5
                    ${column.type !== "increment" ? "min-w-44" : ""}
                    ${column.align === "left" ? "text-left" : ""}
                    ${column.align === "right" ? "text-right" : ""}
                    ${
                      !column.align || column.align === "center"
                        ? "text-center"
                        : ""
                    }
                  `}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          {!loading && source && source.length > 0 && (
            <tbody className="text-sm">
              {source?.map((data, index) => (
                <tr
                  key={`row-${index}`}
                  className="hover:shadow-lg bg-white transition-all duration-500 rounded-lg"
                >
                  {columns.map((column, i) => (
                    <td
                      key={`cell-${index}-${i}`}
                      className={cn(
                        "p-2.5 border-b border-gray-100 text-gray-700 first:rounded-l-lg last:rounded-r-lg",
                        column.align === "left" ? "text-left" : "text-center",
                        column.align === "right" ? "text-right" : "text-center",
                        !column.align || column.align === "center"
                          ? "text-center"
                          : "text-center",
                        column.className
                      )}
                    >
                      {column.type === "increment" ? (
                        <span>
                          {((page as number) - 1) * (limit as number) +
                            index +
                            1}
                          .
                        </span>
                      ) : column.type === "slot" && slot[column.key] ? (
                        slot[column.key](data, index)
                      ) : column.type === "price" ? (
                        <PriceCell
                          value={getDataByKey(data, column.key) as number}
                        />
                      ) : column.type === "datetime" ? (
                        <span>
                          {formatDateTime(
                            getDataByKey(data, column.key) as string
                          )}
                        </span>
                      ) : column.type === "date" ? (
                        <span>
                          {formatDate(getDataByKey(data, column.key) as string)}
                        </span>
                      ) : column.type === "boolean" ? (
                        <div className="flex items-center justify-center">
                          {getDataByKey(data, column.key) ? (
                            <LuCircleCheck className="text-green-600" />
                          ) : (
                            <LuCircleX className="text-red-600" />
                          )}
                        </div>
                      ) : column.type === "number" ? (
                        <>{getDataByKey(data, column.key) || 0}</>
                      ) : (
                        <>
                          {(() => {
                            const value = getDataByKey(data, column.key);
                            if (Array.isArray(value)) {
                              return value.join(", ");
                            }
                            return value || "-";
                          })()}
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {loading && (
          <div className="p-4 text-center text-gray-700 sticky left-0 w-full flex items-center justify-center top-0 min-h-60">
            {loadingText}
          </div>
        )}

        {!loading && (!source || source.length === 0) && (
          <div className="px-4 py-24 sticky left-0 w-full flex flex-col gap-8 items-center justify-center top-0 min-h-60">
            <img src="/img/empty.png" alt="empty" />
            <p className="text-center text-sm text-gray-500">{noDataText}</p>
          </div>
        )}
      </div>

      {(total as number) > 1 && (
        <BasePagination
          total={total as number}
          page={page as number}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BaseTable;
