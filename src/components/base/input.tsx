import type { InputHTMLAttributes } from "react";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BaseInput = ({ label, ...props }: BaseInputProps) => {
  return (
    <div>
      <label className="font-semibold text-sm block mb-2">{label}</label>
      <input
        className="p-3 w-full border border-black/30 rounded-lg focus:outline-black transition-colors duration-300"
        {...props}
      />
    </div>
  );
};
