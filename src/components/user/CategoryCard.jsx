import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ title, subtitle, icon, id, state, showDescription = false, isActive = false }) => {
  const navigate = useNavigate();

  // Clean up title: remove trailing non-alphanumeric characters (matches unwanted symbols at end)
  const cleanTitle = title?.replace(/[^\w\s\u00C0-\u017F]+$/g, '').trim() || title;

  const handleClick = () => {
    navigate(`/category/${id}`, { state: { categoryName: title } });
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative cursor-pointer overflow-hidden rounded-full bg-white p-6 shadow-md shadow-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col items-center justify-center text-center h-[200px] w-[200px] mx-auto ${isActive
          ? 'border-4 border-[#A98C43] shadow-2xl ring-4 ring-[#A98C43]/30 scale-105'
          : 'border border-transparent hover:border-red-100'
        }`}
    >
      {/* Decorative background gradient blob */}
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-red-50 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />
      <div className={`absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-orange-50 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />

      <div className="relative z-10 mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100 transition-transform duration-500 group-hover:scale-110">
        <img
          src={icon}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className={`relative z-10 text-lg font-bold transition-colors duration-300 ${isActive ? 'text-[#DA352D]' : 'text-gray-800 group-hover:text-[#DA352D]'
        }`}>
        {cleanTitle}
      </h3>

      {showDescription && subtitle && (
        <p className="mt-1 text-xs text-gray-600">
          {subtitle}
        </p>
      )}

      {/* Active/Hover overlay hint */}
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#DA352D] to-orange-500 transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`} />
    </div>
  );
};

export default CategoryCard;
