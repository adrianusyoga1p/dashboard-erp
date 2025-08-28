import {
  apiCreateProductCategory,
  apiGetDetailProductCategory,
  apiUpdateProductCategory,
} from "@/api/endpoints/category";
import { BaseSheet } from "@/components/base/sheet";
import { useCallback, useEffect, useState } from "react";
import { ProductCategoryForm } from "./product-category-form";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import type { ProductCategory } from "@/types/product";

interface ProductCategorySheetProps {
  type?: "add" | "edit" | "detail";
  productCategoryData?: ProductCategory;
  loadData: () => void;
  trigger?: React.ReactNode;
}

export const ProductCategorySheet = ({
  type = "add",
  productCategoryData,
  loadData,
  trigger,
}: ProductCategorySheetProps) => {
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

  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
    });
  };

  const loadDetailProductCategory = useCallback(async (id: string) => {
    const { data } = await apiGetDetailProductCategory(id);
    if (data) {
      setForm({
        name: data?.name,
        code: data?.code,
      });
    }
  }, []);

  const submitProductCategory = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { error } =
      type === "add"
        ? await apiCreateProductCategory({ ...form, active: true })
        : await apiUpdateProductCategory(productCategoryData?.id as string, {
            ...form,
            active: true,
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
      if (type !== "add" && productCategoryData?.id) {
        loadDetailProductCategory(productCategoryData.id);
      }
    }
  }, [type, state.show, loadDetailProductCategory]);

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
          onClick={submitProductCategory}
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
        trigger={trigger}
        open={state.show}
        onOpenChange={(isOpen) => {
          setState((prev) => ({
            ...prev,
            show: isOpen,
          }));
          resetForm();
        }}
        headerTitle={
          type === "add"
            ? "Add Product Category"
            : type === "edit"
            ? `Edit Product Category ${productCategoryData?.name}`
            : `Detail Product Category ${productCategoryData?.name}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <ProductCategoryForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
