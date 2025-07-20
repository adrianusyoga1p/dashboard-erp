import { useMemo } from "react";

export const useMoney = (value: number | null | undefined): string => {
  return useMemo(() => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, [value]);
};
