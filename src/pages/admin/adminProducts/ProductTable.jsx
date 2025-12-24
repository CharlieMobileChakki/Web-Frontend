import React, { useState, useEffect, useRef } from "react";

const ProductTable = ({ products, categories, onEdit, onDelete }) => {
    const [expandedNameId, setExpandedNameId] = useState(null);
    const nameRefs = useRef({});
    const [isNameOverflow, setIsNameOverflow] = useState({});
    const [expandedVariants, setExpandedVariants] = useState({});

    const getCategoryName = (id) => {
        const cat = categories?.find((c) => c._id === id);
        return cat ? cat.name : "Unknown";
    };


    // useEffect(() => {
    //     const checkOverflow = () => {
    //         const nameOverflowStatus = {};

    //         products?.forEach((p) => {
    //             const nameEl = nameRefs.current[p._id];
    //             if (nameEl) nameOverflowStatus[p._id] = nameEl.scrollHeight > nameEl.clientHeight;
    //         });

    //         setIsNameOverflow(nameOverflowStatus);
    //     };

    //     checkOverflow();
    // }, [products]);

    useEffect(() => {
        const checkOverflow = () => {
            const nameOverflowStatus = {};

            products?.forEach((p) => {
                const nameEl = nameRefs.current[p._id];
                if (nameEl) nameOverflowStatus[p._id] = nameEl.scrollHeight > nameEl.clientHeight;
            });

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
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full sm:min-w-[800px] lg:min-w-[1000px] border-collapse h-max-content">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                        <th className="p-1 sm:p-2 border">Image</th>
                        <th className="p-1 sm:p-2 border">Name</th>
                        <th className="p-1 sm:p-2 border">Category</th>
                        <th className="p-1 sm:p-2 border">Variants</th>
                        <th className="p-1 sm:p-2 border">Price Range</th>
                        <th className="p-1 sm:p-2 border">Total Stock</th>
                        <th className="p-1 sm:p-2 border hidden sm:table-cell">Featured</th>
                        <th className="p-1 sm:p-2 border hidden sm:table-cell">Status</th>
                        <th className="p-1 sm:p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products?.map((p) => (
                        <React.Fragment key={p._id}>
                            <tr className="text-xs sm:text-sm">
                                {/* Image - show first variant's first image */}
                                {/* Image - show first variant's first image */}
                                <td className="p-2 border min-w-[140px]">
                                    <div className="flex flex-wrap gap-1">
                                        {p.images?.length > 0 ? (
                                            p.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    className="h-10 w-10 rounded object-cover border border-gray-200"
                                                    alt={p.name}
                                                    title={`Image ${idx + 1}`}
                                                />
                                            ))
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-100 rounded flex justify-center items-center text-xs text-gray-400 border border-gray-200">
                                                N/A
                                            </div>
                                        )}
                                    </div>
                                </td>


                                {/* Name */}
                                <td className="p-1 sm:p-2 border align-top">
                                    {expandedNameId === p._id ? (
                                        <div className="relative bg-white border rounded p-2 shadow-md">
                                            <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-line">
                                                {p.name}
                                            </p>
                                            <button
                                                className="text-blue-600 cursor-pointer text-xs mt-2 underline"
                                                onClick={() => setExpandedNameId(null)}
                                            >
                                                Show Less
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p
                                                ref={(el) => (nameRefs.current[p._id] = el)}
                                                className="text-xs sm:text-sm text-gray-800 line-clamp-2"
                                            >
                                                {p.name}
                                            </p>
                                            {isNameOverflow[p._id] && (
                                                <button
                                                    className="text-blue-600 cursor-pointer text-xs block mt-1 underline"
                                                    onClick={() => setExpandedNameId(p._id)}
                                                >
                                                    Show More
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>


                                <td className="p-1 sm:p-2 border text-xs sm:text-sm">{getCategoryName(p.category)}</td>
                                {/* Variants Count */}
                                <td className="p-1 sm:p-2 border text-xs sm:text-sm">
                                    <button
                                        onClick={() => toggleVariants(p._id)}
                                        className="text-blue-600 underline"
                                    >
                                        {p.variants?.length || 0} variant(s)
                                    </button>
                                </td>

                                <td className="p-1 sm:p-2 border text-xs sm:text-sm">{getPriceDisplay(p)}</td>
                                <td className="p-1 sm:p-2 border text-xs sm:text-sm">{getTotalStock(p)}</td>

                                {/* Featured */}
                                <td className="p-1 sm:p-2 border text-xs sm:text-sm hidden sm:table-cell">
                                    {p.isFeatured ? (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">★ Featured</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>

                                <td className="p-1 sm:p-2 border text-xs sm:text-sm hidden sm:table-cell">
                                    <span className={`px-2 py-1 rounded text-xs ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {p.status}
                                    </span>
                                </td>

                                <td className="p-1 sm:p-2 border">
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                        <button
                                            onClick={() => onEdit(p)}
                                            className="px-2 py-1 bg-blue-600 cursor-pointer text-white rounded text-xs whitespace-nowrap"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete(p._id)}
                                            className="px-2 py-1 bg-red-600 cursor-pointer text-white rounded text-xs whitespace-nowrap"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Expanded Variants Row */}
                            {expandedVariants[p._id] && (
                                <tr>
                                    <td colSpan="9" className="p-3 bg-gray-50 border">
                                        <div className="text-sm">
                                            <h4 className="font-semibold mb-2">Variants Details:</h4>
                                            <div className="space-y-2">
                                                {p.variants?.map((variant, idx) => (
                                                    <div key={variant._id || idx} className="border p-2 bg-white rounded">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                                            <div>
                                                                <span className="font-medium">Name:</span> {variant.nameSuffix || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Quantity:</span> {variant.quantity || 'N/A'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Price:</span> ₹{variant.price}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Selling:</span> ₹{variant.sellingPrice}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Purchase:</span> ₹{variant.purchasePrice}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Stock:</span> {variant.stock}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="font-medium">Description:</span> {variant.description || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
