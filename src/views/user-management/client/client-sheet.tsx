import {
  apiCreateClient,
  apiGetDetailClient,
  apiUpdateClient,
} from "@/api/endpoints/client";
import BaseAlert from "@/components/base/alert";
import { BaseButton } from "@/components/base/button";
import { BaseSheet } from "@/components/base/sheet";
import type { Client, ClientPayload } from "@/types/client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ClientForm } from "./client-form";

interface ClientSheetProps {
  type?: "add" | "edit" | "detail";
  clientData?: Client;
  loadData: () => void;
  trigger?: ReactNode;
}

export const ClientSheet = ({
  type = "add",
  clientData,
  loadData,
  trigger,
}: ClientSheetProps) => {
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

  const [form, setForm] = useState<ClientPayload>({
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

  const loadDetailClient = useCallback(async (id: string) => {
    const { data } = await apiGetDetailClient(id);
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

  const submitClient = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { data, error } =
      type === "add"
        ? await apiCreateClient(form)
        : await apiUpdateClient(clientData?.id as string, form);
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
      if (type !== "add" && clientData?.id) {
        loadDetailClient(clientData.id);
      }
    }
  }, [type, state.show, loadDetailClient, clientData?.id]);

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
            ? "Add Client"
            : type === "edit"
            ? `Edit Client ${clientData?.name}`
            : `Detail Client ${clientData?.name}`
        }
        footer={
          type !== "detail" && (
            <BaseButton disabled={state.loading} onClick={submitClient}>
              {state.loading
                ? "Loading..."
                : type === "add"
                ? "Add Client"
                : "Update Client"}
            </BaseButton>
          )
        }
      >
        <ClientForm type={type} form={form} setForm={setForm} />
      </BaseSheet>
    </>
  );
};
