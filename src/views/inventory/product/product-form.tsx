import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { BaseSwitch } from "@/components/base/switch";
import { BaseTextarea } from "@/components/base/textarea";
import type { Category } from "@/types/category";
import type { ProductPayload } from "@/types/product";
import { type ChangeEvent } from "react";

interface ProductFormContentProps {
  type?: "add" | "detail" | "edit";
  form: ProductPayload;
  setForm: React.Dispatch<React.SetStateAction<ProductPayload>>;
  category: Category[];
}

export const ProductForm = ({
  type = "add",
  form,
  setForm,
  category,
}: ProductFormContentProps) => {
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
        placeholder="Input product name"
        label="Product Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type === "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input product brand"
        label="Product Brand"
        onChange={onChange}
        name="brandName"
        value={form.brandName as string}
        disabled={type === "detail"}
      />
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">
            Product Category
          </label>
          <select
            value={form.categoryId as string}
            onChange={onChange}
            disabled={type === "detail"}
            name="categoryId"
            className="px-3 py-2.5 w-full border border-black/30 rounded-lg focus:outline-black"
          >
            <option value="">Select product category</option>
            {category &&
              category.map((data: Category) => (
                <option key={data.id} value={data.id}>
                  {data.name} - {data.code}
                </option>
              ))}
          </select>
        </div>
        {type !== "detail" && (
          <BaseButton
            label="Add Category"
            className="text-nowrap h-fit w-fit"
            size="sm"
            href="/category"
          />
        )}
      </div>
      <BaseInput
        type="text"
        placeholder="Input product code"
        label="Product Code"
        onChange={onChange}
        name="code"
        value={form.code as string}
        disabled={type === "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input product sku"
        label="Product SKU"
        onChange={onChange}
        name="productSku"
        disabled={type === "detail"}
        value={form.productSku as string}
      />
      <BaseInput
        type="number"
        placeholder="Input product price"
        label="Product Price"
        onChange={onChange}
        name="price"
        disabled={type === "detail"}
        value={form.price as number}
      />
      <BaseTextarea
        placeholder="Input product description"
        label="Product Description"
        onChange={onChange}
        name="description"
        disabled={type === "detail"}
        value={form.description as string}
      />
      <BaseSwitch
        checked={form.active}
        label="Product Active"
        disabled={type === "detail"}
        name="active"
        onCheckedChange={(checked: boolean) =>
          setForm({
            ...form,
            active: checked,
          })
        }
      />
    </div>
  );
};
