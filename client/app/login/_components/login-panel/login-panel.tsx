import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthPanelSwitch } from "@/components/auth/auth-panel-switch/auth-panel-switch";
import LoginForm from "@/app/login/_components/login-form/login-form";

export default function LoginPanel() {
  return (
    <Card className="w-full max-w-sm shadow-2xl bg-zinc-300/90 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className={"text-zinc-700 text-xl"}>Pritter Blog</CardTitle>
        <CardAction>
          <AuthPanelSwitch mode="register" />
        </CardAction>
      </CardHeader>
      <LoginForm />
    </Card>
  );
}
