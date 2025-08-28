import { BaseInput } from "@/components/base/input";
import { type ChangeEvent } from "react";

interface ProductCategoryFormContentProps {
  type: "add" | "edit" | "detail";
  form: { code: string; name: string };
  setForm: React.Dispatch<React.SetStateAction<{ code: string; name: string }>>;
}

export const ProductCategoryForm = ({
  type = "add",
  form,
  setForm,
}: ProductCategoryFormContentProps) => {
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
      <BaseInput
        type="text"
        placeholder="Input category code"
        label="Category Code"
        onChange={onChange}
        name="code"
        value={form.code as string}
        disabled={type === "detail"}
      />
    </div>
  );
};
