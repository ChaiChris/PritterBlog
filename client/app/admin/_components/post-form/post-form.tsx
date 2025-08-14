"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JSONContent } from "@tiptap/core";

const schema = z.object({
  title: z.string().min(1, "標題為必填"),
  body: z.string().min(1, "內容為必填"),
  bodyJson: z.custom<JSONContent>(),
  categoryId: z
    .number()
    .min(1, "請選擇分類")
    .refine((val) => val > 0, "請選擇有效分類"),
});
type FormValues = z.infer<typeof schema>;

type PostFormProps = {
  mode?: "create" | "edit";
  initialData?: Partial<{
    id: number;
    title: string;
    content: {
      body: string;
      bodyJson: JSONContent;
    };
    categoryId: number;
    coverImagePath: string | null;
  }>;
  onSubmit?: (payload: {
    title: string;
    body: string;
    bodyJson: JSONContent;
    categoryId: number;
    coverImagePath: string | null;
    id?: number;
  }) => Promise<void>;
  onUploadCover?: (file: File) => Promise<string>;
  categories?: { id: number; name: string }[];
};

export default function PostForm({
  mode = "create",
  initialData,
  onSubmit,
  onUploadCover,
  categories,
}: PostFormProps) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_LOCAL_SERVER_URL || "http://localhost:8081";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? "",
      body: initialData?.content?.body ?? "",
      bodyJson: initialData?.content?.bodyJson ?? { type: "doc", content: [] }, // TipTap content 不可為 undefined
      categoryId: initialData?.categoryId ?? 0,
    },
  });

  const [coverUrl, setCoverUrl] = useState<string | null>(
    initialData?.coverImagePath ?? null
  );
  const [coverLoading, setCoverLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title ?? "",
        body: initialData?.content?.body ?? "",
        bodyJson: initialData?.content?.bodyJson ?? {
          type: "doc",
          content: [],
        },
        categoryId: initialData.categoryId ?? 0,
      });
      setCoverUrl(initialData.coverImagePath ?? null);
    }
  }, [initialData, form]);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 上傳圖片
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverLoading(true);

    try {
      let url: string;
      if (onUploadCover) {
        url = await onUploadCover(file);
      } else {
        const fd = new FormData();
        fd.append("cover", file);
        const res = await axios.post(
          `${SERVER_URL}/api/blog/uploads/post/cover`,
          fd,
          { withCredentials: true }
        );
        const returned = res.data?.data?.url;
        //
        url = returned?.startsWith("http")
          ? returned
          : `${SERVER_URL}${returned}`;
      }
      setCoverUrl(url);
      toast.success("封面上傳完成");
    } catch (err) {
      console.error("封面上傳失敗", err);
      toast.error("封面上傳失敗");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("Submit form values:", values);
    const payload = {
      ...values,
      coverImagePath: coverUrl,
      id: initialData?.id,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
        return;
      }

      if (mode === "create") {
        await axios.post(`${SERVER_URL}/api/blog/post`, payload, {
          withCredentials: true,
        });
      } else {
        const id = initialData?.id;
        if (!id) throw new Error("缺少文章 id");
        await axios.put(`${SERVER_URL}/api/blog/post/${id}`, payload, {
          withCredentials: true,
        });
      }
      toast.success(mode === "create" ? "貼文已發佈！" : "貼文已更新！");

      if (mode === "create") {
        form.reset();
        setCoverUrl(null);
      }
    } catch (err) {
      console.error("送出失敗", err);
      toast.error("送出失敗");
    }
  };

  return (
    <div className="flex flex-col min-h-full py-10 w-full max-w-[1200px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 封面圖片 */}
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="coverPicture">封面圖片</Label>
            <Input
              id="coverPicture"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={coverLoading}
            />
            {coverLoading && <p className="text-sm text-gray-500">上傳中...</p>}
            {coverUrl && (
              <div className="relative w-full">
                <div className="flex flex-col justify-start h-[320px]">
                  <Image
                    src={coverUrl}
                    alt="封面預覽"
                    fill
                    className="mt-2 rounded-sm object-cover"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="z-50 w-9 rounded-lg bg-red-600/50 backdrop-blur-lg text-white shadow-xl hover:bg-red-600/70 hover:text-white"
                    onClick={() => setCoverUrl(null)}
                  >
                    Ｘ
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 分類 */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>選擇主題分類</FormLabel>
                <Select
                  value={field.value > 0 ? field.value.toString() : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                  disabled={!categories || categories.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 標題 */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <Input {...field} placeholder="輸入標題" />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* tiptap */}
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => {
              // console.log("SimpleEditor htmlValue:", field.value);
              // console.log(
              //   "SimpleEditor jsonValue:",
              //   form.getValues("bodyJson")
              // );
              return (
                <FormItem>
                  <SimpleEditor
                    htmlValue={field.value}
                    jsonValue={form.getValues("bodyJson") as JSONContent} // TipTap JSON 型別定義
                    onChange={(d) => {
                      form.setValue("body", d.html || "");
                      form.setValue(
                        "bodyJson",
                        d.json && Object.keys(d.json).length > 0
                          ? d.json
                          : { type: "doc", content: [] } // 防止 undefined 導致 TipTap crash
                      );
                    }}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? mode === "create"
                ? "發佈中..."
                : "儲存中..."
              : mode === "create"
                ? "發佈"
                : "儲存變更"}
            <SendHorizontal className="ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
