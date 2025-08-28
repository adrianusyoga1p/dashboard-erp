import { apiGetListProduct } from "@/api/endpoints/product";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import { BaseTooltip } from "@/components/base/tooltip";
import type { Product } from "@/types/product";
import type { StocksPayload } from "@/types/stock";
import { useEffect, useState, type ChangeEvent } from "react";
import { LuPlus } from "react-icons/lu";

interface StockOutFormProps {
  form: Omit<StocksPayload, "minimumStock">;
  setForm: React.Dispatch<
    React.SetStateAction<Omit<StocksPayload, "minimumStock">>
  >;
}

export const StockOutForm = ({ form, setForm }: StockOutFormProps) => {
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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <BaseInput
        type="number"
        placeholder="Input stock out qty"
        label="Stock Product Qty"
        onChange={onChange}
        name="qty"
        value={form.qty as number}
      />
      <div className="space-y-3">
        <div className="w-full">
          <label className="font-semibold text-sm block mb-2">Product</label>
          <div className="flex gap-4 items-center">
            <select
              value={form.productId as string}
              onChange={onChange}
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
        placeholder="Input stock out reason"
        label="Reason"
        name="reason"
        onChange={onChange}
        value={form.reason as string}
      />
    </div>
  );
};
