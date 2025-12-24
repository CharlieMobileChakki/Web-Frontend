
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
} from "../../../store/slices/adminSlice/AdminProductSlice";

import SidebarTitle from "../../../components/admin/SidebarTitle";
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
        <div className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <SidebarTitle />

                <button
                    onClick={handleAdd}
                    className="px-3 sm:px-4 py-2 cursor-pointer bg-green-700 text-white rounded text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
                >
                    + Add Product
                </button>
            </div>

            {/* category filter dropdown */}
            <select
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-auto border p-2 mb-4 rounded text-sm sm:text-base"
            >
                <option value="all">All Categories</option>

                {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {loading && <p>Loading products...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <ProductTable
                    products={productsWithCategory}
                    categories={categories}  // FIXED
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categories={categories}  // FIXED
                onSave={handleSave}
                editData={editData}
            />
        </div>
    );
};

export default ProductManagement;


