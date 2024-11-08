import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/auth.schema";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ArrowRight, Eye, EyeOff } from "../lib/icons";
import { ApiError } from "../types";
import { apiRoutes } from "../siteConfig";

export const SignUp = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayPassword, setDisplayPassword] = useState<boolean>(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = form.handleSubmit(async (data: any) => {
    setIsLoading(true);

    try {
      await api.post(apiRoutes.signup, {
        email: data.email,
        username: data.username,
        password: data.password,
      });

      navigate("/signin");
    } catch (error: any) {
      if (error?.name === "AxiosError") {
        const apiError: ApiError = error.response?.data;

        if (apiError?.error) {
          setError(apiError.error);
        } else {
          setError("An unexpected error occurred.");
        }
      } else setError("Something went wrongdddd.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-white px-6 py-8 shadow-md dark:bg-secondary">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Let&apos;s get started!
        </h2>

        {error && (
          <div className="my-4 rounded-md border border-red-300 bg-red-100 px-4 py-2 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input
            className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-gray-100 bg-secondary px-4 py-2 text-muted-foreground outline-none focus-within:border-gray-200 focus-within:bg-white hover:border-gray-200 dark:border-secondary dark:bg-background dark:focus-within:bg-secondary"
            type="text"
            title="Email"
            placeholder="Email"
            id="email"
            {...form.register("email")}
          />

          {form.formState.errors["email"] && (
            <div className="mt-1 text-xs text-red-400">
              {form.formState.errors["email"]?.message?.toString()}
            </div>
          )}

          <input
            className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-gray-100 bg-secondary px-4 py-2 text-muted-foreground outline-none focus-within:border-gray-200 focus-within:bg-white hover:border-gray-200 dark:border-secondary dark:bg-background dark:focus-within:bg-secondary"
            type="text"
            title="Username"
            placeholder="Username"
            id="username"
            {...form.register("username")}
          />

          {form.formState.errors["username"] && (
            <div className="mt-1 text-xs text-red-400">
              {form.formState.errors["username"]?.message?.toString()}
            </div>
          )}

          <div className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-gray-100 bg-secondary px-4 py-2 text-muted-foreground outline-none focus-within:border-gray-200 focus-within:bg-white hover:border-gray-200 dark:border-secondary dark:bg-background dark:focus-within:bg-secondary">
            <input
              type={displayPassword ? "text" : "password"}
              spellCheck={false}
              className="w-full border-none bg-transparent outline-none"
              title="Password"
              placeholder="Password"
              id="password"
              {...form.register("password")}
            />
            {displayPassword ? (
              <Eye
                onClick={() => setDisplayPassword(false)}
                className="ml-2 cursor-pointer"
                size={20}
              />
            ) : (
              <EyeOff
                onClick={() => setDisplayPassword(true)}
                className="ml-2 cursor-pointer"
                size={20}
              />
            )}
          </div>

          {form.formState.errors["password"] && (
            <div className="mt-1 text-xs text-red-400">
              {form.formState.errors["password"]?.message?.toString()}
            </div>
          )}

          <div className="mt-2 flex w-full items-center justify-center rounded-xl border-2 border-gray-100 bg-secondary px-4 py-2 text-muted-foreground outline-none focus-within:border-gray-200 focus-within:bg-white hover:border-gray-200 dark:border-secondary dark:bg-background dark:focus-within:bg-secondary">
            <input
              type={displayConfirmPassword ? "text" : "password"}
              spellCheck={false}
              className="w-full border-none bg-transparent outline-none"
              title="Confirm Password"
              placeholder="Confirm password"
              id="confirmPassword"
              {...form.register("confirmPassword")}
            />
            {displayConfirmPassword ? (
              <Eye
                onClick={() => setDisplayConfirmPassword(false)}
                className="ml-2 cursor-pointer"
                size={20}
              />
            ) : (
              <EyeOff
                onClick={() => setDisplayConfirmPassword(true)}
                className="ml-2 cursor-pointer"
                size={20}
              />
            )}
          </div>

          {form.formState.errors["confirmPassword"] && (
            <div className="mt-1 text-xs text-red-400">
              {form.formState.errors["confirmPassword"]?.message?.toString()}
            </div>
          )}

          <button
            type="submit"
            className="bg-sky-400 hover:bg-sky-500 flex w-full items-center justify-center rounded-xl px-4 py-2 font-semibold text-white dark:bg-background dark:text-primary dark:hover:bg-card mt-4"
          >
            <span className="mr-2 text-lg font-semibold">Continue</span>
            {isLoading ? <LoadingSpinner size={3} /> : <ArrowRight size={20} />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already a member?
          <span className="ml-1 text-sky-400 underline">
            <Link to="/signin">Log in</Link>
          </span>
        </p>
      </div>
    </div>
  );
};
