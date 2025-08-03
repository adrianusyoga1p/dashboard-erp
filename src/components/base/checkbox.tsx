import { Checkbox } from "../ui/checkbox";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

interface BaseCheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label: string;
}

const BaseCheckbox = ({ label, ...props }: BaseCheckboxProps) => {
  return (
    <label className="flex gap-2 items-center">
      <Checkbox {...props} />
      <p className="font-semibold text-sm block capitalize">{label}</p>
    </label>
  );
};

export default BaseCheckbox;
