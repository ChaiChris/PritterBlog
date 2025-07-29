import { LoginPanel } from "@/app/login/_components/login-panel";
import styles from "./_styles/login.module.scss";
import { clsx } from "clsx";

export default function Login() {
  return (
    <div className={clsx("flex justify-center items-center")}>
      <LoginPanel />
    </div>
  );
}
