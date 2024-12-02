import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import React from "react";

const Pager = ({page, pageSize, rows, total, onPageChange}) => {
    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page)
        }
    }

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = [];

        // Add first page
        if (page > 3) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={page === 1}
                        className='cursor-pointer'
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Add '...' after the first page if needed
            if (page > 4) {
                items.push(
                    <PaginationItem>
                        <PaginationEllipsis/>
                    </PaginationItem>
                )
            }
        }

        // Add pages around the current page
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={page === i}
                        className='cursor-pointer'
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Add '...' before the last page if needed
        if (page < totalPages - 3) {
            items.push(
                <PaginationItem key={'...'}>
                    <PaginationEllipsis/>
                </PaginationItem>
            )
        }

        // Add last page
        if (page < totalPages - 2) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        isActive={page === totalPages}
                        className='cursor-pointer'
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className='flex justify-between w-full'>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => handlePageChange(page - 1)} className='cursor-pointer'/>
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                        <PaginationNext onClick={() => handlePageChange(page + 1)} className='cursor-pointer'/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="text-xs text-muted-foreground w-64">
                显示 <strong>第{page}页</strong> - <strong>{rows}条记录</strong> - <strong>总数：{total}</strong>
            </div>

        </div>
    )
}

export default Pager