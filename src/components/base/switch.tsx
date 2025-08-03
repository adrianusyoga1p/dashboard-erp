import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Switch } from "../ui/switch";

interface BaseSwitchI
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label?: string;
}

function BaseSwitch({ className, label, ...props }: BaseSwitchI) {
  return (
    <div className="flex gap-3 items-center">
      <Switch className={className} {...props} />
      {label && <label className="font-semibold text-sm block">{label}</label>}
    </div>
  );
}

export { BaseSwitch };
