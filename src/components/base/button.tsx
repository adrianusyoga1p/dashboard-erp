import { cn } from "@/utils/utils";
import * as React from "react";
import { NavLink } from "react-router-dom";

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  model?: "outline" | "fill";
  link?: boolean;
  href?: string;
  label?: string;
  children?: React.ReactNode;
}

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      className,
      label,
      model = "fill",
      size = "md",
      link = false,
      href,
      type,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClass = cn(
      "cursor-pointer disabled:cursor-default flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40",
      size === "sm" && "text-xs px-3 py-1.5 rounded-sm",
      size === "md" && "px-4 py-2 rounded-lg",
      size === "lg" && "px-6 py-3 rounded-xl",
      model === "fill" && "bg-black text-white border-black hover:bg-black/70",
      model === "outline" &&
        "text-black border-black/40 hover:bg-black/90 hover:text-white hover:border-black/90",
      className
    );
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const mergedRef = (node: HTMLElement | null) => {
      buttonRef.current = node as HTMLButtonElement;
      if (typeof ref === "function") {
        ref(node as HTMLButtonElement);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    };
    if (link) {
      return (
        <NavLink ref={mergedRef} className={buttonClass} to={href as string}>
          {label && <span>{label}</span>}
          {children}
        </NavLink>
      );
    }
    return (
      <button ref={mergedRef} className={buttonClass} type={type} {...props}>
        {label && <span>{label}</span>}
        {children}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";
export { BaseButton };
