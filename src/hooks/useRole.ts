import { useAuthStore } from "@/stores/auth";

export const useRole = () => {
  const { accesses, role, division } = useAuthStore();

  const canAccess = (access: string) => {
    if (role == "superadmin" || !division) return true;
    return accesses.includes(access);
  };

  const hasGroup = (group: string) => {
    if (role == "superadmin" || !division) return true;
    return accesses.filter((access) => access.startsWith(group)).length > 0;
  };

  return { canAccess, hasGroup };
};
