import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    adminGetBookingCategories,
    adminCreateBookingCategory,
    adminUpdateBookingCategory,
    adminDeleteBookingCategory,
} from "../../../store/slices/adminSlice/AdminBookingSlice";
import { toast } from "react-toastify";
import AdminTable from "../../../components/admin/AdminTable";
import CommonModal from "../../../components/admin/CommonModal";
import UploadToCloudinary from "../../../components/admin/UploadToCloudinary";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { AddButton, CancelButton, UpdateButton } from "../../../components/common/AddButton";
import { adminBookingCategorySchema } from "../../../utils/validations/ValidationSchemas";

const BookingCategoriesTab = () => {
    const dispatch = useDispatch();
    const { categories = [], loading } = useSelector((state) => state.adminBooking);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        minimumOrderAmount: "",
        images: [],
    });


    useEffect(() => {
        dispatch(adminGetBookingCategories());
    }, [dispatch]);

    // Filtered data
    const filteredCategories = categories.filter((cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleOpenModal = (category = null) => {
        if (category) {
            setIsEditMode(true);
            setFormData({
                _id: category._id,
                name: category.name,
                minimumOrderAmount: category.minimumOrderAmount,
                images: category.images || [],
            });
        } else {
            setIsEditMode(false);
            setFormData({ name: "", minimumOrderAmount: "", images: [] });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const url = await UploadToCloudinary(file);
        if (url) {
            setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            toast.success("Image uploaded successfully");
        } else {
            toast.error("Image upload failed");
        }
        setUploading(false);
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                minimumOrderAmount: Number(formData.minimumOrderAmount),
            };

            // ✅ Yup validation
            await adminBookingCategorySchema.validate(payload, { abortEarly: false });

            if (isEditMode) {
                await dispatch(
                    adminUpdateBookingCategory({
                        id: formData._id,
                        data: payload,
                    })
                ).unwrap();
                toast.success("Category updated successfully");
            } else {
                await dispatch(adminCreateBookingCategory(payload)).unwrap();
                toast.success("Category created successfully");
            }

            setIsModalOpen(false);
        } catch (err) {
            if (err?.inner?.length) {
                err.inner.forEach((e) => toast.error(e.message));
                return;
            }
            toast.error(err?.message || err || "Operation failed");
        }
    };

    const handleDelete = async (category) => {
        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                await dispatch(adminDeleteBookingCategory(category._id)).unwrap();
                toast.success("Category deleted");
            } catch (err) {
                toast.error(err || "Delete failed");
            }
        }
    };

    const columns = [
        {
            header: "Image",
            render: (item) => (
                <img
                    src={item.images?.[0] || "https://via.placeholder.com/50"}
                    alt=""
                    className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                />
            ),
        },
        { header: "Category Name", key: "name", className: "font-semibold text-gray-800" },
        {
            header: "Min Order",
            render: (item) => <span className="text-gray-600 font-medium">₹{item.minimumOrderAmount}</span>,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Tab Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <AddButton
                    onClick={() => handleOpenModal()}
                    title="Add Category"
                />
            </div>

            {/* Table */}
            <AdminTable
                columns={columns}
                data={filteredCategories}
                loading={loading}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
            />

            {/* Modal */}
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? "Update Booking Category" : "Add Booking Category"}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Aata Pesaai"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Minimum Order Amount (₹)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                            value={formData.minimumOrderAmount || ""}
                            onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                            placeholder="550"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Category Images</label>
                        <div className="grid grid-cols-4 gap-3 mb-3">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square group">
                                    <img src={img} className="w-full h-full object-cover rounded-xl border border-gray-100" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                            <label className={`aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <FaPlus className="text-gray-400 mb-1" />
                                <span className="text-[10px] text-gray-500 font-bold uppercase">{uploading ? 'Wait...' : 'Add'}</span>
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">

                        <CancelButton
                            onClick={() => setIsModalOpen(false)}
                            title="Cancel"
                        />

                        <UpdateButton
                            onClick={handleSubmit}
                            title={isEditMode ? "Update Category" : "Create Category"}
                        />
                    </div>
                </form>
            </CommonModal>
        </div>
    );
};

export default BookingCategoriesTab;
