import React from "react";
import { motion } from "framer-motion";

const KpiCard = ({ title, value, icon, color = "bg-blue-500" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition-all"
    >
      {/* Icon Section */}
      <div className={`p-4 rounded-xl text-white ${color}`}>
        {icon}
      </div>

      {/* Text Section */}
      <div className="ml-4">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
};

export default KpiCard;
