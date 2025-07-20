import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center w-screen h-dvh flex-col gap-4">
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <NavLink to={'/'} className="bg-black/90 text-white px-3 text-sm font-medium py-2 rounded-lg">Back to Home</NavLink>
    </div>
  );
};

export default NotFound;
