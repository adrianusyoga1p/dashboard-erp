import {
  apiCreateCustomer,
  apiGetDetailCustomer,
  apiUpdateCustomer,
} from "@/api/endpoints/customer";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import { BaseSheet } from "@/components/base/sheet";
import type { Customer, CustomerPayload } from "@/types/customer";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CustomerForm } from "./customer-form";

interface CustomerSheetProps {
  type?: "add" | "edit" | "detail";
  customerData?: Customer;
  loadData: () => void;
  trigger?: ReactNode;
}

export const CustomerSheet = ({
  type = "add",
  customerData,
  loadData,
  trigger,
}: CustomerSheetProps) => {
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

  const [form, setForm] = useState<CustomerPayload>({
    name: "",
    storeName: "",
    address: "",
    phoneNumber: "",
    latitude: null,
    longitude: null,
    email: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      storeName: "",
      address: "",
      phoneNumber: "",
      latitude: null,
      longitude: null,
      email: "",
    });
  };

  const loadDetailCustomer = useCallback(async (id: string) => {
    const { data } = await apiGetDetailCustomer(id);
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data.name,
        email: data.email as string,
        phoneNumber: data.phoneNumber,
        storeName: data.storeName,
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
        address: data.address,
      }));
    }
  }, []);

  const submitCustomer = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { error } =
      type === "add"
        ? await apiCreateCustomer(form)
        : await apiUpdateCustomer(customerData?.id as string, form);
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
      if (type !== "add" && customerData?.id) {
        loadDetailCustomer(customerData.id);
      }
    }
  }, [type, state.show, loadDetailCustomer, customerData?.id]);

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
            if (type === "add") {
              resetForm();
            }
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
          onClick={submitCustomer}
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
            ? "Add Customer"
            : type === "edit"
            ? `Edit Customer ${customerData?.name}`
            : `Detail Customer ${customerData?.name}`
        }
        footer={type !== "detail" && <SheetFooter />}
      >
        <CustomerForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
