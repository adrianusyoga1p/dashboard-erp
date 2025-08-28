import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { BaseTextarea } from "@/components/base/textarea";
import type { UnitCategory, UnitPayload } from "@/types/unit";
import type { ChangeEvent } from "react";
import type React from "react";

interface UnitFormContentProps {
  form: UnitPayload;
  setForm: React.Dispatch<React.SetStateAction<UnitPayload>>;
  type: "add" | "edit" | "detail";
  unitCategory: UnitCategory[];
}

export const UnitForm = ({
  form,
  setForm,
  type = "add",
  unitCategory,
}: UnitFormContentProps) => {
  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
        placeholder="Input unit name"
        label="Unit Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input unit code"
        label="Unit Code"
        onChange={onChange}
        name="code"
        value={form.code as string}
        disabled={type == "detail"}
      />
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">Unit Category</label>
          <select
            value={form.unitCategoryId as string}
            onChange={onChange}
            disabled={type === "detail"}
            name="unitCategoryId"
            className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
          >
            <option value="">Select unit category</option>
            {unitCategory &&
              unitCategory.map((data: UnitCategory) => (
                <option key={data.id} value={data.id}>
                  {data.name}
                </option>
              ))}
          </select>
        </div>
        {type !== "detail" && (
          <BaseButton
            label="Add Category"
            className="text-nowrap h-fit w-fit"
            size="sm"
            href="/unit-category"
          />
        )}
      </div>
      <BaseTextarea
        placeholder="Input unit description"
        label="Unit Description"
        onChange={onChange}
        name="description"
        value={form.description as string}
        disabled={type == "detail"}
      />
    </div>
  );
};
