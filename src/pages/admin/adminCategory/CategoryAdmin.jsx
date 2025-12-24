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
import SidebarTitle from "../../../components/admin/SidebarTitle";

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
    <div className="">

      <div className="flex justify-between items-center mb-4">
        <SidebarTitle />

        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-700 cursor-pointer text-white rounded hover:bg-green-800"
        >
          + Add Category
        </button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
