import { BaseInput } from "@/components/base/input";
import type { Unit, UnitConversionPayload } from "@/types/unit";
import type { ChangeEvent } from "react";
import type React from "react";

interface UnitConversionFormContentProps {
  form: UnitConversionPayload;
  setForm: React.Dispatch<React.SetStateAction<UnitConversionPayload>>;
  type: "add" | "edit" | "detail";
  units: Unit[];
}

export const UnitConversionForm = ({
  form,
  setForm,
  type = "add",
  units,
}: UnitConversionFormContentProps) => {
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
        type="number"
        placeholder="Input unit conversion factor"
        label="Unit Conversion Factor"
        onChange={onChange}
        name="factor"
        value={form.factor as number}
        disabled={type == "detail"}
      />
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">Base Unit</label>
          <select
            value={form.baseUnitId as string}
            onChange={onChange}
            disabled={type === "detail"}
            name="baseUnitId"
            className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
          >
            <option value="">Select base unit conversion</option>
            {units &&
              units.map((data: Unit) => (
                <option key={data.id} value={data.id}>
                  {data.name} - {data.code}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">To Unit</label>
          <select
            value={form.toUnitId as string}
            onChange={onChange}
            disabled={type === "detail"}
            name="toUnitId"
            className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
          >
            <option value="">Select to unit conversion</option>
            {units &&
              units
                .filter((unit) => unit.id !== form.baseUnitId)
                .map((data: Unit) => (
                  <option key={data.id} value={data.id}>
                    {data.name} - {data.code}
                  </option>
                ))}
          </select>
        </div>
      </div>
    </div>
  );
};
