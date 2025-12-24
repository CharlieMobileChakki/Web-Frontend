


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
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Category Name */}
          <div>
            <label className="block text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 mb-1">Image</label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            {/* Preview */}
            {preview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded border"
                />


              </div>
            )}

            {/* File Name */}
            {fileName && (
              <p className="mt-1 text-sm text-green-700">{fileName}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
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
              {editData ? "Update" : "Save"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CategoryFormModal;

