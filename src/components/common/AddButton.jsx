import React from "react";
import { FaPlus } from "react-icons/fa";

export const AddButton = ({ onClick, title, className = "", type = "submit" }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className={`w-full flex items-center justify-center gap-2 sm:w-auto px-6 py-2 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all shadow-lg shadow-blue-500/20 font-bold ${className}`}
        >
            <FaPlus size={14} />
            {title}
        </button>
    );
};




export const DeleteButton = ({ onClick, title, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-center gap-2 sm:w-auto px-6 py-2 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all shadow-lg shadow-blue-500/20 font-bold ${className}`}
        >
            <FaPlus size={14} />
            {title}
        </button>
    );
};


export const UpdateButton = ({ onClick, title, className = "", type = "submit" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full flex items-center justify-center gap-2 sm:w-auto px-6 py-2 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all shadow-lg shadow-blue-500/20 font-bold ${className}`}
        >
            <FaPlus size={14} />
            {title}
        </button>
    );
};



export const CancelButton = ({ onClick, title = "Cancel", className = "" }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold
      hover:bg-gray-50 transition-all ${className}`}
        >
            {title}
        </button>
    );
};



