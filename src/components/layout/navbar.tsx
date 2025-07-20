import { useAuthStore } from "@/stores/auth";

export const LayoutNavbar = () => {
  const { user } = useAuthStore();
  return (
    <nav className="fixed top-0 left-0 ml-60 w-[calc(100%_-_15rem)] bg-white z-50 px-6">
      <div className="flex h-16 items-center">
        <div className="flex gap-4 ml-auto items-center">
          <div className="flex gap-2">
            <div>
              <h4 className="font-semibold">{user?.name}</h4>
              {user?.division && <span className="text-xs">{user?.division?.displayName}</span>}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
