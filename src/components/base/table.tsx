import { useMoney } from "@/hooks/useMoney";
import BasePagination from "./pagination";

interface ColumnDefinition {
  title: string;
  key: string;
  type?: "default" | "increment" | "slot" | "price";
  align?: "left" | "center" | "right";
  width?: number | string;
}

interface BaseTableProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  columns: ColumnDefinition[];
  source: T[];
  page: number;
  slot?: Record<string, (data: T, index: number) => React.ReactNode>;
  loading?: boolean;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
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
    onPageChange(newPage);
  };

  const PriceCell = ({ value }: { value: number | null | undefined }) => {
    const formattedValue = useMoney(value);
    return <span>{formattedValue}</span>;
  };

  return (
    <div {...props} className="-mx-6">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3 p-6">
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

          {!loading && (
            <tbody className="text-sm-3">
              {source?.map((data, index) => (
                <tr
                  key={`row-${index}`}
                  className="hover:shadow-lg bg-white transition-all duration-500 rounded-lg"
                >
                  {columns.map((column, i) => (
                    <td
                      key={`cell-${index}-${i}`}
                      className={`
                        p-2.5 border-b border-gray-100 text-gray-700 first:rounded-l-lg last:rounded-r-lg
                        ${column.align === "left" ? "text-left" : ""}
                        ${column.align === "right" ? "text-right" : ""}
                        ${
                          !column.align || column.align === "center"
                            ? "text-center"
                            : ""
                        }
                      `}
                    >
                      {column.type === "increment" ? (
                        <span>{(page - 1) * limit + index + 1}.</span>
                      ) : column.type === "slot" && slot[column.key] ? (
                        slot[column.key](data, index)
                      ) : column.type === "price" ? (
                        <PriceCell
                          value={getDataByKey(data, column.key) as number}
                        />
                      ) : (
                        <>
                          {(() => {
                            const value = getDataByKey(data, column.key);
                            if (Array.isArray(value)) {
                              return value.join(", ");
                            }
                            return value ?? "-";
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

        {(!source || source.length === 0) && !loading && (
          <div className="p-4 text-center text-sm text-gray-500">
            {noDataText}
          </div>
        )}

        {loading && (
          <div className="p-4 text-center text-sm text-gray-500">
            {loadingText}
          </div>
        )}
      </div>

      {total > 1 && (
        <BasePagination
          total={total}
          page={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default BaseTable;
