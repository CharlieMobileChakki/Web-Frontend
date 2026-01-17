import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium mb-4 ${className}`}
        >
            <ChevronLeft size={20} className="mr-1" />
            Back
        </button>
    );
};

export default BackButton;
