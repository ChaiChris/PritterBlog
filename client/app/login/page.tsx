import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
