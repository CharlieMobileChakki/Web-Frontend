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

    const handleSubmit = () => {
        onSave(form);   // API ko bhej diya
        resetForm();    // form clear
    };


    return (
        <div className="  bg-opacity-40 flex  justify-center inset-0 z-50 overflow-y-auto">
            <div className="bg-white px-6 py-10 rounded shadow-md w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-4xl lg:max-w-5xl my-8">

                <h2 className="text-xl font-semibold mb-4">
                    {editData ? "Edit Product" : "Add Product"}
                </h2>

                {/* Name */}
                <div className="mb-3">
                    <label className="block font-medium">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Category */}
                <div className="mb-3">
                    <label>Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="">Select Category</option>
                        {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="mb-3">
                    <label>Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>


                {/* PRODUCT IMAGES */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Product Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleProductImageUpload}
                        className="w-full border px-3 py-2 rounded"
                    />

                    {/* PREVIEW */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {form.images?.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img}
                                    className="w-20 h-20 object-cover rounded border"
                                    alt="product"
                                />
                                <button
                                    type="button"
                                    className="absolute top-[-6px] left-[0px] bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                                    onClick={() => handleRemoveProductImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>



                {/* isFeatured */}
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        name="isFeatured"
                        checked={form.isFeatured}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4"
                    />
                    <label className="font-medium">Featured Product</label>
                </div>

                <hr className="my-4" />

                {/* VARIANTS SECTION */}
                <h3 className="text-lg font-semibold mb-3">Product Variants</h3>

                {form.variants.map((variant, index) => (
                    <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Variant {index + 1}</h4>
                            {form.variants.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVariant(index)}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Quantity */}
                            <div>
                                <label className="text-sm">Quantity (e.g., 500)</label>
                                <input
                                    type="number"
                                    value={variant.quantity}
                                    onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="500"
                                />
                            </div>

                            {/* Name Suffix */}
                            <div>
                                <label className="text-sm">Name Suffix (e.g., 500g)</label>
                                <input
                                    type="text"
                                    value={variant.nameSuffix}
                                    onChange={(e) => handleVariantChange(index, 'nameSuffix', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="500g"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="text-sm">Description</label>
                                <input
                                    type="text"
                                    value={variant.description}
                                    onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Small pack"
                                />
                            </div>

                            {/* Prices */}
                            <div>
                                <label className="text-sm">Price (MRP)</label>
                                <input
                                    type="number"
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Selling Price</label>
                                <input
                                    type="number"
                                    value={variant.sellingPrice}
                                    onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Purchase Price</label>
                                <input
                                    type="number"
                                    value={variant.purchasePrice}
                                    onChange={(e) => handleVariantChange(index, 'purchasePrice', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Stock</label>
                                <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                        </div>


                    </div>
                ))}

                {/* Add Variant Button */}
                <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
                >
                    + Add Another Variant
                </button>

                <hr className="my-4" />

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Save Product
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProductFormModal;

