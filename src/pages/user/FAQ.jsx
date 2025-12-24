// src/pages/FAQ.jsx
import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What products are available, and which health needs do they address?",
            answer:
                "Atta/flour (wheat-free, multigrain, diabetes, obesity, blood pressure management formulas), spices, grains, and superfoods—the supply chain is certified and keeps everything fresh.",
        },
        {
            question: "Does Mobile Chakki add gluten or sugar to its products?",
            answer:
                "No. All specialty products, such as Multigrain or Sugar Control Atta, are wheat-free, sugar-free, and chemical-free.",
        },
        {
            question: "How is the Mobile Chakki delivery and grinding process safe?",
            answer:
                "Cleaned grains are packed in transparent pouches, shown to the customer before grinding. The entire process takes place live at the doorstep. The packaging is tamper-proof.",
        },
        {
            question: "How can customers get customized flour or blends?",
            answer:
                "The app provides over 25 variants for selection. Users can choose blends suited to their health needs, such as diabetes, weight loss, high-protein, gluten-free, and more.",
        },
        {
            question: "What is the pricing and what payment options are available?",
            answer:
                "Pricing is transparent, and there are no hidden fees. Both digital and cash payment options are available. Extra discounts are provided for bulk and subscription orders.",
        },
        {
            question: "What is the environmental and social impact?",
            answer:
                "Zero-carbon EV vans, minimal sustainable packaging, and direct sourcing from farmers ensure a low carbon footprint. Small farmers directly benefit.",
        },
        {
            question: "What are the delivery timings and coverage area?",
            answer:
                "Delivery timings are listed in the app. Major urban and semi-urban areas are covered, and city-wise coverage is visible within the app.",
        },
        {
            question: "How is after-sales support provided?",
            answer:
                "Direct helpline, WhatsApp, and app chat support are provided for orders, payments, or any other queries.",
        },
        {
            question: "How is food safety and certification ensured?",
            answer:
                "All products are sourced from certified organic suppliers. FSSAI and food safety standards are strictly followed.",
        },
        {
            question: "How can someone become a business or franchise partner of the company?",
            answer:
                "Interested parties can apply through the company app or website to access dashboards and admin panels for partnership management.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#fffdf7] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#7a5410] mb-8 text-center flex justify-center items-center gap-2">
                    <HelpCircle /> Frequently Asked Questions
                </h1>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-[#e6d9b5] rounded-lg p-4 bg-white shadow-md"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="flex justify-between w-full text-left"
                            >
                                <span className="font-semibold text-[#7a5410]">
                                    {faq.question}
                                </span>
                                <span className="text-lg">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>
                            {openIndex === index && (
                                <p className="mt-2 text-gray-700">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
