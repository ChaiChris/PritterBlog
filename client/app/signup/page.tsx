import { clsx } from "clsx";
import { SignupPanel } from "@/app/signup/_components/signup-panel/signup-panel";

export default function Signup() {
  return (
    <div className={clsx("flex justify-center items-center")}>
      <SignupPanel />
    </div>
  );
}
