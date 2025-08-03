import BaseCheckbox from "@/components/base/checkbox";
import { BaseInput } from "@/components/base/input";
import { BaseSwitch } from "@/components/base/switch";
import type { Access } from "@/types/access";
import type { DivisionPayload } from "@/types/division";
import { useMemo, type ChangeEvent } from "react";

interface DivisionFormContentProps {
  form: DivisionPayload;
  setForm: React.Dispatch<React.SetStateAction<DivisionPayload>>;
  access: Access[];
  type: "add" | "edit" | "detail";
}

export const DivisionForm = ({
  form,
  setForm,
  access,
  type = "add",
}: DivisionFormContentProps) => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const grouped = useMemo(() => {
    return access.reduce<Record<string, Access[]>>((acc, curr) => {
      if (!acc[curr.resource]) acc[curr.resource] = [];
      acc[curr.resource].push(curr);
      return acc;
    }, {} as Record<string, Access[]>);
  }, [access]);
  return (
    <div className="space-y-6 p-4 relative overflow-y-auto">
      <BaseInput
        type="text"
        placeholder="Input division name"
        label="Division Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input division display name"
        label="Division Display Name"
        onChange={onChange}
        name="displayName"
        value={form.displayName as string}
        disabled={type == "detail"}
      />
      <BaseSwitch
        checked={form.active}
        label="Division Active"
        name="active"
        onCheckedChange={(checked: boolean) =>
          setForm({
            ...form,
            active: checked,
          })
        }
        disabled={type == "detail"}
      />
      <div>
        <label className="font-semibold text-sm block mb-2">Access</label>
        <div className="space-y-4">
          {Object.entries(grouped).map(([resource, accesses]) => {
            const allChecked = accesses.every((access) =>
              form.accesses?.some((a) => a.accessId === access.id)
            );

            return (
              <div key={resource} className="border p-4 rounded-md shadow">
                <div className="flex gap-2 items-center justify-between">
                  <h2 className="text-lg font-bold capitalize mb-2">
                    {resource.replace(/_/g, " ")}
                  </h2>
                  <BaseCheckbox
                    label="Select All"
                    disabled={type == "detail"}
                    checked={allChecked}
                    onCheckedChange={(checked: boolean) => {
                      setForm((prev) => {
                        const currentAccesses = prev.accesses || [];

                        const resourceAccessIds = accesses.map((a) => a.id);

                        let updatedAccesses: { accessId: string }[] = [];

                        if (checked) {
                          const merged = [
                            ...currentAccesses,
                            ...resourceAccessIds
                              .filter(
                                (id) =>
                                  !currentAccesses.some(
                                    (a) => a.accessId === id
                                  )
                              )
                              .map((id) => ({ accessId: id })),
                          ];
                          updatedAccesses = merged;
                        } else {
                          updatedAccesses = currentAccesses.filter(
                            (a) => !resourceAccessIds.includes(a.accessId)
                          );
                        }

                        return {
                          ...prev,
                          accesses:
                            updatedAccesses.length > 0 ? updatedAccesses : null,
                        };
                      });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  {accesses.map((access) => (
                    <BaseCheckbox
                      key={access.id}
                      disabled={type == "detail"}
                      label={access.action}
                      checked={form.accesses?.some(
                        (a) => a.accessId === access.id
                      )}
                      onCheckedChange={(checked: boolean) => {
                        setForm((prev) => {
                          let updatedAccesses: { accessId: string }[] =
                            prev.accesses || [];

                          if (checked) {
                            if (
                              !updatedAccesses.some(
                                (a) => a.accessId === access.id
                              )
                            ) {
                              updatedAccesses = [
                                ...updatedAccesses,
                                { accessId: access.id },
                              ];
                            }
                          } else {
                            // Remove access
                            updatedAccesses = updatedAccesses.filter(
                              (a) => a.accessId !== access.id
                            );
                          }

                          return {
                            ...prev,
                            accesses:
                              updatedAccesses.length > 0
                                ? updatedAccesses
                                : null,
                          };
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
