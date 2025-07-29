"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoginInput } from "@/types/auth";
import { useState } from "react";
import { loginSchema, loginFormValues } from "@/schemas/loginSchema";
import { loginUser } from "@/lib/auth";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = form;

  const onSubmit = async (data: loginFormValues) => {
    try {
      setIsLoading(true);
      const loginInput: LoginInput = {
        email: data.email,
        password: data.password,
      };

      const doLogin = await loginUser(loginInput);

      console.log("註冊成功", doLogin);
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
              {isLoading ? "登入中..." : "登入"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </CardContent>
  );
}
