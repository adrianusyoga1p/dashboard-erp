import { useState, type ReactNode } from "react";

interface CollapsedHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface BaseCollapsedProps {
  head: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const CollapsedHead = ({ children, ...props }: CollapsedHeadProps) => {
  return (
    <div className="flex items-center justify-between w-full" {...props}>
      {children}
    </div>
  );
};

export const BaseCollapsed = ({
  head,
  children,
  defaultOpen = false,
}: BaseCollapsedProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full">
      <CollapsedHead onClick={toggleCollapse}>{head}</CollapsedHead>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        {isOpen && <div className="py-2">{children}</div>}
      </div>
    </div>
  );
};
