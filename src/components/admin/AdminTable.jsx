import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "./Pagination";

const AdminTable = ({
    columns,
    data = [],
    loading,
    onEdit,
    onDelete,
    onView,
    currentPage, // ✅ Control from URL
    onPageChange, // ✅ URL updater
}) => {
    const itemsPerPage = 6;
    const [internalPage, setInternalPage] = useState(1);

    // Derived active page: controlled prop OR internal fallback
    const activePage = currentPage !== undefined ? currentPage : internalPage;

    // Reset internal page if data length changes (only if uncontrolled)
    React.useEffect(() => {
        if (currentPage === undefined) {
            setInternalPage(1);
        }
    }, [data.length, currentPage]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (activePage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        if (onPageChange) {
            onPageChange(page);
        } else {
            setInternalPage(page);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Sr No.
                            </th>

                            {/* ✅ Columns always map here */}
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${col.className || ""
                                        }`}
                                >
                                    {col.header}
                                </th>
                            ))}

                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="px-6 py-10 text-center animate-pulse">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                                            Fetching Data...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + 2} className="px-6 py-12 text-center">
                                    <span className="text-sm font-medium text-gray-400">
                                        No records found
                                    </span>
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, idx) => (
                                <tr key={item._id || idx} className="hover:bg-gray-50/50 transition-colors group">
                                    {/* ✅ Serial number across pages */}
                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">
                                        {(activePage - 1) * itemsPerPage + idx + 1}
                                    </td>

                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-6 py-4 text-sm ${col.className || ""}`}>
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                            )}

                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                            )}

                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Stats and Pagination */}



            {totalPages > 1 && (
                <Pagination
                    currentPage={activePage}
                    totalPages={totalPages}
                    totalItems={data.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}

        </div>
    );
};

export default AdminTable;
