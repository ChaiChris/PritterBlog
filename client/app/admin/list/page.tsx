"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePosts } from "@/hooks/use-post";
import {
  ArrowUpDown,
  MoreHorizontal,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnSort,
  createColumnHelper,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostPagination from "@/components/post-pagination/post-pagination";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import DeleteHandler from "./_components/delete-handler/delete-handler";

interface PostListProps {
  id: number;
  title: string;
  coverImagePath: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
    avatarPath?: string;
  };
}

export default function AdminPostList() {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [mounted, setMounted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 確保已掛載
  useEffect(() => {
    setMounted(true);
  }, []);

  // debounce for SSR
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchValue = useDebounce(titleFilter, 300);

  useEffect(() => {
    if (mounted) {
      setDebouncedTitle(debouncedSearchValue);
    }
  }, [debouncedSearchValue, mounted]);

  const postsData = usePosts({
    limit: pageSize,
    title: debouncedTitle,
  });

  const {
    posts,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePostsPageChange,
    refreshPosts,
    pageButtonGenerator,
    canGoPrevious,
    canGoNext,
  } = postsData;

  const columnHelper = createColumnHelper<PostListProps>();

  // 列配置
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 60,
        cell: ({ getValue }) => (
          <div className="font-mono text-sm text-center">{getValue()}</div>
        ),
      }),
      columnHelper.accessor("coverImagePath", {
        header: "封面",
        cell: ({ getValue }) => {
          const url = getValue();
          const relativePath = new URL(url).pathname;
          return (
            <div className="w-16 h-10 overflow-hidden rounded-sm ">
              {url ? (
                <Image
                  src={relativePath}
                  alt={"封面"}
                  width={50}
                  height={50}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 text-center text-xs text-gray-400 flex items-center justify-center">
                  無封面
                </div>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            標題
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="font-medium max-w-[300px] truncate">{getValue()}</div>
        ),
      }),

      columnHelper.accessor((row) => row.user?.username ?? "未知使用者", {
        id: "author",
        cell: (info) => {
          const user = info.row.original.user;
          const avatarUrl = user?.avatarPath
            ? `${user.avatarPath}` // TODO:本地實作
            : undefined;

          return (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={avatarUrl} alt="Avatar" className="" />
                <AvatarFallback>{user?.username?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <span>{info.getValue()}</span>
            </div>
          );
        },
        header: "作者",
      }),
      columnHelper.accessor("updatedAt", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent"
          >
            創建日期
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => {
          const dateValue = getValue();
          try {
            return (
              <div className="text-sm text-muted-foreground">
                {format(new Date(dateValue), "yyyy-MM-dd HH:mm")}
              </div>
            );
          } catch (error) {
            console.log("[ AdminPostList ]: ", error);
            return (
              <div className="text-sm text-muted-foreground">無效日期</div>
            );
          }
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打開選單</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/${row.original.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  編輯
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(row.original.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [columnHelper]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      handlePostsPageChange(1); // 變動時時回到第一頁
    },
    [handlePostsPageChange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setTitleFilter(value);
      handlePostsPageChange(1);
    },
    [handlePostsPageChange]
  );

  function openDeleteDialog(id: number) {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  }

  function handleDeleted() {
    // 刪除完更新列表
    refreshPosts();
  }

  // 分頁
  const table = useReactTable({
    data: posts || [],
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setTitleFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: totalPages || 0,
  });

  if (isLoading || !mounted) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center text-muted-foreground">
        <RefreshCw className="animate-spin mx-auto mb-2" />
        載入中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">載入錯誤</h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || "載入文章時發生錯誤"}
              </div>
              <div className="mt-3">
                <button
                  onClick={refreshPosts}
                  className="bg-red-100 px-3 py-1 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  重試
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="搜尋標題..."
          value={titleFilter}
          onChange={(e) => handleSearchChange(e.target.value)}
          className=""
        />
        <Select
          value={String(pageSize)}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="每頁筆數" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} 筆/頁
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                無資料
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PostPagination
        currentPage={currentPage}
        handlePostsPageChange={handlePostsPageChange}
        pageButtonGenerator={pageButtonGenerator}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
      <DeleteHandler
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        targetId={deleteId}
        onDeleted={() => {
          refreshPosts();
        }}
      />
    </div>
  );
}
