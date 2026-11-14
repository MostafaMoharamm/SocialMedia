import { useForm } from "react-hook-form";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../Schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

const errorClass = "text-sm text-red-600 mt-1";

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
  });
  const { register, handleSubmit, formState, watch } = form;
  const gender = watch("gender");

  function handleRegister(values: RegisterSchemaType) {
    setisLoading(true);
    setapiError(null);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          navigate("/Login");
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

      <div className="relative w-full max-w-lg bg-white border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Create your account
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Join us and start sharing your posts
          </p>
        </div>

        {apiError && (
          <p className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold p-3 rounded-lg mb-4 text-center">
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Your full name"
              className={inputClass}
            />
            {formState.errors.name?.message && formState.touchedFields.name && (
              <p className={errorClass}>{formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
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
              <p className={errorClass}>{formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className={labelClass}>
                Birthday
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                id="date"
                className={inputClass}
              />
              {formState.errors.dateOfBirth?.message && formState.touchedFields.dateOfBirth && (
                <p className={errorClass}>{formState.errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <span className={labelClass}>Gender</span>
              <div className="grid grid-cols-2 gap-2">
                <label
                  htmlFor="gender-male"
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer select-none transition text-sm font-semibold ${
                    gender === "male"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <input
                    {...register("gender")}
                    id="gender-male"
                    type="radio"
                    value="male"
                    className="accent-indigo-600"
                  />
                  Male
                </label>
                <label
                  htmlFor="gender-female"
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer select-none transition text-sm font-semibold ${
                    gender === "female"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <input
                    {...register("gender")}
                    id="gender-female"
                    type="radio"
                    value="female"
                    className="accent-indigo-600"
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
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
                <p className={errorClass}>{formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rePassword" className={labelClass}>
                Confirm password
              </label>
              <div className="relative">
                <input
                  {...register("rePassword")}
                  type={showRePassword ? "text" : "password"}
                  id="rePassword"
                  placeholder="Confirm password"
                  className={`${inputClass} pe-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowRePassword((prev) => !prev)}
                  aria-label="Toggle confirm password visibility"
                  className="absolute inset-y-0 end-0 px-3 text-slate-400 hover:text-indigo-600 transition"
                >
                  {showRePassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formState.errors.rePassword?.message && formState.touchedFields.rePassword && (
                <p className={errorClass}>{formState.errors.rePassword.message}</p>
              )}
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/Login" className="font-bold text-indigo-600 hover:text-indigo-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}