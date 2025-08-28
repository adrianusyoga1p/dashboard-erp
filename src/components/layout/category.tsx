import { BaseTabs } from "@/components/base/tabs";
import type { ReactNode } from "react";

type LayoutCategoryProps = {
  children: ReactNode;
};

export const LayoutCategory = ({ children }: LayoutCategoryProps) => {
  return (
    <div className="space-y-6">
      <h1 className="font-semibold text-lg">Category Management</h1>
      <BaseTabs
        tabs={[
          { label: "Product", href: "/product-category" },
          { label: "Unit", href: "/unit-category" },
        ]}
      />
      {children}
    </div>
  );
};
