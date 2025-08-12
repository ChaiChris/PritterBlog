import UserPanelAdmin from "./user-panel-admin/user-panel-admin";
// ${isArticle ? "backdrop-blur-lg" : ""}
export default function HeaderAdmin() {
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full flex justify-between items-center h-[80px] px-6`}
    >
      <div className="flex flex-col gap-2">
        <div className="text-lg text-zinc-800 font-semibold">Pritter ADMIN</div>
      </div>

      <div className="flex items-center h-full">
        <UserPanelAdmin />
      </div>
    </header>
  );
}
