// import { apiGetListUnit } from "@/api/endpoints/unit";
// import type { Unit } from "@/types/unit";
import { apiGetListProductCategory } from "@/api/endpoints/category";
import {
  apiCreateProduct,
  apiGeDetailProduct,
  apiUpdateProduct,
} from "@/api/endpoints/product";
import { BaseSheet } from "@/components/base/sheet";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Product, ProductPayload, ProductCategory } from "@/types/product";
import { ProductForm } from "./product-form";
import { BaseButton } from "@/components/base/button";
import BaseAlert from "@/components/base/alert";
import { apiGetListUnit } from "@/api/endpoints/unit";
import type { Unit } from "@/types/unit";

interface ProductSheetProps {
  type?: "add" | "edit" | "detail";
  productData?: Product;
  loadData: () => void;
  trigger?: ReactNode;
}

export const ProductSheet = ({
  type = "add",
  productData,
  loadData,
  trigger,
}: ProductSheetProps) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const loadUnits = async (page = 1) => {
    let allData: Unit[] = [];

    while (true) {
      const res = await apiGetListUnit({ page, limit: 20 });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setUnits(allData);
  };

  const [state, setState] = useState({
    loading: false,
    show: false,
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

  const [form, setForm] = useState<ProductPayload>({
    name: "",
    brandName: "",
    productCategoryId: "",
    code: "",
    description: "",
    price: null,
    productSku: "",
    active: false,
  });

  const resetForm = () => {
    setForm({
      name: "",
      brandName: "",
      productCategoryId: "",
      code: "",
      description: "",
      price: null,
      productSku: "",
      active: false,
    });
  };

  const [category, setCategory] = useState<ProductCategory[]>([]);
  const loadCategory = async (page = 1) => {
    let allData: ProductCategory[] = [];

    while (true) {
      const res = await apiGetListProductCategory({
        page,
        limit: 20,
        order: "desc",
        orderBy: "createdAt",
        active: true,
      });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setCategory(allData);
  };

  const loadDetailProduct = useCallback(async (id: string) => {
    const { data } = await apiGeDetailProduct(id);
    if (data) {
      setForm({
        name: data?.name || "",
        brandName: data?.brandName || "",
        code: data?.code || "",
        description: data?.description || "",
        productCategoryId: data?.productCategoryId || "",
        price: data?.price || null,
        productSku: data?.productSku || "",
        active: data?.active,
        baseUnitId: data.baseUnitId,
      });
    }
  }, []);

  const submitProduct = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { error } =
      type === "add"
        ? await apiCreateProduct({ ...form, price: Number(form.price) })
        : await apiUpdateProduct(productData?.id as string, {
            ...form,
            price: Number(form.price),
          });
    if (!error) {
      resetForm();
      loadData();
      setSubmitStatus({
        isOpen: true,
        type: "success",
        message: "Your data is saved!",
      });
      setState(() => ({
        loading: false,
        show: false,
      }));
    } else {
      setSubmitStatus({
        isOpen: true,
        type: "error",
        message: error?.message || "",
      });
      setState(() => ({
        loading: false,
        show: true,
      }));
    }
  };

  useEffect(() => {
    if (state.show) {
      if (type !== "add" && productData?.id) {
        loadDetailProduct(productData.id);
      }
      loadCategory();
      loadUnits();
    }
  }, [type, state.show, loadDetailProduct, productData?.id]);

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

  const SheetFooter = () => {
    return (
      <div className="flex gap-4 items-center w-full">
        <BaseButton
          onClick={() => {
            setState((prev) => ({
              ...prev,
              show: false,
            }));
            resetForm();
          }}
          className="w-full"
          model="transparent"
          disabled={state.loading}
        >
          Discard
        </BaseButton>
        <BaseButton
          className="w-full"
          disabled={state.loading}
          onClick={submitProduct}
        >
          {state.loading ? "Loading..." : "Submit"}
        </BaseButton>
      </div>
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

      <BaseSheet
        open={state.show}
        onOpenChange={(isOpen) => {
          setState((prev) => ({
            ...prev,
            show: isOpen,
          }));
          resetForm();
        }}
        trigger={trigger}
        headerTitle={
          type === "add"
            ? "Add Product"
            : type === "edit"
            ? `Edit Product ${productData?.brandName}`
            : `Detail Product ${productData?.brandName}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <ProductForm
          type={type}
          form={form}
          setForm={setForm}
          category={category}
          unit={units}
        />
      </BaseSheet>
    </>
  );
};
