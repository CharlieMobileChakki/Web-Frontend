
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
} from "../../../store/slices/adminSlice/AdminProductSlice";

import SidebarTitle from "../../../components/admin/SidebarTitle";
import Pagination from "../../../components/admin/Pagination";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import { userproduct } from "../../../store/slices/ProductSlice";
import { adminGetCategories } from "../../../store/slices/adminSlice/AdminCategorySlice";

export const ProductManagement = () => {
    const dispatch = useDispatch();

    const { data: products, loading, error } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.adminCategory);

    const [Category, setCategory] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        dispatch(userproduct());
        dispatch(adminGetCategories());
    }, [dispatch]);

    // Get category name by ID
    const getCategoryName = (id) => {
        const cat = categories?.find((c) => c._id === id);
        return cat ? cat.name : "Unknownfff";
    };

    // Filter products based on category
    const filteredProducts =
        Category === "all"
            ? products
            : products?.filter((p) => p.category === Category);

    // Add categoryName to each product
    const productsWithCategory = filteredProducts?.map((p) => ({
        ...p,
        categoryName: getCategoryName(p.category),
    }));

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = productsWithCategory?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((productsWithCategory?.length || 0) / itemsPerPage);

    const handleAdd = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        console.log('🔧 Edit clicked for product:', product);
        console.log('🔧 Product has variants:', product.variants?.length);
        setEditData(product);
        setIsModalOpen(true);
    };
    const handleDelete = async (id) => {
        await dispatch(adminDeleteProduct(id)).unwrap();
        await dispatch(userproduct()).unwrap();
    };

    const handleSave = async (data) => {
        try {
            if (editData) {
                await dispatch(adminUpdateProduct({ id: editData._id, data })).unwrap();
            } else {
                await dispatch(adminCreateProduct(data)).unwrap();
            }

            // API complete hone ke baad hi run hoga
            await dispatch(userproduct()).unwrap();

            setIsModalOpen(false);

        } catch (err) {
            console.log("Error:", err);
        }
    };



    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your inventory, prices, and variants</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">

                {/* Search (Placeholder) */}
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search products..."
                    />
                </div>

                {/* Category Filter */}
                <div className="w-full sm:w-auto">
                    <select
                        value={Category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white shadow-sm"
                    >
                        <option value="all">All Categories</option>
                        {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats or summary could go here if needed */}

                    <ProductTable
                        products={currentProducts}
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <div className="mt-4 flex justify-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            )}

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}
                onSave={handleSave}
                editData={editData}
            />
        </div>
    );
};

export default ProductManagement;


