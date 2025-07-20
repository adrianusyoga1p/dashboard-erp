import { apiGetListCategory } from "@/api/endpoints/category";
import { apiCreateProduct } from "@/api/endpoints/product";
import { BaseButton } from "@/components/base/button";
import { BaseCollapsed } from "@/components/base/collapsed";
import { BaseDropdown } from "@/components/base/dropdown";
// import { apiGetListUnit } from "@/api/endpoints/unit";
import { BaseInput } from "@/components/base/input";
import { BaseTextarea } from "@/components/base/textarea";
import type { Category } from "@/types/category";
// import type { Unit } from "@/types/unit";
import { useState, type ChangeEvent } from "react";

export const ProductAdd = () => {
  const [form, setForm] = useState({
    name: "",
    brandName: "",
    code: "",
    description: "",
    categoryId: "",
    price: 0,
    productSku: "",
    active: false,
  });

  const resetForm = () => {
    setForm({
      name: "",
      brandName: "",
      categoryId: "",
      code: "",
      description: "",
      price: 0,
      productSku: "",
      active: false,
    });
  };

  // const [unit, setUnit] = useState<Unit[]>([]);
  // const loadUnit = async (page = 1) => {
  //   let allData: Unit[] = [];

  //   while (true) {
  //     const res = await apiGetListUnit({ page, limit: 20 });
  //     if (res.error) break;

  //     const { data, meta } = res.data;
  //     allData = [...allData, ...data];

  //     const totalPage = meta.totalPage ?? 1;

  //     if (page >= totalPage) break;
  //     page++;
  //   }

  //   setUnit(allData);
  // };

  const [category, setCategory] = useState<Category[]>([]);
  const loadCategory = async (page = 1) => {
    let allData: Category[] = [];

    while (true) {
      const res = await apiGetListCategory({ page, limit: 20 });
      if (res.error) break;

      const { data, meta } = res.data;
      allData = [...allData, ...data];

      const totalPage = meta.totalPage ?? 1;

      if (page >= totalPage) break;
      page++;
    }

    setCategory(allData);
  };

  const submitProduct = async (active: boolean) => {
    const res = await apiCreateProduct({
      ...form,
      active,
    });
    if (res?.error) return;
    if (res.data) {
      resetForm();
      // navigate("/");
    }
  };
  return (
    <BaseCollapsed
      head={
        <BaseButton
          onClick={() => loadCategory()}
          className="ml-auto"
          label="Add Product"
        />
      }
      defaultOpen={false}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <BaseInput
              type="text"
              placeholder="Input product name"
              label="Product Name"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  name: (e.target as HTMLInputElement)?.value,
                })
              }
            />
            <BaseInput
              type="text"
              placeholder="Input product brand"
              label="Product Brand"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  brandName: (e.target as HTMLInputElement)?.value,
                })
              }
            />
            <div className="space-y-3">
              <div className="w-full">
                <label className="font-semibold text-sm block mb-2">
                  Product Category
                </label>
                <select
                  onChange={(e: ChangeEvent) =>
                    setForm({
                      ...form,
                      categoryId: (e.target as HTMLSelectElement)?.value,
                    })
                  }
                  className="p-3 w-full border border-black/30 rounded-lg focus:outline-black"
                >
                  <option value="">Select product category</option>
                  {category &&
                    category.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.name} - {data.code}
                      </option>
                    ))}
                </select>
              </div>
              {category.length <= 0 && (
                <BaseButton
                  label="Add Category"
                  className="text-nowrap h-fit mt-auto"
                  size="sm"
                />
              )}
            </div>
          </div>
          <div className="space-y-6">
            <BaseInput
              type="text"
              placeholder="Input product code"
              label="Product Code"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  code: (e.target as HTMLInputElement)?.value,
                })
              }
            />
            <BaseInput
              type="text"
              placeholder="Input product sku"
              label="Product SKU"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  productSku: (e.target as HTMLInputElement)?.value,
                })
              }
            />
            <BaseInput
              type="number"
              placeholder="Input product price"
              label="Product Price"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  price: Number((e.target as HTMLInputElement)?.value),
                })
              }
            />
          </div>
          {/* <div className="space-y-6">
          <div className="flex gap-6 items-center">
            <div>
              <label className="font-semibold text-sm block mb-2">
                Base Unit
              </label>
              <select
                onChange={(e: ChangeEvent) =>
                  setForm({
                    ...form,
                    baseUnitId: (e.target as HTMLSelectElement)?.value,
                  })
                }
                className="p-3 w-full border border-black/30 rounded-lg focus:outline-black"
              >
                <option value="">Select base unit product</option>
                {unit &&
                  unit.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>
            <p>to</p>
            <div>
              <label className="font-semibold text-sm block mb-2">
                Smallest Unit
              </label>
              <select
                onChange={(e: ChangeEvent) =>
                  setForm({
                    ...form,
                    smallestUnitId: (e.target as HTMLSelectElement)?.value,
                  })
                }
                className="p-3 w-full border border-black/30 rounded-lg focus:outline-black"
              >
                <option value="">Select smallest unit product</option>
                {unit &&
                  unit.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={(e: ChangeEvent) =>
                setForm({
                  ...form,
                  isManual: (e.target as HTMLInputElement).checked,
                })
              }
            />
            <span>Manual Conversion</span>
          </label>
          <BaseInput
            type="number"
            placeholder="Input unit factor"
            label="Unit Factor"
            onChange={(e: ChangeEvent) =>
              setForm({
                ...form,
                factor: Number((e.target as HTMLInputElement)?.value),
              })
            }
          />
        </div> */}
        </div>
        <BaseTextarea
          placeholder="Input product description"
          label="Product Description"
          onChange={(e: ChangeEvent) =>
            setForm({
              ...form,
              description: (e.target as HTMLTextAreaElement)?.value,
            })
          }
        />
        <div className="flex items-center gap-4 justify-end">
          <BaseDropdown label="Submit">
            <button
              className="flex rounded-sm items-center p-2 hover:bg-gray-300/20 w-full"
              onClick={() => submitProduct(true)}
            >
              Save
            </button>
            <button
              className="flex rounded-sm items-center p-2 hover:bg-gray-300/20 w-full"
              onClick={() => submitProduct(false)}
            >
              Save as Draft
            </button>
          </BaseDropdown>
        </div>
      </div>
    </BaseCollapsed>
  );
};
