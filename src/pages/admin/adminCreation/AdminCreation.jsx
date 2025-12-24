import React, { useEffect, useState } from "react";
import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetAllAdmins,
  adminCreateAdmin,
  adminUpdateAdmin,
  adminDeleteAdmin,
} from "../../../store/slices/adminSlice/AdminCreationSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";

const AdminCreation = () => {
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector(
    (state) => state.adminCreation
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    dispatch(adminGetAllAdmins());
  }, [dispatch]);

  const handleSave = (data) => {
    if (editData) {
      dispatch(adminUpdateAdmin({ id: editData._id, body: data }));
    } else {
      dispatch(adminCreateAdmin(data));
    }

    setIsModalOpen(false);
    setEditData(null);
  };

  const handleEdit = (admin) => {
    setEditData(admin);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(adminDeleteAdmin(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <SidebarTitle />

        <button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-700 cursor-pointer text-white rounded hover:bg-green-800 transition"
        >
          + Add Admin
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
          <p className="mt-2 text-gray-600">Loading admins...</p>
        </div>
      )}

      {/* Admin Table */}
      {!loading && (
        <AdminTable
          admins={admins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Admin Form Modal */}
      <AdminFormModal
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

export default AdminCreation;
