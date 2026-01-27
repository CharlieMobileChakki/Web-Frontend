import React, { useEffect, useState } from "react";
import BlogTable from "./BlogTable";
import BlogFormModal from "./BlogFormModal";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllBlogs,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
} from "../../../store/slices/adminSlice/AdminBlogSlice";

const BlogManagement = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.adminBlog);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(adminGetAllBlogs());
  }, [dispatch]);

  const handleSave = (data) => {
    if (editData) {
      dispatch(adminUpdateBlog({ id: editData._id, body: data }));
    } else {
      dispatch(adminCreateBlog(data));
    }

    setIsModalOpen(false);
    setEditData(null);
  };

  const handleEdit = (blog) => {
    setEditData(blog);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(adminDeleteBlog(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {/* <SidebarTitle /> */}

        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all duration-300 font-medium shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Blog
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="mt-2 text-gray-600">Loading blogs...</p>
        </div>
      )}

      {/* Blog Table */}
      {!loading && (
        <BlogTable blogs={blogs} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Blog Form Modal */}
      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        editData={editData}
      />
    </div>
  );
};

export default BlogManagement;
