import React, { useEffect, useState } from "react";
import CategoryTable from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";
import { useDispatch, useSelector } from "react-redux";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminGetCategories,
  adminUpdateCategory
} from "../../../store/slices/adminSlice/AdminCategorySlice";

const CategoryAdmin = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.adminCategory);

  // console.log(categories,"ghhhhhhhhhhhhhhhhhhhhhhhhhdf")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(adminGetCategories());
  }, [dispatch]);

  const handleSave = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("title", data.title);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    if (editData) {
      dispatch(adminUpdateCategory({ id: editData._id, body: formData }));
    } else {
      dispatch(adminCreateCategory(formData));
    }

    setIsModalOpen(false);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(adminDeleteCategory(id));
    // setTimeout(() => dispatch(adminGetCategories()), 300);
  };
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-800">Category Management</h1> */}
          <p className="text-sm text-gray-500 mt-1">Organize and manage product categories</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="text-sm text-gray-600">Total Categories: </span>
            <span className="font-bold text-blue-600">{categories?.length || 0}</span>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition font-medium shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search categories..."
          />
        </div>
      </div>

      {/* Content Area */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
};

export default CategoryAdmin;
