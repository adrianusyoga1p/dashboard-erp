import { apiGetListProduct } from "@/api/endpoints/product";
import { BaseButton } from "@/components/base/button";
import BaseTable from "@/components/base/table";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";
import { LuPencil } from "react-icons/lu";

export const TableProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
  });
  const [totalPage, setTotalPage] = useState(1);

  const onPageChange = (page: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page,
    }));
  };

  const loadProducts = useCallback(async () => {
    const { data, error } = await apiGetListProduct({
      page: params.page,
      limit: params.limit,
      order: params.order,
      orderBy: params.orderBy,
    });
    if (!error && data.data) {
      setProducts(data.data);
      if (data.meta) {
        setTotalPage(data.meta.totalPage ?? 1);
      }
    }
  }, [params.page, params.limit, params.order, params.orderBy]);

  const productTableSlots = {
    actions: (product: Product) => (
      <div className="flex items-center justify-center">
        <BaseButton model="outline" size="sm" onClick={() => console.log("Edit", product.id)}>
          <LuPencil />
        </BaseButton>
      </div>
    ),
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  return (
    <BaseTable<Product>
      columns={[
        { title: "#", key: "id", type: "increment" },
        { title: "Name", key: "name" },
        { title: "Brand Name", key: "brandName" },
        { title: "Category", key: "category.name" },
        { title: "Price", key: "price", type: "price" },
        { title: "Qty", key: "currentQty" },
        { title: "Minimum Stock", key: "minimumStock" },
        { title: "Actions", key: "actions", type: "slot" },
      ]}
      source={products}
      page={params.page}
      slot={productTableSlots}
      total={totalPage}
      limit={params.limit}
      onPageChange={onPageChange}
    />
  );
};
