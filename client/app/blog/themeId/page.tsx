import { getCategoriesList } from "@/lib/category";

type Theme = {
  id: number | string;
  name: string;
};

type Params = {
  params: {
    themeId: string;
  };
};

// 靜態參數生成
export async function generateStaticParams() {
  try {
    const themes: Theme[] = (await getCategoriesList()) || [];

    return themes.map((theme: Theme) => ({
      themeId: theme.id.toString(), // 使用 themeId
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// 頁面元件
export default async function ThemePage({ params }: Params) {
  const categories = (await getCategoriesList()) || [];
  const current = categories.find(
    (cat: Theme) => cat.id.toString() === params.themeId
  );

  if (!current) {
    return <div>找不到此主題</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">主題：{current.name}</h1>
      {/* 顯示這個主題的內容，例如產品列表 */}
    </div>
  );
}
