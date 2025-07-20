import { apiAuthLogin } from "@/api/endpoints/auth";
import { useAuthStore } from "@/stores/auth";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setToken, setUser } = useAuthStore();
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
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-8 items-center">
      <div className="col-span-1">
        <div className="max-w-md mx-auto">
          <form onSubmit={submit} className="p-4 space-y-4 w-full">
            <div className="space-y-3">
              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="p-3 w-full border border-black/30 rounded-lg focus:outline-none"
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
              <input
                type="password"
                className="p-3 w-full border border-black/30 rounded-lg focus:outline-none"
                placeholder="Enter password"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                value={form.password}
              />
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
