import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetAllUsers } from "../../../store/slices/adminSlice/AdminUserSlice";
import SidebarTitle from "../../../components/admin/SidebarTitle";
import UserTable from "./UserTable";

export const UsersManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error, count } = useSelector((state) => state.adminUser);

  useEffect(() => {
    dispatch(adminGetAllUsers());
  }, [dispatch]);

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <SidebarTitle />
        <div className="text-sm sm:text-base text-gray-600">
          Total Users: <span className="font-bold text-[#DA352D]">{count}</span>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading users...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && (
        <UserTable users={users} />
      )}
    </div>
  );
};

export default UsersManagement;
