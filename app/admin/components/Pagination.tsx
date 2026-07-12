import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate range of items currently shown
  const startItem = totalItems && itemsPerPage ? ((currentPage - 1) * itemsPerPage) + 1 : undefined;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-[#41454d]">
        {totalItems && itemsPerPage ? (
          <span>
            Showing <span className="font-medium text-[#181d26]">{startItem}</span> to <span className="font-medium text-[#181d26]">{endItem}</span> of <span className="font-medium text-[#181d26]">{totalItems}</span> results
          </span>
        ) : (
          <span>
            Page <span className="font-medium text-[#181d26]">{currentPage}</span> of <span className="font-medium text-[#181d26]">{totalPages}</span>
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-[#dddddd] text-[#41454d] hover:bg-[#f5f7f8] hover:text-[#181d26]"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-[#dddddd] text-[#41454d] hover:bg-[#f5f7f8] hover:text-[#181d26]"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Page Numbers */}
        <div className="flex items-center justify-center space-x-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Logic to show 5 pages centered around current page
                let pageNum = currentPage;
                if (totalPages <= 5) {
                    pageNum = i + 1;
                } else if (currentPage <= 3) {
                    pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                } else {
                    pageNum = currentPage - 2 + i;
                }

                return (
                    <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={`h-8 w-8 p-0 ${
                            currentPage === pageNum 
                            ? "bg-[#181d26] text-white hover:bg-[#181d26]/90 border-transparent" 
                            : "border-[#dddddd] text-[#41454d] hover:bg-[#f5f7f8] hover:text-[#181d26]"
                        }`}
                        onClick={() => onPageChange(pageNum)}
                    >
                        {pageNum}
                    </Button>
                )
            })}
        </div>

        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-[#dddddd] text-[#41454d] hover:bg-[#f5f7f8] hover:text-[#181d26]"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 border-[#dddddd] text-[#41454d] hover:bg-[#f5f7f8] hover:text-[#181d26]"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
