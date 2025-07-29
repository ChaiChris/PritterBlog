import LoginPanel from "@/app/login/_components/login-panel/login-panel";
import { clsx } from "clsx";

export default async function Login() {
  return (
    <div className={clsx("flex justify-center items-center")}>
      <LoginPanel />
    </div>
  );
}
