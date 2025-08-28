import { cn } from "@/utils/utils";
import { useState, type ChangeEvent } from "react";
import type { InputHTMLAttributes } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const BaseInput = ({
  label,
  className,
  children,
  type,
  value,
  id,
  ...props
}: BaseInputProps) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
    props.onChange?.(e);
  };

  return (
    <div>
      {label && (
        <label className="font-semibold text-sm block mb-2">{label}</label>
      )}

      {type === "file" ? (
        <div className="relative flex items-center gap-2">
          <label
            htmlFor={id}
            className="cursor-pointer px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-black/80 transition-colors duration-300"
          >
            Pilih File
          </label>
          <input
            id={id}
            type="file"
            className={cn("hidden", className)}
            onChange={handleFileChange}
            {...props}
          />
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {fileName || "Tidak ada file"}
          </span>
        </div>
      ) : (
        <div className="relative">
          <input
            type={type}
            value={value ?? ""}
            className={cn(
              `px-3 py-2 w-full h-10 border border-black/30 placeholder:text-black/20 placeholder:text-sm rounded-lg focus:outline-black transition-colors duration-300`,
              className
            )}
            {...props}
          />
          {children}
        </div>
      )}
    </div>
  );
};
