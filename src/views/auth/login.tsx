import { apiAuthLogin } from "@/api/endpoints/auth";
import { BaseInput } from "@/components/base/input";
import { useAuthStore } from "@/stores/auth";
import { useState, type FormEvent } from "react";
import { LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setToken, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await apiAuthLogin(form);
    if (!response.error) {
      setUser(response.data.user);
      setToken(response.data.accessToken.token);
      navigate("/");
    }
    setLoading(false);
  };

  const handleShowingPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-8 items-center">
      <div className="col-span-1">
        <div className="max-w-md mx-auto">
          <form onSubmit={submit} className="p-4 space-y-4 w-full">
            <div className="space-y-3">
              <label className="block font-medium">Email</label>
              <BaseInput
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                value={form.email}
              />
            </div>
            <div className="space-y-3">
              <label className="block font-medium">Password</label>
              <BaseInput
                type={!showPassword ? 'password' : 'text'}
                placeholder="Enter password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                value={form.password}
              >
                <button
                  type="button"
                  onClick={handleShowingPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50"
                >
                  <LuEye />
                </button>
              </BaseInput>
            </div>
            <button
              disabled={loading}
              className="bg-black p-3 rounded-lg text-white w-full disabled:bg-black/40"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="col-span-1 h-full rounded-xl bg-black"></div>
    </div>
  );
};

export default Login;
