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
import { AuthPanelSwitch } from "@/components/auth/auth-panel-switch/auth-panel-switch";
import { RegisterForm } from "@/app/signup/_components/register-form/register-form";

export function SignupPanel() {
  return (
    <Card className="w-full max-w-sm shadow-2xl bg-zinc-300/90 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className={"text-zinc-700 text-xl"}>Pritter Blog</CardTitle>
        <CardDescription className={"text-zinc-700"}>註冊</CardDescription>
        <CardAction>
          <AuthPanelSwitch mode="login" />
        </CardAction>
      </CardHeader>
      <RegisterForm />
    </Card>
  );
}
