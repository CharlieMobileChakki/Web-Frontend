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
import { FaPlus, FaSearch, FaTimes, FaLayerGroup } from "react-icons/fa";
import {
    AddButton,
    CancelButton,
    UpdateButton,
} from "../../../components/common/AddButton";

const BookingProductsTab = () => {
    const dispatch = useDispatch();
    const { products = [], categories = [], loading } = useSelector(
        (state) => state.adminBooking
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        status: "active",
        isFeatured: false,
        images: [],
        variants: [],
    });

    const [newVariant, setNewVariant] = useState({
        quantity: "",
        nameSuffix: "",
        description: "",
        purchasePrice: "",
        price: "",
        sellingPrice: "",
        stock: "",
        lowStockThreshold: "",
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
                variants: [...(product.variants || [])],
            });
        } else {
            setIsEditMode(false);
            setFormData({
                name: "",
                category: "",
                status: "active",
                isFeatured: false,
                images: [],
                variants: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const url = await UploadToCloudinary(file);
        if (url) {
            setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
            toast.success("Image uploaded");
        }
        setUploading(false);
    };

    const handleAddVariant = () => {
        if (!newVariant.quantity || !newVariant.price || !newVariant.sellingPrice) {
            toast.error("Fill required variant fields");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    ...newVariant,
                    quantity: Number(newVariant.quantity),
                    price: Number(newVariant.price),
                    sellingPrice: Number(newVariant.sellingPrice),
                    purchasePrice: Number(newVariant.purchasePrice || 0),
                    stock: Number(newVariant.stock || 0),
                    lowStockThreshold: Number(newVariant.lowStockThreshold || 0),
                },
            ],
        }));
        setNewVariant({
            quantity: "",
            nameSuffix: "",
            description: "",
            purchasePrice: "",
            price: "",
            sellingPrice: "",
            stock: "",
            lowStockThreshold: "",
        });
    };

    const handleRemoveVariant = (idx) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Select category");
        if (formData.variants.length === 0)
            return toast.error("Add at least one variant");

        try {
            if (isEditMode) {
                await dispatch(adminUpdateBookingProduct(formData)).unwrap();
                toast.success("Product Updated Successfully");
            } else {
                await dispatch(adminCreateBookingProduct(formData)).unwrap();
                toast.success("Product Created Successfully");
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err || "Save failed");
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
            render: (item) => (
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {typeof item.category === "object" ? item.category.name : "N/A"}
                </span>
            ),
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
                    {item.variants?.length || 0} Sizes
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
                <AddButton onClick={handleOpenModal} title="Add Product" />
            </div>

            <AdminTable
                columns={columns}
                data={filteredProducts}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? "Update Booking Product" : "Create Booking Product"}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                    value={formData.name || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                                    Category
                                </label>
                                <select
                                    required
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
                                        <img
                                            src={img}
                                            className="w-full h-full object-cover rounded-xl border border-gray-200 shadow-sm"
                                        />
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
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Variant Section */}
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-700 border-b border-slate-200 pb-3 mb-4">
                            <FaLayerGroup size={14} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">
                                Product Variants (Weights/Sizes)
                            </h3>
                        </div>

                        {/* Variant Input Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Qty
                                </label>
                                <input
                                    type="number"
                                    placeholder="500"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.quantity || ""}
                                    onChange={(e) =>
                                        setNewVariant({ ...newVariant, quantity: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Suffix
                                </label>
                                <input
                                    type="text"
                                    placeholder="g"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.nameSuffix || ""}
                                    onChange={(e) =>
                                        setNewVariant({ ...newVariant, nameSuffix: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    MRP (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.price || ""}
                                    onChange={(e) =>
                                        setNewVariant({ ...newVariant, price: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Purchase (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="60"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.purchasePrice || ""}
                                    onChange={(e) =>
                                        setNewVariant({
                                            ...newVariant,
                                            purchasePrice: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Selling (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="80"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.sellingPrice || ""}
                                    onChange={(e) =>
                                        setNewVariant({
                                            ...newVariant,
                                            sellingPrice: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    placeholder="50"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.stock || ""}
                                    onChange={(e) =>
                                        setNewVariant({ ...newVariant, stock: e.target.value })
                                    }
                                />
                            </div>

                            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                                    Desc
                                </label>
                                <input
                                    type="text"
                                    placeholder="Fresh ground"
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                    value={newVariant.description || ""}
                                    onChange={(e) =>
                                        setNewVariant({
                                            ...newVariant,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddVariant}
                                className="h-9 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-xs font-bold"
                            >
                                Add Slot
                            </button>
                        </div>

                        {/* Variant Chips/List */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {formData.variants.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-800">
                                            {v.quantity}
                                            {v.nameSuffix}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            ₹{v.sellingPrice}{" "}
                                            <span className="line-through">₹{v.price}</span>
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(i)}
                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <CancelButton
                            onClick={() => setIsModalOpen(false)}
                            title="Cancel"
                        />

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 sm:w-auto px-6 py-2 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all shadow-lg shadow-blue-500/20 font-bold"
                        >
                            <FaPlus size={14} />
                            {isEditMode ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </CommonModal>
        </div>
    );
};

export default BookingProductsTab;
