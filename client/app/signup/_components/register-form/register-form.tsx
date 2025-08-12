"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/schemas/registerSchema";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RegisterInput } from "@/types/auth";
import { useState, useEffect } from "react";
import { registerUser } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const {
    user,
    isLoading: userLoading,
    isError: userError,
    refresh: refreshUser,
  } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      const registerInput: RegisterInput = {
        email: data.email,
        username: data.username,
        password: data.password,
      };

      const doRigister = await registerUser(registerInput);
      if (doRigister) {
        console.log("註冊成功");
        await refreshUser();
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "註冊失敗",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">使用者名稱</FormLabel>
                  <FormControl>
                    <Input id="username" type="text" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">密碼</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800">確認密碼</FormLabel>
                  <FormControl>
                    <Input id="confirm_password" type="password" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-800" />
                </FormItem>
              )}
            />
          </div>

          {errors.root?.message && (
            <p className="text-red-800 pt-2">{errors.root.message}</p>
          )}

          <div className="submit-btn pt-8">
            <Button
              type="submit"
              className="cursor-pointer w-full bg-zinc-800/80"
              disabled={isLoading}
            >
              {isLoading ? "註冊中..." : "註冊"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CardContent>
  );
}
