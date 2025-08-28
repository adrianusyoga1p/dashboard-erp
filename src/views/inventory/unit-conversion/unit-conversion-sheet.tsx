import { apiGetListUnit } from "@/api/endpoints/unit";
import { apiCreateUnitConversion } from "@/api/endpoints/unit-conversion";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import type { Unit, UnitConversion, UnitConversionPayload } from "@/types/unit";
import { useEffect, useState, type ReactNode } from "react";
import { UnitConversionForm } from "./unit-conversion-form";
import { BaseSheet } from "@/components/base/sheet";

interface UnitConversionSheetProps {
  type?: "add" | "edit" | "detail";
  unitConversion?: UnitConversion;
  loadData: () => void;
  trigger?: ReactNode;
}

export const UnitConversionSheet = ({
  type = "add",
  unitConversion,
  loadData,
  trigger,
}: UnitConversionSheetProps) => {
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

  const [form, setForm] = useState<UnitConversionPayload>({
    name: "",
    baseUnitId: "",
    toUnitId: "",
    factor: null,
  });

  const resetForm = () => {
    setForm({
      name: "",
      baseUnitId: "",
      toUnitId: "",
      factor: null,
    });
  };

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

  useEffect(() => {
    if (state.show) {
      loadUnits();
    }
  }, [type, state.show]);

  const submitUnitConversion = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { error } = await apiCreateUnitConversion({
      ...form,
      factor: Number(form.factor),
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
          onClick={submitUnitConversion}
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
            ? "Add Unit Conversion"
            : type === "edit"
            ? `Edit Unit Conversion ${unitConversion?.name}`
            : `Detail Unit Conversion ${unitConversion?.name}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <UnitConversionForm
          type={type}
          form={form}
          setForm={setForm}
          units={units}
        />
      </BaseSheet>
    </>
  );
};
