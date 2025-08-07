import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthPanelSwitch } from "@/components/auth/auth-panel-switch/auth-panel-switch";
import { RegisterForm } from "@/app/signup/_components/register-form/register-form";

export function SignupPanel() {
  return (
    <Card className="w-full max-w-sm shadow-xl backdrop-blur-2xl">
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
