import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { userproduct } from "../../../store/slices/ProductSlice";
import { UserCategory } from "../../../services/NetworkServices";
import Product from "../../../components/user/Product";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import { BannerSection } from "../../../components/user/BannerSection";
import Bg from "../../../assets/Banner/S1.png";
import BackButton from "../../../components/common/BackButton";
import { Filter, ChevronLeft, ChevronRight, Star, RefreshCcw } from "lucide-react";

const AllProducts = () => {
    const dispatch = useDispatch();
    const { data: products, loading, error, pagination } = useSelector((state) => state.products);
    const { reviewsByProduct } = useSelector((state) => state.reviews);
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter States
    const [categories, setCategories] = useState([]);

    // Initialize filters from URL params
    const filters = useMemo(() => ({
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 8,
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        rating: searchParams.get("rating") || ""
    }), [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await UserCategory();
                setCategories(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Trigger API with current filters
        dispatch(userproduct(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        if (products?.length > 0) {
            products.forEach((product) => {
                dispatch(userreviewsaccess(product._id));
            });
        }
    }, [dispatch, products]);

    const updateFilters = (newFilters) => {
        // Remove empty values from URL
        const params = {};
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) {
                params[key] = newFilters[key];
            }
        });
        setSearchParams(params);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        updateFilters({ ...filters, [name]: value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            updateFilters({ ...filters, page: newPage });
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const resetFilters = () => {
        setSearchParams({ page: 1, limit: 8 });
    };

    const getAverageRating = (productId) => {
        const productReviews = reviewsByProduct[productId] || [];
        if (productReviews.length === 0) return 0;
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return Number((sum / productReviews.length).toFixed(1));
    };

    const getReviewCount = (productId) => (reviewsByProduct[productId] || []).length;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <BannerSection
                title="Our Healthy Selection"
                subtitle="High-quality organic flour and grains delivered to your doorstep"
                bgImage={Bg}
                className="bg-left-bottom"
            />

            <div className="container mx-auto px-4 md:px-6">
                <div className="py-8">
                    <BackButton />
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">

                            {/* Category Filter */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Price</label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    placeholder="Min ₹"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Price</label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    placeholder="Max ₹"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* Rating */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Rating</label>
                                <select
                                    name="rating"
                                    value={filters.rating}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                </select>
                            </div>

                            {/* Items per page */}
                            <div className="space-y-1.5 text-right hidden lg:block">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Show</label>
                                <select
                                    name="limit"
                                    value={filters.limit}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="8">8 Products</option>
                                    <option value="12">12 Products</option>
                                    <option value="24">24 Products</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 group"
                        >
                            <RefreshCcw size={16} className="group-active:rotate-180 transition-transform duration-500" />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center min-h-[400px]">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products?.length > 0 ? (
                            products.map((item) => (
                                <Product
                                    key={item._id}
                                    id={item._id}
                                    imgUrl={item.images?.[0] || item.variants?.[0]?.images?.[0] || "https://via.placeholder.com/150"}
                                    name={item.name}
                                    description={item.name}
                                    sellingPrice={item.variants?.[0]?.sellingPrice || 0}
                                    actualPrice={item.variants?.[0]?.price || 0}
                                    rating={getAverageRating(item._id)}
                                    reviewCount={getReviewCount(item._id)}
                                    variantId={item.variants?.[0]?._id}
                                />
                            ))
                        ) : (
                            !loading && (
                                <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                        <Filter className="text-gray-300" size={32} />
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No products match your filters</p>
                                    <button onClick={resetFilters} className="text-blue-600 font-black text-xs uppercase tracking-tighter hover:underline">Clear all filters</button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-4">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="flex items-center gap-2">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${filters.page === i + 1
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "hover:bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === pagination.totalPages}
                                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
