


import React, { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import HeaderAdmin from "../components/admin/HeaderAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const user = {
    name: "Rahul Kumar",
    email: "rahul@example.com",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsOpen(!mobile); // auto collapse on mobile
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" min-h-screen  bg-gray-50">

      {/* Sidebar (desktop + mobile) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />

      {/* MAIN SECTION */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 
          ${!isMobile && isOpen ? "ml-64" : "ml-16"} 
        `}
      >
        {/* Header */}
        <HeaderAdmin user={user} isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />

        {/* Main Content */}
        <main className="pt-20 px-5  overflow-x-hidden relative">
          {/* <main className="flex-1 w-full h-[calc(100vh-64px)] pt-24 px-6 overflow-y-auto"> */}

          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;


