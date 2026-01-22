import React, { useState, useEffect } from "react";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";

const ProductFormModal = ({ categories, isOpen, onClose, onSave, editData }) => {

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
    });

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
        });
    };

    const handleSubmit = async () => {
        try {
            await onSave(form);
            resetForm();
        } catch (err) {
            console.log("Save failed", err);
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
                            <p className="text-gray-500 text-sm">Drag & drop images here or <span className="text-blue-600 font-medium">browse</span></p>
                        </div>

                        {form.images.length > 0 && (
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
                            {form.variants.map((variant, index) => (
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
                                        </div>
                                        <div className="col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Price (MRP)</label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Selling Price</label>
                                            <input
                                                type="number"
                                                value={variant.sellingPrice}
                                                onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                            <label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">Purchase Price</label>
                                            <input
                                                type="number"
                                                value={variant.purchasePrice}
                                                onChange={(e) => handleVariantChange(index, 'purchasePrice', e.target.value)}
                                                className="w-full border border-gray-300 px-2 py-1.5 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm mt-1"
                                            />
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
                                        </div>
                                    </div>
                                </div>
                            ))}
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

