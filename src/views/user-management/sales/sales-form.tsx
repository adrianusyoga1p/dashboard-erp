import { BaseInput } from "@/components/base/input";
import type { SalesPayload } from "@/types/sales";
import { type ChangeEvent } from "react";

interface SalesFormContentProps {
  form: SalesPayload;
  setForm: React.Dispatch<React.SetStateAction<SalesPayload>>;
  type: "add" | "edit" | "detail";
}

export const SalesForm = ({
  form,
  setForm,
  type = "add",
}: SalesFormContentProps) => {
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
        placeholder="Input sales name"
        label="Sales Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input sales full name"
        label="Sales Full Name"
        onChange={onChange}
        name="fullName"
        value={form.fullName as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="email"
        placeholder="Input sales email"
        label="Sales Email"
        onChange={onChange}
        name="email"
        value={form.email as string}
        disabled={type == "detail"}
      />
      {type === "add" && (
        <BaseInput
          type="password"
          placeholder="Input sales password"
          label="Sales Password"
          onChange={onChange}
          name="password"
          value={form.password as string}
        />
      )}
      <BaseInput
        type="text"
        placeholder="Input sales pin"
        label="Sales PIN"
        onChange={onChange}
        name="pin"
        value={form.pin as string}
        disabled={type == "detail"}
      />
      <div className="w-full">
        <label className="font-semibold text-sm block mb-2">Gender</label>
        <select
          disabled={type == "detail"}
          value={form.gender as string}
          onChange={onChange}
          name="gender"
          className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <BaseInput
        type="text"
        placeholder="Input sales phonenumber"
        label="Sales Phone Number"
        onChange={onChange}
        name="phoneNumber"
        value={form.phoneNumber as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input sales address"
        label="Sales Address"
        onChange={onChange}
        name="address"
        value={form.address as string}
        disabled={type == "detail"}
      />
    </div>
  );
};
