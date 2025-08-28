import { BaseInput } from "@/components/base/input";
import { type ChangeEvent } from "react";

interface UnitCategoryFormContentProps {
  type: "add" | "edit" | "detail";
  form: { name: string };
  setForm: React.Dispatch<React.SetStateAction<{ name: string }>>;
}

export const UnitCategoryForm = ({
  type = "add",
  form,
  setForm,
}: UnitCategoryFormContentProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        placeholder="Input category name"
        label="Category Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type === "detail"}
      />
    </div>
  );
};
