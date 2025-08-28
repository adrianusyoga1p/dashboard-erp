import { cn } from "@/utils/utils";
import * as React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

type BaseButtonCommon = {
  size?: "sm" | "md" | "lg";
  model?: "outline" | "fill" | "transparent";
  label?: string;
  children?: React.ReactNode;
  href?: NavLinkProps["to"];
  className?: string;
  type?: "button" | "submit" | "reset";
};

type BaseButtonAsButton = BaseButtonCommon & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type BaseButtonAsLink = BaseButtonCommon & {
  href: string;
} & Omit<NavLinkProps, "to" | "type">;

type BaseButtonProps = BaseButtonAsButton | BaseButtonAsLink;

const BaseButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  BaseButtonProps
>(
  (
    {
      className,
      label,
      model = "fill",
      size = "md",
      href,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const modelClasses = {
      fill: "bg-black text-white border-black hover:bg-black/70 hover:border-black/0",
      outline:
        "text-black border-black/40 hover:bg-black/20 hover:text-black/70 hover:border-transparent bg-transparent",
      transparent:
        "text-black bg-transparent border-transparent hover:bg-gray-500/5",
    };

    const sizeClasses = {
      sm: "text-sm px-3 py-1.5 rounded-sm text-sm",
      md: "px-4 py-2 rounded-lg",
      lg: "px-6 py-3 rounded-xl text-xl",
    };

    if (href) {
      return (
        <NavLink
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={href}
          className={cn(
            "flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40",
            modelClasses[model],
            sizeClasses[size],
            className
          )}
          {...(props as Omit<NavLinkProps, "to">)}
        >
          {label && <span>{label}</span>}
          {children}
        </NavLink>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          "cursor-pointer disabled:cursor-default flex gap-2 border transition-colors duration-200 justify-center items-center disabled:bg-black/40 disabled:border-black/0",
          modelClasses[model],
          sizeClasses[size],
          className
        )}
        type={type}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label && <span>{label}</span>}
        {children}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";
export { BaseButton };
