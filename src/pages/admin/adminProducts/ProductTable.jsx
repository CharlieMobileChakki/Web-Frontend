import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
import Pagination from "../../../components/admin/Pagination";

const ProductTable = ({ products = [], categories = [], onEdit, onDelete }) => {
    const nameRefs = useRef({});
    const [isNameOverflow, setIsNameOverflow] = useState({});
    const [expandedVariants, setExpandedVariants] = useState({});
    const getCategoryName = (id) => {
        const cat = categories?.find((c) => c._id === id);
        return cat ? cat.name : "Unknown";
    };

    // ✅ Pagination
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil((products?.length || 0) / itemsPerPage) || 1;


    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = (products || []).slice(startIndex, startIndex + itemsPerPage);


    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };



    // products change hone par page reset
    useEffect(() => {
        setCurrentPage(1);
    }, [products]);

    useEffect(() => {
        const checkOverflow = () => {
            const nameOverflowStatus = {};

            currentProducts.forEach((p) => {
                if (!p || !p._id) return;
                const nameEl = nameRefs.current[p._id];
                if (nameEl)
                    nameOverflowStatus[p._id] =
                        nameEl.scrollHeight > nameEl.clientHeight;
            });

            setIsNameOverflow(nameOverflowStatus);
        };

        checkOverflow();
    }, [currentPage]);

    useEffect(() => {
        const checkOverflow = () => {
            const nameOverflowStatus = {};

            if (Array.isArray(currentProducts)) {
                currentProducts.forEach((p) => {
                    if (!p || !p._id) return;
                    const nameEl = nameRefs.current[p._id];
                    if (nameEl) nameOverflowStatus[p._id] = nameEl.scrollHeight > nameEl.clientHeight;
                });
            }

            setIsNameOverflow(nameOverflowStatus);
        };

        checkOverflow();
    }, [products]);

    const toggleVariants = (productId) => {
        setExpandedVariants(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Get price range for products with multiple variants
    const getPriceDisplay = (product) => {
        if (!product.variants || product.variants.length === 0) {
            return "N/A";
        }

        if (product.variants.length === 1) {
            return `₹${product.variants[0].sellingPrice}`;
        }

        const prices = product.variants.map(v => v.sellingPrice);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            return `₹${minPrice}`;
        }

        return `₹${minPrice} - ₹${maxPrice}`;
    };

    // Get total stock across all variants
    const getTotalStock = (product) => {
        if (!product.variants || product.variants.length === 0) {
            return 0;
        }
        return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full whitespace-nowrap text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SR NO.</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variants</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Stock</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Marketplaces</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {currentProducts.map((p, index) => {
                            if (!p || !p._id) return null;
                            return (
                                <React.Fragment key={p._id}>
                                    <tr className="hover:bg-gray-50 transition duration-150">
                                        {/* SR No */}
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {startIndex + index + 1}
                                        </td>

                                        {/* Product: Image + Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {p.images?.length > 0 ? (
                                                        <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                                    )}
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <div className="text-sm font-medium text-gray-900 truncate" title={p.name}>
                                                        {p.name}
                                                    </div>
                                                    {p.isFeatured && (
                                                        <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">
                                                            ★ Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                                                {getCategoryName(p.category)}
                                            </span>
                                        </td>

                                        {/* Variants Count */}
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => toggleVariants(p._id)}
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs flex items-center gap-1"
                                            >
                                                {p.variants?.length || 0} Variants
                                                <span className="text-[10px]">{expandedVariants[p._id] ? '▲' : '▼'}</span>
                                            </button>
                                        </td>

                                        {/* Price Range */}
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {getPriceDisplay(p)}
                                        </td>

                                        {/* Total Stock */}
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTotalStock(p) > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {getTotalStock(p)}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${p.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${p.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}`}></span>
                                                {p.status}
                                            </span>
                                        </td>

                                        {/* Marketplaces */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {p.marketplaceOptions?.length > 0 ? (
                                                    p.marketplaceOptions.map((opt, idx) => (
                                                        <a
                                                            key={opt._id || idx}
                                                            href={opt.productUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`p-1 rounded-md transition-all ${opt.isActive ? 'hover:bg-blue-50 text-blue-500' : 'opacity-30 grayscale cursor-not-allowed'}`}
                                                            title={`${opt.isActive ? 'Go to Marketplace' : 'Inactive Marketplace Link'}`}
                                                            onClick={(e) => !opt.isActive && e.preventDefault()}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-300 text-xs">-</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(p)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => onDelete(p._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Variants Row */}
                                    {expandedVariants[p._id] && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan="9" className="p-4 border-t border-gray-100 shadow-inner">
                                                <div className="pl-14">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Variants Breakdown</h4>
                                                    <div className="bg-white border rounded-lg overflow-hidden">
                                                        <table className="min-w-full divide-y divide-gray-100">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                                                                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Price</th>
                                                                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Selling</th>
                                                                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Stock</th>
                                                                    <th className="px-4 py-2 text-xs font-medium text-gray-500">Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {p.variants?.map((variant, idx) => (
                                                                    <tr key={variant._id || idx}>
                                                                        <td className="px-4 py-2 text-sm text-gray-700 font-medium">{variant.nameSuffix || '-'}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-500">₹{variant.price}</td>
                                                                        <td className="px-4 py-2 text-sm text-gray-800 font-medium">₹{variant.sellingPrice}</td>
                                                                        <td className="px-4 py-2 text-sm">
                                                                            <span className={`px-1.5 py-0.5 rounded textxs ${variant.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                                                {variant.stock}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2 text-xs text-gray-500 italic max-w-xs truncate">{variant.description || 'No description'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ✅ Pagination UI */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={products?.length || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />



            {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <PackageOpen size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
