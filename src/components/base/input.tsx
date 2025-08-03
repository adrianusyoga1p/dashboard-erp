import { cn } from "@/utils/utils";
import type { InputHTMLAttributes } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const BaseInput = ({
  label,
  className,
  children,
  value,
  ...props
}: BaseInputProps) => {
  return (
    <div>
      {label && (
        <label className="font-semibold text-sm block mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          className={cn(
            `px-3 py-2 w-full h-10 border border-black/30 placeholder:text-black/20 placeholder:text-sm rounded-lg focus:outline-black transition-colors duration-300`,
            className
          )}
          value={value ?? ""}
          {...props}
        />
        {children}
      </div>
    </div>
  );
};
