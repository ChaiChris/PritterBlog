import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import MagnetLines from "../magnet-lines/magnet-lines";

export default function WelcomeAni() {
  const word = "請從上方選取功能";
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="text-xl font-bold text-center ">
          <TextGenerateEffect words={word} />

          <h1 className="text-4xl pt-3 text-stone-600">歡迎來到管理頁面</h1>
          <MagnetLines />
        </div>
      </div>
    </>
  );
}
