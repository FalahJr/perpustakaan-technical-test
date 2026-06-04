import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/features/auth/auth-context";
import { useLoginMutation } from "@/features/auth/hooks/useLoginMutation";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/schemas/login-schema";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values: LoginSchema) => {
    const session = await loginMutation.mutateAsync(values);
    login(session);

    const redirectTo =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? "/";

    navigate(redirectTo, { replace: true });
  });

  return (
    <section className="grid w-full gap-0 lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white lg:flex">
        <div>
          <div className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 font-bold text-lg">
            PT
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Perpus Technical Test
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-300">
            Admin Dashboard untuk Manajemen Perpustakaan
          </p>
          <p className="mt-6 text-sm text-slate-400">
            Kelola kategorii buku, penulis, penerbit, peminjaman, dan denda
            dengan mudah.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          © 2026 Perpus Technical Test. All rights reserved.
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden">
            <div className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 font-bold text-white">
              PT
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Perpus Technical Test
            </h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-900"
                htmlFor="username"
              >
                Username
              </label>
              <Controller
                control={control}
                name="username"
                render={({ field }: { field: any }) => (
                  <Input
                    {...field}
                    id="username"
                    autoComplete="username"
                    placeholder="Masukkan username"
                  />
                )}
              />
              {errors.username ? (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-900"
                htmlFor="password"
              >
                Password
              </label>
              <Controller
                control={control}
                name="password"
                render={({ field }: { field: any }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                  />
                )}
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            {loginMutation.isError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Gagal login. Periksa username dan password.
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : null}
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-600">
            Demo: gunakan username dan password dari backend seeder.
          </p>
        </div>
      </div>
    </section>
  );
}
