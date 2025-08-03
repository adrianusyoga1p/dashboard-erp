import { BaseButton } from "@/components/base/button";
import { BaseSheet } from "@/components/base/sheet";
import type { Admin, AdminPayload } from "@/types/admin";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AdminForm } from "./admin-form";
import {
  apiCreateAdmin,
  apiGetDetailAdmin,
  apiUpdateAdmin,
} from "@/api/endpoints/admin";
import BaseAlert from "@/components/base/alert";
import type { Division } from "@/types/division";
import { apiGetListDivision } from "@/api/endpoints/division";

interface AdminSheetProps {
  type?: "add" | "edit" | "detail";
  adminData?: Admin;
  loadData: () => void;
  trigger?: ReactNode;
}

export const AdminSheet = ({
  type = "add",
  adminData,
  loadData,
  trigger,
}: AdminSheetProps) => {
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

  const [form, setForm] = useState<
    AdminPayload & {
      fullName: string | null;
      birthDate: string | null;
      birthPlace: string | null;
      address: string | null;
    }
  >({
    name: "",
    email: "",
    password: null,
    gender: "male",
    phoneNumber: "",
    divisionId: "",
    fullName: null,
    birthDate: null,
    birthPlace: null,
    address: null,
  });

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: null,
      gender: "male",
      phoneNumber: "",
      divisionId: "",
      fullName: null,
      birthDate: null,
      birthPlace: null,
      address: null,
    });
  };

  const [division, setDivision] = useState<Division[]>([]);
  const loadDivision = async (page = 1) => {
    let allData: Division[] = [];

    while (true) {
      const res = await apiGetListDivision({
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

    setDivision(allData);
  };

  const loadDetailAdmin = useCallback(async (id: string) => {
    const { data } = await apiGetDetailAdmin(id);
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data?.name,
        email: data?.email,
        gender: data?.user.gender || null,
        divisionId: data?.divisionId || "",
        phoneNumber: data?.user.phoneNumber || null,
        fullName: data.user.fullName || null,
        birthDate: data.user.birthDate || null,
        birthPlace: data.user.birthPlace || null,
        address: data.user.address || null,
      }));
    }
  }, []);

  const submitAdmin = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { data, error } =
      type === "add"
        ? await apiCreateAdmin(form)
        : await apiUpdateAdmin(adminData?.id as string, {
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
      if (type !== "add" && adminData?.id) {
        loadDetailAdmin(adminData.id);
      }
      loadDivision();
    }
  }, [type, state.show, loadDetailAdmin, adminData?.id]);

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
            ? "Add Admin"
            : type === "edit"
            ? `Edit Admin ${adminData?.name}`
            : `Detail Admin ${adminData?.name}`
        }
        footer={
          type !== "detail" && (
            <BaseButton disabled={state.loading} onClick={submitAdmin}>
              {state.loading
                ? "Loading..."
                : type === "add"
                ? "Add Admin"
                : "Update Admin"}
            </BaseButton>
          )
        }
      >
        <AdminForm
          type={type}
          form={form}
          setForm={setForm}
          division={division}
        />
      </BaseSheet>
    </>
  );
};
