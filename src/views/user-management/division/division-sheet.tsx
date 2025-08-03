import {
  apiCreateDivision,
  apiGetDetailDivision,
  apiUpdateDivision,
} from "@/api/endpoints/division";
import { BaseButton } from "@/components/base/button";
import { BaseSheet } from "@/components/base/sheet";
import type { Division, DivisionPayload } from "@/types/division";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { DivisionForm } from "./division-form";
import BaseAlert from "@/components/base/alert";
import type { Access } from "@/types/access";
import { apiGetListAccess } from "@/api/endpoints/access";

interface DivisionSheetProps {
  type?: "add" | "edit" | "detail";
  divisionData?: Division;
  loadData: () => void;
  trigger?: ReactNode;
}

export const DivisionSheet = ({
  type = "add",
  divisionData,
  loadData,
  trigger,
}: DivisionSheetProps) => {
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

  const [form, setForm] = useState<DivisionPayload>({
    name: "",
    displayName: "",
    accesses: null,
    active: true,
  });

  const resetForm = () => {
    setForm({
      name: "",
      displayName: "",
      accesses: null,
      active: true,
    });
  };

  const loadDetailDivision = useCallback(async (id: string) => {
    const { data } = await apiGetDetailDivision(id);
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data?.name,
        displayName: data.displayName,
        active: data.active,
        accesses:
          data.accesses?.map((access) => ({
            accessId: access.accessId as string,
          })) || null,
      }));
    }
  }, []);

  const [access, setAccess] = useState<Access[]>([]);
  const loadAccess = async (page = 1) => {
    let allData: Access[] = [];

    while (true) {
      const res = await apiGetListAccess({
        page,
        limit: 40,
        order: "desc",
        orderBy: "createdAt",
      });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setAccess(allData);
  };

  const submitDivision = async () => {
    setState(() => ({
      loading: true,
      show: true,
    }));
    const { data, error } =
      type === "add"
        ? await apiCreateDivision(form)
        : await apiUpdateDivision(divisionData?.id as string, form);
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
      if ((type === "edit" || type === "detail") && divisionData?.id) {
        loadDetailDivision(divisionData.id);
      }
      loadAccess();
    }
  }, [type, state.show, loadDetailDivision, divisionData?.id]);

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
            ? "Add Division"
            : type === "edit"
            ? `Edit Division ${divisionData?.displayName}`
            : `Division ${divisionData?.displayName}`
        }
        footer={
          type !== "detail" && (
            <BaseButton disabled={state.loading} onClick={submitDivision}>
              {state.loading
                ? "Loading..."
                : type === "add"
                ? "Add Division"
                : "Update Division"}
            </BaseButton>
          )
        }
      >
        <DivisionForm
          type={type}
          access={access}
          form={form}
          setForm={setForm}
        />
      </BaseSheet>
    </>
  );
};
