import { BaseInput } from "@/components/base/input";
import { type ChangeEvent } from "react";

interface CategoryFormContentProps {
  type: "add" | "edit" | "detail";
  form: { code: string; name: string };
  setForm: React.Dispatch<React.SetStateAction<{ code: string; name: string }>>;
}

export const CategoryForm = ({
  type = "add",
  form,
  setForm,
}: CategoryFormContentProps) => {
  return (
    <div className="space-y-6 p-4 relative overflow-y-auto">
      <BaseInput
        type="text"
        placeholder="Input category name"
        label="Category Name"
        onChange={(e: ChangeEvent) =>
          setForm({
            ...form,
            name: (e.target as HTMLInputElement)?.value,
          })
        }
        value={form.name as string}
        disabled={type === "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input category code"
        label="Category Code"
        onChange={(e: ChangeEvent) =>
          setForm({
            ...form,
            code: (e.target as HTMLInputElement)?.value,
          })
        }
        value={form.code as string}
        disabled={type === "detail"}
      />
    </div>
  );
};
