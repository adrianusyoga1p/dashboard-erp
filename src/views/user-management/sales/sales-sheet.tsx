import {
  apiCreateSales,
  apiGetDetailSales,
  apiUpdateSales,
} from "@/api/endpoints/sales";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import type { Sales, SalesPayload } from "@/types/sales";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { SalesForm } from "./sales-form";
import { BaseSheet } from "@/components/base/sheet";

interface SalesSheetProps {
  type?: "add" | "edit" | "detail";
  salesData?: Sales;
  loadData: () => void;
  trigger?: ReactNode;
}

export const SalesSheet = ({
  type = "add",
  salesData,
  loadData,
  trigger,
}: SalesSheetProps) => {
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

  const [form, setForm] = useState<SalesPayload>({
    name: "",
    pin: "",
    email: "",
    password: null,
    gender: "male",
    phoneNumber: "",
    fullName: null,
    birthDate: null,
    birthPlace: null,
    address: null,
    active: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      pin: "",
      email: "",
      password: null,
      gender: "male",
      phoneNumber: "",
      fullName: null,
      birthDate: null,
      birthPlace: null,
      address: null,
      active: true,
    });
  };

  const loadDetailSales = useCallback(async (id: string) => {
    const { data } = await apiGetDetailSales(id);
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data.name,
        pin: data.pin,
        email: data.user.email as string,
        gender: data.user.gender,
        phoneNumber: data.user.phoneNumber,
        fullName: data.user.fullName,
        birthDate: data.user.birthDate,
        birthPlace: data.user.birthPlace,
        address: data.user.address,
        active: data.user.active,
      }));
    }
  }, []);

  const submitSales = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { data, error } =
      type === "add"
        ? await apiCreateSales(form)
        : await apiUpdateSales(salesData?.id as string, {
            ...form,
            password: undefined,
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
      if (type !== "add" && salesData?.id) {
        loadDetailSales(salesData.id);
      }
    }
  }, [type, state.show, loadDetailSales, salesData?.id]);

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
            ? "Add Sales"
            : type === "edit"
            ? `Edit Sales ${salesData?.name}`
            : `Detail Sales ${salesData?.name}`
        }
        footer={
          type !== "detail" && (
            <BaseButton disabled={state.loading} onClick={submitSales}>
              {state.loading
                ? "Loading..."
                : type === "add"
                ? "Add Sales"
                : "Update Sales"}
            </BaseButton>
          )
        }
      >
        <SalesForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
