"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type AuthPanelSwitchProps = {
  mode: string;
};

export function AuthPanelSwitch({ mode }: AuthPanelSwitchProps) {
  const router = useRouter();
  return (
    <Button
      className={"cursor-pointer text-zinc-800/50"}
      variant="link"
      onClick={() => {
        mode === "register" ? router.push("/signup") : router.push("/login");
        mode === "register" ? router.push("/signup") : router.push("/login");
      }}
    >
      {mode === "register" ? "前往註冊" : "前往登入"}
    </Button>
  );
}
