import {
  apiCreateCategory,
  apiGetDetailCategory,
  apiUpdateCategory,
} from "@/api/endpoints/category";
import { BaseSheet } from "@/components/base/sheet";
import type { Category } from "@/types/category";
import { useCallback, useEffect, useState } from "react";
import { CategoryForm } from "./category-form";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";

interface CategorySheetProps {
  type?: "add" | "edit" | "detail";
  categoryData?: Category;
  loadData: () => void;
  trigger?: React.ReactNode;
}

export const CategorySheet = ({
  type = "add",
  categoryData,
  loadData,
  trigger,
}: CategorySheetProps) => {
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

  const loadDetailCategory = useCallback(async (id: string) => {
    const { data } = await apiGetDetailCategory(id);
    if (data) {
      setForm({
        name: data?.name,
        code: data?.code,
      });
    }
  }, []);

  const submitCategory = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { data, error } =
      type === "add"
        ? await apiCreateCategory({ ...form, active: true })
        : await apiUpdateCategory(categoryData?.id as string, {
            ...form,
            active: true,
          });
    if (data) {
      resetForm();
      loadData();
      setSubmitStatus({
        isOpen: true,
        type: "success",
        message: "Your data is saved!",
      });
      setState((prev) => ({
        ...prev,
        show: false,
      }));
    } else {
      setSubmitStatus({
        isOpen: true,
        type: "error",
        message: error?.message || "",
      });
    }
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  };

  useEffect(() => {
    if (state.show) {
      if (type !== "add" && categoryData?.id) {
        loadDetailCategory(categoryData.id);
      }
    }
  }, [type, state.show, loadDetailCategory]);

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
            ? "Add Category"
            : type === "edit"
            ? `Edit Category ${categoryData?.name}`
            : `Detail Category ${categoryData?.name}`
        }
        footer={
          type !== "detail" && (
            <BaseButton disabled={state.loading} onClick={submitCategory}>
              {state.loading
                ? "Loading..."
                : type === "add"
                ? "Add Category"
                : "Update Category"}
            </BaseButton>
          )
        }
      >
        <CategoryForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
