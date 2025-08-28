import { apiAuthLogin } from "@/api/endpoints/auth";
import { BaseInput } from "@/components/base/input";
import { useAuthStore } from "@/stores/auth";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { setToken, setUser, setBusiness } = useAuthStore();
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
      if (response.data.user.business) {
        setBusiness(response.data.user.business);
      }
      setToken(response.data.accessToken.token);
      navigate("/");
    }
    setLoading(false);
  };

  const handleShowingPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <form onSubmit={submit} className="p-4 space-y-4 w-full">
      <div className="space-y-3">
        <label className="block font-medium">Email</label>
        <BaseInput
          type="email"
          placeholder="Enter email"
          onChange={onChange}
          value={form.email}
          name="email"
        />
      </div>
      <div className="space-y-3">
        <label className="block font-medium">Password</label>
        <BaseInput
          type={!showPassword ? "password" : "text"}
          placeholder="Enter password"
          onChange={onChange}
          name="password"
          value={form.password}
        >
          <button
            type="button"
            onClick={handleShowingPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50"
          >
            {!showPassword ? <LuEye /> : <LuEyeOff />}
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
  );
};
