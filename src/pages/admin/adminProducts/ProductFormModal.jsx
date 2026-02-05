import React, { useState, useEffect } from "react";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";
import { adminProductSchema } from "../../../utils/validations/ValidationSchemas";

const ProductFormModal = ({ categories, isOpen, onClose, onSave, editData, platforms, platformsLoading }) => {

    const [form, setForm] = useState({
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
        marketplaceOptions: [],
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name || "",
                category: editData.category || "",
                status: editData.status || "active",
                isFeatured: editData.isFeatured || false,
                images: editData.images || [],     // ✅ FIX ADDED
                variants: editData.variants?.length > 0
                    ? editData.variants.map(v => ({
                        quantity: v.quantity || "",
                        nameSuffix: v.nameSuffix || "",
                        description: v.description || "",
                        price: v.price || "",
                        sellingPrice: v.sellingPrice || "",
                        purchasePrice: v.purchasePrice || "",
                        stock: v.stock || "",
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
                        }
                    ],
                marketplaceOptions: editData.marketplaceOptions?.length > 0
                    ? editData.marketplaceOptions.map(m => ({
                        platform: m.platform?._id || m.platform || "",
                        productUrl: m.productUrl || "",
                        isActive: m.isActive ?? true,
                        _id: m._id,
                    }))
                    : [],
            });
        } else {
            setForm({
                name: "",
                category: "",
                status: "active",
                isFeatured: false,
                images: [],        // default
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
        }
    }, [editData]);

    if (!isOpen) return null;

    // Input change for main product fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle variant field changes
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...form.variants];
        updatedVariants[index][field] = value;
        setForm({ ...form, variants: updatedVariants });
    };

    // Add new variant
    const addVariant = () => {
        setForm({
            ...form,
            variants: [
                ...form.variants,
                {
                    quantity: "",
                    nameSuffix: "",
                    description: "",
                    price: "",
                    sellingPrice: "",
                    purchasePrice: "",
                    stock: "",
                }
            ]
        });
    };


    // PRODUCT IMAGE UPLOAD
    const handleProductImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const uploaded = [];

        for (let file of files) {
            const url = await UploadToCloudinary(file);
            if (url) uploaded.push(url);
        }

        setForm({
            ...form,
            images: [...form.images, ...uploaded]
        });
    };

    // REMOVE MAIN PRODUCT IMAGE
    const handleRemoveProductImage = (index) => {
        const updated = [...form.images];
        updated.splice(index, 1);
        setForm({ ...form, images: updated });
    };

    // Remove variant
    const removeVariant = (index) => {
        if (form.variants.length > 1) {
            const updatedVariants = form.variants.filter((_, i) => i !== index);
            setForm({ ...form, variants: updatedVariants });
        }
    };

    // MARKETPLACE OPTIONS HANDLERS
    const handleMarketplaceChange = (index, field, value) => {
        const updated = [...form.marketplaceOptions];
        updated[index] = { ...updated[index], [field]: value };
        setForm({ ...form, marketplaceOptions: updated });
    };

    const addMarketplaceOption = () => {
        setForm({
            ...form,
            marketplaceOptions: [
                ...form.marketplaceOptions,
                { platform: "", productUrl: "", isActive: true }
            ]
        });
    };

    const removeMarketplaceOption = (index) => {
        const updated = form.marketplaceOptions.filter((_, i) => i !== index);
        setForm({ ...form, marketplaceOptions: updated });
    };



    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            status: "active",
            isFeatured: false,
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
            marketplaceOptions: [], // ✅ FIX
        });
    };
    const handleSubmit = async () => {
        try {
            setErrors({});

            // Simple validation for marketplace options
            const invalidMarketplace = form.marketplaceOptions.some(m => !m.platform || !m.productUrl);
            if (invalidMarketplace) {
                alert("Please fill both Platform and URL for all marketplace links.");
                return;
            }

            await adminProductSchema.validate(form, { abortEarly: false });
            await onSave(form);
            resetForm();
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


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00000080] backdrop-blur-sm sm:p-4 overflow-hidden">
            <div className="bg-white sm:rounded-xl shadow-2xl w-full max-w-6xl h-full sm:h-auto sm:max-h-[95vh] relative flex flex-col transition-all duration-300">

                {/* Header */}
                <div className="bg-[#2c3e50] p-4 rounded-t-none sm:rounded-t-xl flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">
                        {editData ? "Edit Product" : "Add New Product"}
                    </h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-white transition text-3xl font-light leading-none">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* General Info Section */}
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
                                    placeholder="Enter product name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm"
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>

                            </div>
                            <div className="flex items-center mt-2 md:mt-6 lg:mt-8 md:col-span-3 lg:col-span-1">
                                <label className="flex items-center cursor-pointer relative">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={form.isFeatured}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    {errors.isFeatured && (
                                        <p className="text-red-500 text-xs mt-1">{errors.isFeatured}</p>
                                    )}
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Featured Product</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 border-b pb-2">Product Images</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50 text-center hover:bg-gray-100 transition relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleProductImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {errors.images && (
                                <p className="text-red-500 text-xs mt-1">{errors.images}</p>
                            )}
                            <p className="text-gray-500 text-sm">Drag & drop images here or <span className="text-blue-600 font-medium">browse</span></p>
                        </div>

                        {(form.images || []).length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mt-4">
                                {form.images.map((img, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <img src={img} className="w-full h-full object-cover rounded-lg shadow-sm border" alt="product" />
                                        <button
                                            type="button"
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-md hover:bg-red-600"
                                            onClick={() => handleRemoveProductImage(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {errors.images && (
                                    <p className="text-red-500 text-xs mt-1">{errors.images}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Variants Section */}
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
                            {(form.variants || []).map((variant, index) => (

                                <div key={index} className="border border-gray-200 p-4 rounded-xl bg-gray-50 relative hover:shadow-sm transition">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-md text-xs sm:text-sm">Variant #{index + 1}</h4>
                                        {form.variants.length > 1 && (
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
                                                onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                                placeholder="e.g. 500"
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
                                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                                placeholder="0"
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
                                                onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                                placeholder="Variant details..."
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

                    {/* Marketplace Options Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Marketplace Links</h3>
                            <button
                                type="button"
                                onClick={addMarketplaceOption}
                                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-xs sm:text-sm font-medium border border-green-200"
                            >
                                + Add Link
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* {form.marketplaceOptions.length || 0 === 0 ? ( */}
                            {(form.marketplaceOptions?.length ?? 0) === 0 ? (
                                <p className="text-gray-400 text-sm italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    No marketplace links added yet.
                                </p>
                            ) : (
                                form.marketplaceOptions.map((option, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-end">
                                        <div className="md:col-span-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Platform</label>
                                            <select
                                                value={option.platform}
                                                onChange={(e) => handleMarketplaceChange(index, 'platform', e.target.value)}
                                                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white"
                                            >
                                                <option value="">Select Platform</option>
                                                {platforms?.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-6">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Product URL</label>
                                            <input
                                                type="url"
                                                value={option.productUrl}
                                                onChange={(e) => handleMarketplaceChange(index, 'productUrl', e.target.value)}
                                                placeholder="https://flipkart.com/..."
                                                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center h-[38px] pb-2">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={option.isActive}
                                                    onChange={(e) => handleMarketplaceChange(index, 'isActive', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 relative"></div>
                                                <span className="ml-2 text-xs font-medium text-gray-700">Active</span>
                                            </label>
                                        </div>
                                        <div className="md:col-span-1 flex justify-end pb-1">
                                            <button
                                                type="button"
                                                onClick={() => removeMarketplaceOption(index)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t rounded-b-none sm:rounded-b-xl flex justify-end gap-3 sticky bottom-0 z-10 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] font-medium transition shadow-sm disabled:opacity-70 text-sm"
                    >
                        {editData ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;

