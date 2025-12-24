import React, { useState, useEffect } from "react";

const BlogFormModal = ({ isOpen, onClose, onSave, editData }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        author: "",
        category: "",
        image: null,
        status: "draft",
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");

    // Load edit data
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                description: editData.description || editData.excerpt || "",
                content: editData.content || "",
                author: editData.author || "",
                category: editData.category || "",
                image: null,
                status: editData.status || (editData.isPublished ? "published" : "draft"),
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
                content: "",
                author: "",
                category: "",
                image: null,
                status: "draft",
            });
            setPreview(null);
            setFileName("");
        }
        setErrors({});
    }, [editData, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files[0];
            if (!file) return;

            setFormData({ ...formData, image: file });
            setFileName(file.name);

            const imgURL = URL.createObjectURL(file);
            setPreview(imgURL);
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

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        if (!formData.author.trim()) {
            newErrors.author = "Author name is required";
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
        submitData.append("content", formData.content);
        submitData.append("author", formData.author);
        submitData.append("category", formData.category);
        submitData.append("status", formData.status);

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
                    {editData ? "Edit Blog" : "Add Blog"}
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
                            placeholder="Enter blog title"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Description/Excerpt <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            className={`w-full border p-2 rounded ${errors.description ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Brief description or excerpt"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-gray-700 mb-1">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="6"
                            className={`w-full border p-2 rounded ${errors.content ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Write your blog content here..."
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                        )}
                    </div>

                    {/* Author and Category Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Author */}
                        <div>
                            <label className="block text-gray-700 mb-1">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={`w-full border p-2 rounded ${errors.author ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Author name"
                            />
                            {errors.author && (
                                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded"
                                placeholder="e.g., Health, Technology"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-gray-700 mb-1">Featured Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        />

                        {/* Preview */}
                        {preview && (
                            <div className="mt-3">
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

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
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

export default BlogFormModal;
