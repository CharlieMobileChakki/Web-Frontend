import React from "react";
import { useLocation } from "react-router-dom";

const SidebarTitle = () => {
    const location = useLocation();

    // Sidebar menu list (single source of truth)
    const menuItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Admin Creation", href: "/admincreation" },
        { name: "Category Management", href: "/categorymanagement" },
        { name: "Orders Management", href: "/ordersmanagement" },
        { name: "Products Management", href: "/productmanagement" },
        { name: "Users Management", href: "/usersmanagement" },
        { name: "Blog Management", href: "/blogmanagement" },
        { name: "Banner Management", href: "/bannermanagement" }, // lowercase fix
        { name: "Stock Management", href: "/stockmanagement" },
        { name: "Booking Management", href: "/bookingmanagement" },
        { name: "Driver Management", href: "/drivermanagement" },
        { name: "Contact Management", href: "/contactmanagement" },
    ];

    const pathname = location.pathname.toLowerCase();

    // Match exact or sub-routes (like /productmanagement/edit/123)
    const activeItem = menuItems.find((item) =>
        pathname.startsWith(item.href)
    );

    const title = activeItem?.name || "Admin Panel";

    return (
        <>
            {/* Desktop */}
            <h1 className="hidden lg:block font-bold text-xl text-gray-800 flex-1">
                {title}
            </h1>

            {/* Mobile */}
            <h1 className="lg:hidden font-semibold text-lg flex-1 text-gray-800">
                {title}
            </h1>
        </>
    );
};

export default SidebarTitle;
