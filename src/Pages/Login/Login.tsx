import { useForm } from "react-hook-form";
import { LoginSchema, type LoginSchemaType } from "../Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../Components/Context/AuthContext";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100";

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setuserLogin } = useContext(AuthContext);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });
  const { register, handleSubmit, formState } = form;

  function handleLogin(values: LoginSchemaType) {
    setisLoading(true);
    setapiError(null);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("userToken", res.data.data.token);
          setuserLogin(res.data.data.token);
          navigate("/");
        }
      })
      .catch((err) => {
        setapiError(err?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        setisLoading(false);
      });
  }

  return (
    <div className="relative overflow-hidden -mx-3 sm:-mx-4 -mb-10 min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md bg-white border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Login to continue to your account
          </p>
        </div>

        {apiError && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold p-3 rounded-lg mb-4 text-center">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="you@example.com"
              className={inputClass}
            />
            {formState.errors.email?.message && formState.touchedFields.email && (
              <p className="text-sm text-red-600 mt-1">{formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className={`${inputClass} pe-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 end-0 px-3 text-slate-400 hover:text-indigo-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formState.errors.password?.message && formState.touchedFields.password && (
              <p className="text-sm text-red-600 mt-1">{formState.errors.password.message}</p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link to="/Register" className="font-bold text-indigo-600 hover:text-indigo-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}