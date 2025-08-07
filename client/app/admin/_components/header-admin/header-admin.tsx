"use Client";
import UserPanelAdmin from "./user-panel-admin/user-panel-admin";
// ${isArticle ? "backdrop-blur-lg" : ""}
export default function HeaderAdmin() {
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full flex justify-between items-center h-[80px] px-6`}
    >
      <div className="flex flex-col gap-2">
        {/* {isArticle ? (
          <Button
            asChild
            variant="ghost"
            className="text-zinc-800 px-5 py-3 rounded-xl"
          >
            <Link href="/article" className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              返回文章列表
            </Link>
          </Button>
        ) : ( */}
        <div className="text-lg text-zinc-800 font-semibold">Pritter ADMIN</div>
        {/* )} */}
      </div>

      <div className="flex items-center h-full">
        <UserPanelAdmin />
      </div>
    </header>
  );
}
