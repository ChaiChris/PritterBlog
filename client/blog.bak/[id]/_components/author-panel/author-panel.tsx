import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { stringToColor } from "@/render/avatar-colour-render";
import { format } from "date-fns";

export default function AuthorPanel({
  user,
  postDate,
}: {
  user?: { id: string; username: string; avatarPath?: string };
  postDate?: string;
}) {
  // console.log("[AuthorPanel] user:", user);
  // console.log("[AuthorPanel] postDate:", postDate);
  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center gap-3 px-4 py-6">
        <div className="flex gap-3 items-center justify-center">
          <Avatar>
            {user?.avatarPath ? (
              <AvatarImage src={user.avatarPath} />
            ) : (
              <AvatarFallback
                style={{
                  backgroundColor: stringToColor(user?.username || ""),
                }}
              >
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-stone-700 font-bold text-lg">
            {user?.username}
          </span>
        </div>

        {postDate && (
          <div className="publish text-sm flex items-center gap-2">
            <div className="publish font-medium text-stone-500">
              {format(postDate, `yyyy MMMM dd`)}
            </div>
            <div className="publish font-medium text-stone-500">發佈</div>
          </div>
        )}
      </div>
    </div>
  );
}
