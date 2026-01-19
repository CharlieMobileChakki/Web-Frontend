

import React, { useState, useEffect } from "react";

const CategoryFormModal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    image: null,
  });

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);

  // Load edit data
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        title: editData.title || "",
        image: null, // new file will overwrite
      });

      if (editData.image) {
        setPreview(editData.image); // show old image in edit mode

        const parts = editData.image.split("/");
        setFileName(parts[parts.length - 1]); // show old filename
      }
    } else {
      setFormData({ name: "", title: "", image: null });
      setPreview(null);
      setFileName("");
    }
  }, [editData]);

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="bg-[#2c3e50] p-4 sm:p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            {editData ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition text-3xl font-light leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              placeholder="Enter category title"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition relative">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-gray-500 text-sm">
                Drag & drop image here or <span className="text-blue-600 font-medium">browse</span>
              </p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mt-3 flex justify-center">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  {fileName && (
                    <p className="mt-2 text-xs text-center text-gray-600 truncate max-w-[128px]">{fileName}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] font-medium transition shadow-sm text-sm"
            >
              {editData ? "Update" : "Save"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CategoryFormModal;
