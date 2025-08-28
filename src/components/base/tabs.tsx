import { BaseButton } from "../base/button";
import { useLocation } from "react-router-dom";

export const BaseTabs = ({
  tabs,
}: {
  tabs: { label: string; href: string }[];
}) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {tabs.map((tab) => (
        <BaseButton
          key={tab.href}
          model={pathname === tab.href ? "fill" : "transparent"}
          href={tab.href}
          className="max-md:flex-1 text-nowrap"
        >
          {tab.label}
        </BaseButton>
      ))}
    </div>
  );
};
