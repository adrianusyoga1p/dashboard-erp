import { apiCreateStockOut, apiGetListStockOut } from "@/api/endpoints/stock";
import { BaseButton } from "@/components/base/button";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { StockOutForm } from "./stock-out-form";
import type { Stocks, StocksPayload } from "@/types/stock";
import BaseAlert from "@/components/base/alert";
import { StockOutTable } from "./stock-out-table";
import type { BaseParam } from "@/types/common";
import { BaseInput } from "@/components/base/input";
import { useRole } from "@/hooks/useRole";
import { LayoutStock } from "@/components/layout/stock";

const StockOutPage = () => {
  const { canAccess } = useRole();
  const [state, setState] = useState({
    loading: false,
  });

  const [form, setForm] = useState<Omit<StocksPayload, "minimumStock">>({
    qty: null,
    productId: "",
    reason: "",
  });

  const [submitStatus, setSubmitStatus] = useState<{
    isOpen: boolean;
    type: "success" | "warning" | "error";
    message?: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const resetForm = () => {
    setForm({
      qty: null,
      productId: "",
      reason: "",
    });
  };

  const submitStockIn = async () => {
    setState(() => ({
      loading: true,
    }));
    const { error } = await apiCreateStockOut({
      ...form,
      qty: Number(form.qty),
    });
    if (!error) {
      resetForm();
      setSubmitStatus({
        isOpen: true,
        type: "success",
        message: "Your data is saved!",
      });
      loadStock();
    } else {
      setSubmitStatus({
        isOpen: true,
        type: "error",
        message: error?.message || "",
      });
    }
    setState(() => ({
      loading: false,
    }));
  };

  const AlertFooter = () => {
    return (
      <BaseButton
        onClick={() => {
          setSubmitStatus((prev) => ({
            ...prev,
            isOpen: false,
          }));
        }}
      >
        OK
      </BaseButton>
    );
  };

  const [dataStock, setDataStock] = useState<Stocks[]>([]);
  const [params, setParams] = useState<BaseParam<Stocks>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
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
      const { data, error } = await apiGetListStockOut({
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

  const isFormEmpty = (): boolean => {
    return form.qty === null || form.productId === "";
  };

  return (
    <LayoutStock>
      <BaseAlert
        open={submitStatus.isOpen}
        onOpenChange={(open) =>
          setSubmitStatus({ ...submitStatus, isOpen: open })
        }
        title={submitStatus.type === "success" ? "Success" : "Error"}
        message={submitStatus.message}
        type={submitStatus.type}
        footerSlot={<AlertFooter />}
      />

      {canAccess("stock_out_create") && (
        <>
          <div className="flex gap-4 items-center justify-between">
            <h1 className="font-semibold text-lg">Stock Out Management</h1>
            <div className="flex gap-4 items-center">
              <BaseButton model="transparent" onClick={resetForm}>
                Discard
              </BaseButton>
              <BaseButton
                disabled={state.loading || isFormEmpty()}
                onClick={submitStockIn}
              >
                Submit
              </BaseButton>
            </div>
          </div>
          <StockOutForm form={form} setForm={setForm} />
        </>
      )}
      <div className="space-y-4">
        <h1 className="font-semibold text-lg">Stock Out Table</h1>
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
        <StockOutTable
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

export default StockOutPage;
