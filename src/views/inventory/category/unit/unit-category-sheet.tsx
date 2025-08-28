import {
  apiCreateUnitCategory,
  apiGetDetailUnitCategory,
  apiUpdateUnitCategory,
} from "@/api/endpoints/category";
import { BaseSheet } from "@/components/base/sheet";
import { useCallback, useEffect, useState } from "react";
import { UnitCategoryForm } from "./unit-category-form";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import type { UnitCategory } from "@/types/unit";

interface UnitCategorySheetProps {
  type?: "add" | "edit" | "detail";
  unitCategoryData?: UnitCategory;
  loadData: () => void;
  trigger?: React.ReactNode;
}

export const UnitCategorySheet = ({
  type = "add",
  unitCategoryData,
  loadData,
  trigger,
}: UnitCategorySheetProps) => {
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
  });

  const resetForm = () => {
    setForm({
      name: "",
    });
  };

  const loadDetailUnitCategory = useCallback(async (id: string) => {
    const { data } = await apiGetDetailUnitCategory(id);
    if (data) {
      setForm({
        name: data?.name,
      });
    }
  }, []);

  const submitCategory = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { error } =
      type === "add"
        ? await apiCreateUnitCategory(form)
        : await apiUpdateUnitCategory(unitCategoryData?.id as string, form);
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
      if (type !== "add" && unitCategoryData?.id) {
        loadDetailUnitCategory(unitCategoryData.id);
      }
    }
  }, [type, state.show, loadDetailUnitCategory]);

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
          onClick={submitCategory}
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
            ? "Add Unit Category"
            : type === "edit"
            ? `Edit Unit Category ${unitCategoryData?.name}`
            : `Detail Unit Category ${unitCategoryData?.name}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <UnitCategoryForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
