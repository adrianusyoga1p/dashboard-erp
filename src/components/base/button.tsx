import { cn } from "@/utils/utils";
import * as React from "react";
import { NavLink } from "react-router-dom";

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  model?: "outline" | "fill" | "transparent";
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
      href,
      type,
      children,
      ...props
    },
    ref
  ) => {
    const modelClasses = {
      fill: "bg-black text-white border-black hover:bg-black/70 hover:border-black/0",
      outline:
        "text-black border-black/40 hover:bg-black/90 hover:text-white hover:border-black/0 bg-transparent",
      transparent: "text-black bg-transparent border-transparent",
    };

    const sizeClasses = {
      sm: "text-sm px-3 py-1.5 rounded-sm text-sm",
      md: "px-4 py-2 rounded-lg",
      lg: "px-6 py-3 rounded-xl text-xl",
    };
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const mergedRef = (node: HTMLElement | null) => {
      buttonRef.current = node as HTMLButtonElement;
      if (typeof ref === "function") {
        ref(node as HTMLButtonElement);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    };
    if (href) {
      return (
        <NavLink
          ref={mergedRef}
          className={cn(
            "flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40",
            modelClasses[model],
            sizeClasses[size],
            className
          )}
          to={href as string}
        >
          {label && <span>{label}</span>}
          {children}
        </NavLink>
      );
    }
    return (
      <button
        ref={mergedRef}
        className={cn(
          "cursor-pointer disabled:cursor-default flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40 disabled:border-black/0",
          modelClasses[model],
          sizeClasses[size],
          className
        )}
        type={type}
        {...props}
      >
        {label && <span>{label}</span>}
        {children}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";
export { BaseButton };
