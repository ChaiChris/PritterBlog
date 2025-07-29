import { LoginPanel } from "@/app/login/_components/login-panel";
import styles from "./_styles/login.module.scss";
import { clsx } from "clsx";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default function Login() {
  const cookiestore = cookies();
  const token = cookiestore.get("token")?.value;
  const user = token ? await verifyToken(token) : null;
  if (user) {
    redirect("/home"); // SSR 重導到登入頁
  }
  return (
    <div className={clsx("flex justify-center items-center")}>
      <LoginPanel />
    </div>
  );
}
