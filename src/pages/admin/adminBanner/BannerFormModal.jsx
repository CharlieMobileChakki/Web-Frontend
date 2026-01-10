import React, { useState, useEffect } from "react";

const BannerFormModal = ({ isOpen, onClose, onSave, editData }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
        order: 0,
        image: null,
        isActive: true,
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                description: editData.description || "",
                link: editData.link || "",
                order: editData.order || 0,
                image: null,
                isActive: editData.isActive !== undefined ? editData.isActive : editData.status === "active",
            });

            if (editData.image) {
                setPreview(editData.image);
                const parts = editData.image.split("/");
                setFileName(parts[parts.length - 1]);
            }
        } else {
            setFormData({
                title: "",
                description: "",
                link: "",
                order: 0,
                image: null,
                isActive: true,
            });
            setPreview(null);
            setFileName("");
        }
        setErrors({});
    }, [editData, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === "image") {
            const file = files[0];
            if (!file) return;

            setFormData({ ...formData, image: file });
            setFileName(file.name);

            const imgURL = URL.createObjectURL(file);
            setPreview(imgURL);
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!editData && !formData.image) {
            newErrors.image = "Banner image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Create FormData for file upload
        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("description", formData.description);
        submitData.append("link", formData.link);
        submitData.append("order", formData.order);
        submitData.append("isActive", formData.isActive);

        if (formData.image instanceof File) {
            submitData.append("image", formData.image);
        }

        onSave(submitData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg my-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                    {editData ? "Edit Banner" : "Add Banner"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded ${errors.title ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Enter Banner title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Brief description (optional)"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-gray-700 mb-1">Link URL</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="https://example.com (optional)"
                        />
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Display Order
                            <span className="text-sm text-gray-500 ml-2">
                                (Lower numbers appear first)
                            </span>
                        </label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            min="0"
                            className="w-full border border-gray-300 p-2 rounded"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Banner Image {!editData && <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className={`w-full border p-2 rounded ${errors.image ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}

                        {/* Preview */}
                        {preview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded border"
                                />
                            </div>
                        )}

                        {/* File Name */}
                        {fileName && (
                            <p className="mt-1 text-sm text-green-700">{fileName}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-green-600 cursor-pointer"
                        />
                        <label className="ml-2 text-gray-700 cursor-pointer">
                            Active (Display on website)
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-700 text-white cursor-pointer rounded hover:bg-green-800"
                        >
                            {editData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerFormModal;
