import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start < maxVisiblePages - 1) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border ${currentPage === 1
                        ? "text-gray-300 border-gray-200 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600 transition"
                    }`}
            >
                <FaChevronLeft size={14} />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md border text-sm font-medium transition ${currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border ${currentPage === totalPages
                        ? "text-gray-300 border-gray-200 cursor-not-allowed"
                        : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-blue-600 transition"
                    }`}
            >
                <FaChevronRight size={14} />
            </button>
        </div>
    );
};

export default Pagination;
