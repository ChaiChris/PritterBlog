import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface postPaginationProps {
  currentPage: number;
  handlePostsPageChange: (page: number) => void;
  pageButtonGenerator: () => (number | string)[];
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function PostPagination({
  currentPage,
  handlePostsPageChange,
  pageButtonGenerator,
  canGoPrevious,
  canGoNext,
}: postPaginationProps) {
  // console.log("[PostPagination] currentPage:", currentPage);
  // console.log("[PostPagination] canGoPrevious:", canGoPrevious);
  // console.log("[PostPagination] canGoNext:", canGoNext);
  const pages = pageButtonGenerator();
  // console.log("[PostPagination] Generated pages:", pages);

  return (
    <div className="flex justify-center items-center mt-6">
      <Pagination className="flex items-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canGoPrevious) {
                  handlePostsPageChange(currentPage - 1);
                }
              }}
              className={!canGoPrevious ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {pageButtonGenerator().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePostsPageChange(Number(page));
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canGoNext) {
                  handlePostsPageChange(currentPage + 1);
                }
              }}
              className={!canGoNext ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
