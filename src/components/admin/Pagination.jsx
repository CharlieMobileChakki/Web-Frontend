import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onPageChange,
}) => {
    if (totalItems <= itemsPerPage) return null;

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            {/* Left: Showing text */}
            <p className="text-sm text-gray-600">
                Showing <b>{startIndex + 1}</b> to{" "}
                <b>{Math.min(startIndex + itemsPerPage, totalItems)}</b> of{" "}
                <b>{totalItems}</b> results
            </p>

            {/* Right: Pagination */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={18} />
                </button>

                <span className="text-sm font-semibold text-gray-700">
                    Page {currentPage} / {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
