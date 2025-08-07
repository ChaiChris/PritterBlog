"use client";
import { useForm as useReactHookForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SendHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useCategories from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(1, "標題為必填"),
  content: z.string().min(1, "內容為必填"),
  categoryId: z.number().min(1, "請選擇分類"),
});

type FormValues = z.infer<typeof schema>;

export default function NewPost() {
  const { categories, isLoading } = useCategories();
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(false);

  const form = useReactHookForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: undefined,
    },
  });
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverLoading(true);

    try {
      const formData = new FormData();
      formData.append("cover", file);
      const res = await axios.post(
        `${SERVER_URL}/api/blog/uploads/post/cover`,
        formData,
        {
          withCredentials: true, // 帶上 cookie
        }
      );
      const url = res.data.data.url.startsWith("http")
        ? res.data.data.url
        : `${SERVER_URL}${res.data.data.url}`;
      console.log(url);
      setCoverUrl(url);
      setPreviewUrl(url);
    } catch (err) {
      console.error("封面圖片上傳失敗", err);
      toast("封面圖片上傳失敗");
    } finally {
      setCoverLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const postAddUrl = SERVER_URL + "/api/blog/uploads/post";
      await axios.post(
        postAddUrl,
        {
          title: data.title,
          body: data.content,
          categoryId: data.categoryId,
          coverImagePath: coverUrl,
        },
        {
          withCredentials: true, // 帶上 cookie
        }
      );
      toast.success("貼文已發佈！");
      form.reset(); // debugging
      setCoverUrl("");
      setPreviewUrl(null);
    } catch (err) {
      console.error("貼文建立失敗", err);
      toast.error("貼文建立失敗");
    }
  };

  return (
    <div className="flex flex-col min-h-full py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="coverPicture">封面圖片</Label>
            <Input id="coverPicture" type="file" onChange={handleCoverChange} />
            {coverLoading && <p className="text-sm text-gray-500">上傳中...</p>}
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="封面預覽"
                width={256}
                height={160}
                className="mt-2 rounded object-cover border"
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>選擇主題分類</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <Input
                  {...field}
                  className="w-full outline-none shadow-none border-none focus:outline-none focus:shadow-none focus:border-none active:outline-none active:shadow-none active:border-none"
                  placeholder="輸入標題"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>內容</FormLabel>
                <SimpleEditor
                  htmlValue={field.value}
                  onChange={(html) => field.onChange(html)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"ghost"}
            className="cursor-pointer text-zinc-700 hover:text-zinc-800 bg-zinc-200 hover:bg-zinc-600 hover:shadow-md hover:text-zinc-50 rounded-xl"
          >
            發佈
            <SendHorizontal />
          </Button>
        </form>
      </Form>
    </div>
  );
}
