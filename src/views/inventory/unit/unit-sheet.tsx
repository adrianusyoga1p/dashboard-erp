import {
  apiCreateUnit,
  apiGetDetailUnit,
  apiUpdateUnit,
} from "@/api/endpoints/unit";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import { BaseSheet } from "@/components/base/sheet";
import type { Unit, UnitCategory, UnitPayload } from "@/types/unit";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { UnitForm } from "./unit-form";
import { apiGetListUnitCategory } from "@/api/endpoints/category";

interface UnitSheetProps {
  type?: "add" | "edit" | "detail";
  unitData?: Unit;
  loadData: () => void;
  trigger?: ReactNode;
}

export const UnitSheet = ({
  type = "add",
  unitData,
  loadData,
  trigger,
}: UnitSheetProps) => {
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

  const [form, setForm] = useState<UnitPayload>({
    name: "",
    code: "",
    unitCategoryId: null,
    description: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      code: "",
      unitCategoryId: null,
      description: "",
    });
  };

  const [unitCategory, setUnitCategory] = useState<UnitCategory[]>([]);
  const loadUnitCategory = async (page = 1) => {
    let allData: UnitCategory[] = [];

    while (true) {
      const res = await apiGetListUnitCategory({ page, limit: 20 });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setUnitCategory(allData);
  };

  const loadDetailUnit = useCallback(async (id: string) => {
    const { data } = await apiGetDetailUnit(id);
    if (data) {
      setForm({
        name: data.name,
        code: data.code,
        unitCategoryId: data.unitCategoryId,
        description: data.description,
      });
    }
  }, []);

  const submitUnit = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));

    const { error } =
      type === "add"
        ? await apiCreateUnit(form)
        : await apiUpdateUnit(unitData?.id || "2", form);

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
      if (type !== "add" && unitData?.id) {
        loadDetailUnit(unitData.id);
      }
      loadUnitCategory();
    }
  }, [type, state.show, loadDetailUnit, unitData]);

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
          onClick={submitUnit}
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
            ? "Add Unit"
            : type === "edit"
            ? `Edit Unit ${unitData?.name}`
            : `Detail Unit ${unitData?.name}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <UnitForm
          unitCategory={unitCategory}
          type={type}
          form={form}
          setForm={setForm}
        />
      </BaseSheet>
    </>
  );
};
