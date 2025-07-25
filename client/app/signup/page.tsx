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
import styles from "./_styles/login.module.scss";
import { clsx } from "clsx";
import { SignupPanel } from "@/app/signup/_components/signup-panel";

export default function Login() {
  return (
    <div className={clsx("flex justify-center items-center")}>
      <SignupPanel />
    </div>
  );
}
