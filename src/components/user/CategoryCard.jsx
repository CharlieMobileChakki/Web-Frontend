import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ title, subtitle, icon, id, state }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${id}`, { state: { categoryName: title } });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-blue-100 flex flex-col items-center justify-center text-center h-[220px] w-full"
    >
      {/* Decorative background gradient blob */}
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-orange-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100 transition-transform duration-500 group-hover:scale-110">
        <img
          src={icon}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <h3 className="relative z-10 text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
        {title}
      </h3>
      <p className="relative z-10 mt-1 line-clamp-2 text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
        {subtitle}
      </p>

      {/* Hover overlay hint */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};

export default CategoryCard;
