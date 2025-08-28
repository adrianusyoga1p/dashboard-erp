import { LoginForm } from "./login-form";

const Login = () => {
  return (
    <div className="w-full h-full grid sm:grid-cols-2 gap-8 items-center">
      <div className="col-span-1">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
      <div className="col-span-1 h-full rounded-xl bg-black max-sm:hidden"></div>
    </div>
  );
};

export default Login;
