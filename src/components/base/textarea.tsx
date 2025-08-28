import type { TextareaHTMLAttributes } from "react";

interface BaseTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const BaseTextarea = ({ label, value, ...props }: BaseTextareaProps) => {
  return (
    <div>
      <label className="font-semibold text-sm block mb-2">{label}</label>
      <textarea
        value={value ?? ""}
        className="p-3 w-full border resize-none min-h-28 border-black/30 rounded-lg focus:outline-black transition-colors duration-300"
        {...props}
      />
    </div>
  );
};
