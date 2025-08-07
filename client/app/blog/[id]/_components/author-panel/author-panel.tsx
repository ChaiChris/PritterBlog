import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export default function AuthorPanel() {
  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center gap-3 px-4 py-6">
        <div className="flex gap-3 items-center justify-center">
          <Avatar>
            <AvatarImage src="https://github.com/leerob.png" />
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <span className="text-zinc-800 font-bold text-lg ">Chris Wood</span>
        </div>

        <div className="publish text-sm flex items-center">
          <div className="publish">發佈於：</div>
          <div className="publish">2023年10月1日</div>
        </div>
      </div>
    </div>
  );
}
