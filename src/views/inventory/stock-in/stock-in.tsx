import { apiCreateStockIn, apiGetListStockIn } from "@/api/endpoints/stock";
import { BaseButton } from "@/components/base/button";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { StockInForm } from "./stock-in-form";
import type { StockIn, StockInPayload } from "@/types/stock";
import BaseAlert from "@/components/base/alert";
import { StockInTable } from "./stock-in-table";
import type { BaseParam } from "@/types/common";
import { BaseInput } from "@/components/base/input";

const StockInPage = () => {
  const [state, setState] = useState({
    loading: false,
  });

  const [form, setForm] = useState<StockInPayload>({
    qty: null,
    minimumStock: null,
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
      minimumStock: null,
      productId: "",
      reason: "",
    });
  };

  const submitStockIn = async () => {
    setState(() => ({
      loading: true,
    }));
    const { data, error } = await apiCreateStockIn({
      ...form,
      qty: Number(form.qty),
      minimumStock: Number(form.minimumStock),
    });
    if (data) {
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

  const [dataStock, setDataStock] = useState<StockIn[]>([]);
  const [params, setParams] = useState<BaseParam<StockIn>>({
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
      const { data, error } = await apiGetListStockIn({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setDataStock(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
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
    return (
      form.qty === null || form.minimumStock === null || form.productId === ""
    );
  };

  return (
    <>
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

      <div className="space-y-6">
        <div className="flex gap-4 items-center justify-between">
          <h1 className="font-semibold text-lg">Stock In Management</h1>
          <BaseButton
            disabled={state.loading || isFormEmpty()}
            onClick={submitStockIn}
          >
            Add Stock
          </BaseButton>
        </div>
        <StockInForm form={form} setForm={setForm} />
        <div className="space-y-4">
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
          <StockInTable
            data={dataStock}
            page={params.page || 1}
            totalPage={totalPage}
            limit={params.limit || 10}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default StockInPage;
