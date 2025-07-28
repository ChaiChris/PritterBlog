"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./_styles/login-panel.module.scss";
import { useRouter } from "next/navigation";

export function SignupPanel() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm shadow-2xl bg-zinc-200/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className={"text-zinc-700 text-xl"}>Pritter Blog</CardTitle>
        <CardDescription className={"text-zinc-700"}>
          歡迎加入 Pritter!
        </CardDescription>
        <CardAction>
          <Button
            className={"cursor-pointer text-zinc-800 font-bold"}
            variant="link"
            onClick={() => router.push("/login")}
          >
            登入
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="flex items-center text-zinc-800">
                <Label htmlFor="name">名稱</Label>
              </div>
              <Input
                className="bg-zinc-100/30 focus:bg-zinc-100/80"
                id="name"
                type="text"
                required
              />
            </div>
            <div className="grid gap-2 text-zinc-800">
              <Label htmlFor="email">Email</Label>
              <Input
                className="bg-zinc-100/30 focus:bg-zinc-100/80"
                id="email"
                type="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center text-zinc-800">
                <Label htmlFor="password">密碼</Label>
              </div>
              <Input
                className="bg-zinc-100/30 focus:bg-zinc-100/80"
                id="password"
                type="password"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center text-zinc-800">
                <Label htmlFor="comfirm_password">確認密碼</Label>
              </div>
              <Input
                className="bg-zinc-100/30 focus:bg-zinc-100/80"
                id="comfirm_password"
                type="password"
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="cursor-pointer w-full bg-zinc-800/60 shadow-lg"
        >
          註冊
        </Button>
      </CardFooter>
    </Card>
  );
}
