import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    adminGetBookingProducts,
    adminGetBookingCategories,
    adminCreateBookingProduct,
    adminUpdateBookingProduct,
    adminDeleteBookingProduct,
} from "../../../store/slices/adminSlice/AdminBookingSlice";
import { toast } from "react-toastify";
import AdminTable from "../../../components/admin/AdminTable";
import CommonModal from "../../../components/admin/CommonModal";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import {
    AddButton,
    CancelButton,
    UpdateButton,
} from "../../../components/common/AddButton";
import { adminBookingProductSchema } from "../../../utils/validations/ValidationSchemas";

const BookingProductsTab = ({ searchParams, setSearchParams }) => {
    const [errors, setErrors] = useState({});
    const [editVariantIndex, setEditVariantIndex] = useState(null);
    const dispatch = useDispatch();
    const { products = [], categories = [], loading } = useSelector(
        (state) => state.adminBooking
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    // ✅ URL Pagination
    const currentPage = Number(searchParams.get("productsPage")) || 1;

    const handlePageChange = (page) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("productsPage", String(page));
            return params;
        });
    };

    // ✅ Search Reset
    useEffect(() => {
        if (searchTerm) {
            setSearchParams((prev) => {
                const params = new URLSearchParams(prev);
                params.set("productsPage", "1");
                return params;
            }, { replace: true });
        }
    }, [searchTerm, setSearchParams]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        status: "active",
        isFeatured: false,
        images: [],
        variants: [
            {
                quantity: "",
                nameSuffix: "",
                description: "",
                price: "",
                sellingPrice: "",
                purchasePrice: "",
                stock: "",
            }
        ],
    });



    useEffect(() => {
        dispatch(adminGetBookingProducts());
        dispatch(adminGetBookingCategories());
    }, [dispatch]);

    const filteredProducts = products.filter((prod) =>
        prod.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleOpenModal = (product = null) => {
        if (product) {
            setIsEditMode(true);
            setFormData({
                _id: product._id,
                name: product.name,
                category:
                    typeof product.category === "object"
                        ? product.category._id
                        : product.category,
                status: product.status || "active",
                isFeatured: product.isFeatured || false,
                images: product.images || [],
                variants: product.variants?.length > 0
                    ? product.variants.map((v) => ({
                        quantity: v.quantity || "",
                        nameSuffix: v.nameSuffix || "",
                        description: v.description || "",
                        price: v.price || "",
                        sellingPrice: v.sellingPrice || "",
                        purchasePrice: v.purchasePrice || "",
                        stock: v.stock || "",
                        lowStockThreshold: v.lowStockThreshold || 0,
                        _id: v._id,
                    }))
                    : [
                        {
                            quantity: "",
                            nameSuffix: "",
                            description: "",
                            price: "",
                            sellingPrice: "",
                            purchasePrice: "",
                            stock: "",
                            lowStockThreshold: 0,
                        },
                    ],
            });
        } else {
            setIsEditMode(false);
            setFormData({
                name: "",
                category: "",
                status: "active",
                isFeatured: false,
                images: [],
                variants: [
                    {
                        quantity: "",
                        nameSuffix: "",
                        description: "",
                        price: "",
                        sellingPrice: "",
                        purchasePrice: "",
                        stock: "",
                        lowStockThreshold: 0,
                    },
                ],
            });
        }

        setIsModalOpen(true);
    };



    const [replaceImageIndex, setReplaceImageIndex] = useState(null);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        try {
            const uploadPromises = files.map((file) => UploadToCloudinary(file));
            const urls = await Promise.all(uploadPromises);

            const validUrls = urls.filter((url) => url !== null);

            if (validUrls.length > 0) {
                setFormData((prev) => {
                    const updatedImages = [...prev.images];

                    // ✅ Replace mode (only for single file if index is set, though UI supports multiple add)
                    if (replaceImageIndex !== null) {
                        // If replacing, we only take the first new image
                        updatedImages[replaceImageIndex] = validUrls[0];
                    } else {
                        // ✅ Add mode
                        updatedImages.push(...validUrls);
                    }

                    return { ...prev, images: updatedImages };
                });

                toast.success(replaceImageIndex !== null ? "Image replaced" : "Images added");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
            setReplaceImageIndex(null);
            e.target.value = ""; // reset input
        }
    };



    // Remove variant
    const removeVariant = (index) => {
        if (formData.variants.length > 1) {
            const updatedVariants = formData.variants.filter((_, i) => i !== index);
            setFormData({ ...formData, variants: updatedVariants });
        }
    };

    // Handle variant field changes
    const handleVariantChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedVariants = [...(prev.variants || [])];
            updatedVariants[index] = { ...updatedVariants[index], [field]: value };
            return { ...prev, variants: updatedVariants };
        });
    };

    // Add new variant
    const addVariant = () => {
        setFormData((prev) => ({
            ...prev,
            variants: [
                ...(prev.variants || []),
                {
                    quantity: "",
                    nameSuffix: "",
                    description: "",
                    price: "",
                    sellingPrice: "",
                    purchasePrice: "",
                    stock: "",
                    lowStockThreshold: 0,
                },
            ],
        }));
    };







    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ Yup validation
            setErrors({}); // clear old erro
            await adminBookingProductSchema.validate(formData, { abortEarly: false });

            if (isEditMode) {
                await dispatch(
                    adminUpdateBookingProduct({
                        id: formData._id,
                        data: formData,
                    })
                ).unwrap();
                toast.success("Product Updated Successfully");
            } else {
                await dispatch(adminCreateBookingProduct(formData)).unwrap();
                toast.success("Product Created Successfully");
            }

            setIsModalOpen(false);
        } catch (err) {
            if (err.inner) {
                const validationErrors = {};
                err.inner.forEach(e => {
                    if (e.path) {
                        // Check if path is like variants[0].quantity
                        const pathMatch = e.path.match(/variants\[(\d+)\]\.(.+)/);
                        if (pathMatch) {
                            const index = pathMatch[1];
                            const field = pathMatch[2];
                            validationErrors[`variants_${index}_${field}`] = e.message;
                        } else {
                            validationErrors[e.path] = e.message;
                        }
                    }
                });
                setErrors(validationErrors);
            }
            console.log("Validation failed", err);
        }
    };





    const handleDelete = async (product) => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            try {
                await dispatch(adminDeleteBookingProduct(product._id)).unwrap();
                toast.success("Product deleted");
            } catch (err) {
                toast.error(err || "Delete failed");
            }
        }
    };

    const columns = [
        {
            header: "Product",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <img
                        src={item.images?.[0] || "https://via.placeholder.com/50"}
                        className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                            #{item._id?.slice(-6)}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            header: "Category",
            render: (item) => {
                const categoryName =
                    typeof item.category === "object"
                        ? item.category?.name
                        : categories.find((c) => c._id === item.category)?.name;

                return (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                        {categoryName || "NA"}
                    </span>
                );
            },
        },

        {
            header: "Status",
            render: (item) => (
                <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {item.status}
                </span>
            ),
        },
        {
            header: "Variants",
            render: (item) => (
                <span className="font-bold text-gray-600">
                    {item.variants?.length || 0} Variant
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">

                    <AddButton onClick={() => handleOpenModal()} title="Add Product" />
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredProducts}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? "Update Booking Product" : "Create Booking Product"}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    value={formData.name || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                                {errors.name && (
                                    <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                                    Category
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    value={formData.category || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                        value={formData.status || "active"}
                                        onChange={(e) =>
                                            setFormData({ ...formData, status: e.target.value })
                                        }
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex-1 flex items-center justify-center pt-5">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div
                                            className={`w-10 h-5 rounded-full transition-colors relative ${formData.isFeatured ? "bg-blue-600" : "bg-gray-200"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isFeatured ? "left-6" : "left-1"
                                                    }`}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors uppercase">
                                            Featured Product
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.isFeatured}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    isFeatured: e.target.checked,
                                                })
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3 ml-1">
                                Product Images
                            </label>
                            <div className="grid grid-cols-3 gap-3">

                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square group">

                                        {/* ✅ click to replace */}
                                        <label
                                            className="block w-full h-full cursor-pointer"
                                            onClick={() => setReplaceImageIndex(idx)}
                                            title="Click to replace image"
                                        >
                                            <img
                                                src={img}
                                                className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm"
                                            />

                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>

                                        {/* ❌ remove */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    images: formData.images.filter((_, i) => i !== idx),
                                                })
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-all"
                                        >
                                            <FaTimes size={10} />
                                        </button>
                                    </div>
                                ))}


                                <label
                                    className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all ${uploading ? "opacity-50" : ""
                                        }`}
                                >
                                    <FaPlus className="text-gray-300" />
                                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                        {uploading ? "Wait..." : "Add"}
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                                {errors.images && (
                                    <p className="text-[11px] text-red-500 font-semibold mt-1 ml-1">
                                        {errors.images}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* varient */}

                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Product Variants</h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm font-medium border border-blue-200"
                            >
                                + Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(formData.variants || []).map((variant, index) => (

                                <div key={index} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative hover:shadow-sm transition">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-md text-xs sm:text-sm">Variant #{index + 1}</h4>
                                        {(formData.variants?.length || 0) > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}

                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                        <div className="col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
                                            <input
                                                type="number"
                                                value={variant.quantity}
                                                placeholder="Quantity"
                                                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_quantity`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_quantity`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</label>
                                            <input
                                                type="text"
                                                value={variant.nameSuffix}
                                                onChange={(e) => handleVariantChange(index, 'nameSuffix', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                                placeholder="g, kg"
                                            />
                                            {errors[`variants_${index}_nameSuffix`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_nameSuffix`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                placeholder="Stock"
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_stock`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_stock`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Price (MRP)</label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                placeholder="Price (MRP)"
                                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_price`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_price`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Selling Price</label>
                                            <input
                                                type="number"
                                                value={variant.sellingPrice}
                                                placeholder="Selling Price"
                                                onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_sellingPrice`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_sellingPrice`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Purchase Price</label>
                                            <input
                                                type="number"
                                                value={variant.purchasePrice}
                                                placeholder="Purchase Price"
                                                onChange={(e) => handleVariantChange(index, 'purchasePrice', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_purchasePrice`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_purchasePrice`]}</p>
                                            )}
                                        </div>
                                        <div className="col-span-2 md:col-span-4 lg:col-span-6">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
                                            <input
                                                type="text"
                                                value={variant.description}
                                                placeholder="Variant details..."
                                                onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                            {errors[`variants_${index}_description`] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[`variants_${index}_description`]}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>




                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <CancelButton
                            onClick={() => setIsModalOpen(false)}
                            title="Cancel"
                        />


                        <UpdateButton
                            type="submit"
                            title={isEditMode ? "Update Product" : "Create Product"}
                            disabled={loading}
                        />
                    </div>
                </form>
            </CommonModal>
        </div>
    );
};

export default BookingProductsTab;
