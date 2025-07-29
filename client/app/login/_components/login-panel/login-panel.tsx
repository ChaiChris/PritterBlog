import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthPanelSwitch } from "@/components/auth/auth-panel-switch/auth-panel-switch";

export default function LoginPanel() {
  return (
    <Card className="w-full max-w-sm shadow-2xl bg-zinc-300/90 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className={"text-zinc-700 text-xl"}>Pritter Blog</CardTitle>
        <CardAction>
          <AuthPanelSwitch mode="register" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
