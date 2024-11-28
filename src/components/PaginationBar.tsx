"use client"
import { useSearchParams } from "next/navigation"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationBarProps {
    currentPage: number,
    totalPages: number
}
export default function PaginationBar({ currentPage, totalPages }: PaginationBarProps) {

    const searchParams = useSearchParams();
    function geLink(page: number) {

        const newSearchParams = new URLSearchParams(searchParams);

        newSearchParams.set("page", page.toString());

        return `?${newSearchParams.toString()}`
    }
    if (totalPages <= 1) {
        return null
    }
    return (
        <Pagination >
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={geLink(currentPage - 1)} className={cn(currentPage === 1 && "text-muted-foreground pointer-events-none")} />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    const isEdgePage = page === 1 || page === totalPages;
                    const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                    if (!isEdgePage && !isNearCurrentPage) {
                        if (i === 1 || i === totalPages - 1) {

                            return <PaginationItem key={page} className="hidden md:block">
                                <PaginationEllipsis className="text-muted-foreground" />
                            </PaginationItem>
                        }
                        return null;
                    }
                    return <PaginationItem key={page}
                        className={cn("hidden md:block", page === currentPage && "block pointer-events-none")}>
                        <PaginationLink
                            href={geLink(page)}

                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                })}
                <PaginationItem>

                    <PaginationNext
                        href={geLink(currentPage + 1)}
                        className={cn(currentPage >= totalPages && "text-muted-foreground pointer-events-none")} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}
