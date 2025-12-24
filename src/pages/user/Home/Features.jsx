// Features.jsx
import React from "react";
import { Truck, CreditCard, ShieldCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Fast Delivery",
    desc: "Tez aur Surakshit Delivery aapke ghar tak.",
  },
  {
    icon: <CreditCard className="w-10 h-10" />,
    title: "Online Payment",
    desc: "Secure aur Easy UPI, Card & Netbanking options.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Bina Milawat",
    desc: "100% Shudh aur Fresh Quality Products.",
  },
  {
    icon: <Headphones className="w-10 h-10" />,
    title: "Customer Support",
    desc: "24x7 Madad ke liye hum hamesha uplabdh hain.",
  },
];

const Features = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-[#A98C43] via-[#A98C43] to-[#C6363E]">
      <div className="grid container px-4 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-6 border border-gray-50 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="mb-4 text-gray-100">{f.icon}</div>
            <h3 className="text-lg font-bold text-gray-100">{f.title}</h3>
            <p className="text-sm text-gray-200 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
