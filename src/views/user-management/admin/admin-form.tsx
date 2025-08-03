import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import type { AdminPayload } from "@/types/admin";
import type { Division } from "@/types/division";
import type { ChangeEvent } from "react";

interface AdminFormContentProps {
  type?: "add" | "edit" | "detail";
  form: AdminPayload & {
    fullName: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    address: string | null;
  };
  setForm: React.Dispatch<
    React.SetStateAction<
      AdminPayload & {
        fullName: string | null;
        birthDate: string | null;
        birthPlace: string | null;
        address: string | null;
      }
    >
  >;
  division: Division[];
}

export const AdminForm = ({
  form,
  setForm,
  type,
  division,
}: AdminFormContentProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="space-y-6 p-4 relative overflow-y-auto">
      <BaseInput
        type="text"
        placeholder="Input admin name"
        label="Admin Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type === "detail"}
      />
      <BaseInput
        type="email"
        placeholder="Input admin email"
        label="Admin Email"
        onChange={onChange}
        name="email"
        value={form.email as string}
        disabled={type === "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input admin phonenumber"
        label="Admin Phone Number"
        onChange={onChange}
        name="phoneNumber"
        value={form.phoneNumber as string}
        disabled={type === "detail"}
      />
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">Division</label>
          <select
            disabled={type === "detail"}
            value={form.divisionId as string}
            onChange={onChange}
            name="divisionId"
            className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
          >
            <option value="">Select division</option>
            {division &&
              division.map((data: Division) => (
                <option key={data.id} value={data.id}>
                  {data.displayName}
                </option>
              ))}
          </select>
        </div>
        {type !== "detail" && (
          <BaseButton
            label="Add Division"
            className="text-nowrap h-fit w-fit"
            size="sm"
            href="/division"
          />
        )}
      </div>
      <div className="w-full">
        <label className="font-semibold text-sm block mb-2">Gender</label>
        <select
          value={form.gender as string}
          onChange={onChange}
          disabled={type === "detail"}
          name="gender"
          className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      {type === "add" ? (
        <BaseInput
          type="password"
          name="password"
          placeholder="Input admin password"
          label="Admin Password"
          onChange={onChange}
          value={form.password as string}
        />
      ) : (
        <>
          <BaseInput
            type="text"
            placeholder="Input admin full name"
            label="Admin Full Name"
            name="fullName"
            onChange={onChange}
            value={form.fullName as string}
            disabled={type === "detail"}
          />
          <BaseInput
            type="text"
            placeholder="Input admin address"
            label="Admin Address"
            name="address"
            onChange={onChange}
            value={form.address as string}
            disabled={type === "detail"}
          />
          <BaseInput
            type="text"
            placeholder="Input admin birth place"
            label="Admin Birth Place"
            name="birthPlace"
            onChange={onChange}
            disabled={type === "detail"}
            value={form.birthPlace as string}
          />
        </>
      )}
    </div>
  );
};
