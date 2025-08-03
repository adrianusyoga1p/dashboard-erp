import { apiGetListProduct } from "@/api/endpoints/product";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { BaseTooltip } from "@/components/base/tooltip";
import type { Product } from "@/types/product";
import type { StockInPayload } from "@/types/stock";
import { useEffect, useState, type ChangeEvent } from "react";
import { LuPlus } from "react-icons/lu";

interface StockInFormProps {
  form: StockInPayload;
  setForm: React.Dispatch<React.SetStateAction<StockInPayload>>;
}

export const StockInForm = ({ form, setForm }: StockInFormProps) => {
  const [product, setProduct] = useState<Product[]>([]);
  const loadProduct = async (page = 1) => {
    let allData: Product[] = [];

    while (true) {
      const res = await apiGetListProduct({ page, limit: 20 });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setProduct(allData);
  };

  useEffect(() => {
    loadProduct();
  }, []);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | number | boolean = value;

    if (type === "number") {
      newValue = value === "" ? "" : Number(value); // agar "" tidak jadi NaN
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <BaseInput
        type="number"
        placeholder="Input stock qty"
        label="Stock Product Qty"
        onChange={onChange}
        name="qty"
        value={form.qty as number}
      />
      <BaseInput
        type="number"
        placeholder="Input product min qty"
        label="Product Min Qty"
        name="minimumStock"
        onChange={onChange}
        value={form.minimumStock as number}
      />

      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">Product</label>
          <div className="flex gap-4 items-center">
            <select
              value={form.productId as string}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const selectedProductId = e.target.value;
                const selectedProduct = product.find(
                  (p) => p.id === selectedProductId
                );

                setForm({
                  ...form,
                  productId: selectedProductId,
                  minimumStock: selectedProduct?.minimumStock || null,
                });
              }}
              className="px-3 py-2.5 h-10 w-full border border-black/30 rounded-lg focus:outline-black"
            >
              <option value="">Select product</option>
              {product &&
                product.map((data: Product) => (
                  <option key={data.id} value={data.id}>
                    {data.name} - {data.code}
                  </option>
                ))}
            </select>
            <BaseTooltip
              asChild={false}
              trigger={
                <BaseButton href="/product" className="h-10 w-10 p-0">
                  <LuPlus />
                </BaseButton>
              }
            >
              <p>Add Product</p>
            </BaseTooltip>
          </div>
        </div>
      </div>
      <BaseInput
        placeholder="Input stock in reason"
        label="Reason"
        name="reason"
        onChange={onChange}
        value={form.reason as string}
      />
    </div>
  );
};
