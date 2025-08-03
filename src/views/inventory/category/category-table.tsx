import {
  apiDeleteCategory,
  apiGetListCategory,
} from "@/api/endpoints/category";
import { BaseInput } from "@/components/base/input";
import BaseTable from "@/components/base/table";
import { BaseTooltip } from "@/components/base/tooltip";
import type { Category } from "@/types/category";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CategorySheet } from "./category-sheet";
import { BaseButton } from "@/components/base/button";
import { LuEye, LuPencil, LuTrash } from "react-icons/lu";
import BaseAlert from "@/components/base/alert";
import type { BaseParam } from "@/types/common";
import { useRole } from "@/hooks/useRole";

export const CategoryTable = () => {
  const { canAccess } = useRole();
  const [categories, setCategories] = useState<Category[]>([]);
  const [params, setParams] = useState<BaseParam<Category>>({
    page: 1,
    limit: 10,
    order: "desc",
    orderBy: "createdAt",
    keyword: "",
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

  const loadCategories = useCallback(
    async (keyword?: string) => {
      const { data, error } = await apiGetListCategory({
        ...params,
        keyword,
      });

      if (!error && data.data) {
        setCategories(data.data);
        setTotalPage(data.meta?.totalPage ?? 1);
      }
    },
    [params.page, params.limit, params.order, params.orderBy]
  );

  const deleteCategory = async (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this category?",
      onConfirm: async () => {
        const { data, error } = await apiDeleteCategory(id);
        setAlertState({
          isOpen: true,
          type: data ? "success" : "error",
          title: data ? "Success" : "Error",
          message: data
            ? "Category deleted successfully!"
            : error?.message || "Failed to delete category",
          onConfirm: () => loadCategories(),
          showCancel: false,
          loading: data || error ? false : true,
        });
      },
      showCancel: true,
      loading: false,
    });
  };

  const categoriesTableSlots = {
    actions: (category: Category) => (
      <div className="flex items-center justify-center gap-2">
        {canAccess("category_read") && (
          <CategorySheet
            type="detail"
            categoryData={category}
            loadData={() => loadCategories("")}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuEye />
                    </BaseButton>
                  }
                >
                  <p>Detail Category</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("category_update") && (
          <CategorySheet
            type="edit"
            categoryData={category}
            loadData={() => loadCategories("")}
            trigger={
              <div>
                <BaseTooltip
                  trigger={
                    <BaseButton model="outline" size="sm">
                      <LuPencil />
                    </BaseButton>
                  }
                >
                  <p>Edit Category</p>
                </BaseTooltip>
              </div>
            }
          />
        )}

        {canAccess("category_delete") && (
          <BaseTooltip
            trigger={
              <BaseButton
                model="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => deleteCategory(category.id)}
              >
                <LuTrash />
              </BaseButton>
            }
          >
            <p>Delete Category</p>
          </BaseTooltip>
        )}
      </div>
    ),
  };

  useEffect(() => {
    loadCategories(params.keyword || "");
  }, [loadCategories]);

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e?.preventDefault();
      loadCategories(params.keyword || "");
      setParams((prev) => ({ ...prev, page: 1 }));
    },
    [params.keyword, loadCategories]
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
              onChange={(e) =>
                setParams({ ...params, keyword: e.target.value })
              }
              value={params.keyword || ""}
              placeholder="Search keyword..."
            />
          </form>
          {canAccess("product_create") && (
            <CategorySheet
              type="add"
              loadData={() => loadCategories("")}
              trigger={<BaseButton>Add Category</BaseButton>}
            />
          )}
        </div>
        <BaseTable<Category>
          columns={[
            { title: "#", key: "id", type: "increment" },
            { title: "Actions", key: "actions", type: "slot" },
            { title: "Name", key: "name" },
            { title: "Code", key: "code" },
            { title: "Active", key: "active", type: "boolean" },
            { title: "Created At", key: "createdAt", type: "datetime" },
          ]}
          source={categories}
          page={params.page || 1}
          slot={categoriesTableSlots}
          total={totalPage}
          limit={params.limit || 10}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};
