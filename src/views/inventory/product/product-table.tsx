import { apiDeleteProduct, apiGetListProduct } from "@/api/endpoints/product";
import { BaseButton } from "@/components/base/button";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import { BaseTooltip } from "@/components/base/tooltip";
import { ProductSheet } from "./product-sheet";
import BaseAlert from "@/components/base/alert";
import type { BaseParam } from "@/types/common";
import { useRole } from "@/hooks/useRole";
import { socket } from "@/socket";

export const TableProduct = () => {
  const { canAccess } = useRole();
  const [lowStockIds, setLowStockIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [params, setParams] = useState<BaseParam<Product>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: null,
  });
  const [totalPage, setTotalPage] = useState(1);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    type: "success" as "success" | "warning" | "error",
    title: "",
    message: "",
    onConfirm: () => {},
    showCancel: false,
    loading: false,
  });

  const onPageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const loadProducts = useCallback(
    async (keyword?: string | null) => {
      const { data, error } = await apiGetListProduct({
        ...params,
        keyword,
      });
      if (!error && data.data) {
        setProducts(data.data);
        if (data.meta) {
          setTotalPage(data.meta.totalPage ?? 1);
        }
      }
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  const deleteProduct = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this product?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteProduct(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Product deleted successfully!"
            : error?.message || "Failed to delete product",
          onConfirm: () => loadProducts(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const productTableSlots = {
    actions: (product: Product) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("product_read") && (
          <ProductSheet
            type="detail"
            productData={product}
            loadData={() => {
              loadProducts("");
            }}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuEye />
                    </BaseButton>
                  }
                >
                  <p>Detail Product</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("product_update") && (
          <ProductSheet
            type="edit"
            productData={product}
            loadData={() => {
              loadProducts("");
            }}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuPencil />
                    </BaseButton>
                  }
                >
                  <p>Edit Product</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("product_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteProduct(product.id)}
              >
                <LuTrash />
              </BaseButton>
            }
          >
            <p>Delete Product</p>
          </BaseTooltip>
        )}
      </div>
    ),
    name: (product: Product) => (
      <>
        {lowStockIds.has(product.id) && (
          <span className="absolute left-2 top-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
        {product.name}
      </>
    ),
  };

  useEffect(() => {
    loadProducts(params.keyword);
  }, [loadProducts]);

  useEffect(() => {
    const handleStockMinimum = (products: Product[]) => {
      const ids = new Set(products.map((p) => p.id));
      setLowStockIds(ids);
    };

    socket.on("stock_minimum", handleStockMinimum);

    return () => {
      socket.off("stock_minimum", handleStockMinimum);
    };
  }, []);

  const handleSearch = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      loadProducts(params.keyword);
      setParams((prev) => ({
        ...prev,
        page: 1,
      }));
    },
    [params.keyword, loadProducts]
  );

  const AlertFooter = () => {
    return (
      <>
        {alertState.showCancel && (
          <BaseButton
            model="outline"
            onClick={() => setAlertState({ ...alertState, isOpen: false })}
          >
            Cancel
          </BaseButton>
        )}
        <BaseButton
          model={alertState.type === "warning" ? "fill" : "outline"}
          className={
            alertState.type === "warning"
              ? "bg-red-500 hover:bg-red-600 border-red-600"
              : ""
          }
          onClick={() => {
            alertState.onConfirm();
            if (alertState.type !== "warning") {
              setAlertState({ ...alertState, isOpen: false });
            }
          }}
        >
          {alertState.type === "warning" ? "Delete" : "OK"}
        </BaseButton>
      </>
    );
  };

  return (
    <>
      <BaseAlert
        open={alertState.isOpen}
        onOpenChange={(open) => setAlertState({ ...alertState, isOpen: open })}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        footerSlot={<AlertFooter />}
        loading={alertState.loading}
      />

      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <form onSubmit={handleSearch}>
            <BaseInput
              className="w-fit min-w-60"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setParams((prev) => ({
                  ...prev,
                  keyword: e.target.value,
                }))
              }
              value={params.keyword || ""}
              placeholder="Search keyword..."
            />
          </form>
          {canAccess("product_create") && (
            <ProductSheet
              type="add"
              loadData={() => {
                loadProducts();
                params.keyword = null;
              }}
              trigger={<BaseButton>Add Product</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Product>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Name", key: "name", type: "slot", className: "relative" },
            { title: "Qty", key: "currentQty" },
            {
              title: "Minimum Stock",
              key: "minimumStock",
            },
            { title: "Brand Name", key: "brandName" },
            { title: "Active", key: "active", type: "boolean" },
            { title: "Category Name", key: "category.name" },
            { title: "Price", key: "price", type: "price" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={products}
          page={params.page || 1}
          slot={productTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
