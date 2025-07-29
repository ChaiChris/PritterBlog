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
import { registerUser } from "@/lib/api";
import { useState } from "react";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
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
        password: data.password,
        username: data.username,
      };

      const doRigister = await registerUser(registerInput);

      console.log("註冊成功", doRigister);
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
