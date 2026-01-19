
// src/pages/TermsAndConditions.jsx
import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="bg-[#fffdf7] py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#7a5410] mb-6">Terms & Conditions</h1>
                <p className="mb-4 text-gray-700">
                    Welcome to <strong>Mobile Chakki</strong>. By accessing or using our services,
                    you agree to the following terms and conditions. Please read them carefully
                    before placing an order or using our platform.
                </p>

                {/* Services */}
                <h2 className="text-[#7a5410] mt-6 mb-2">1. Services</h2>
                <p className="mb-4 text-gray-700">
                    Mobile Chakki provides doorstep grinding, freshly prepared atta, grains, and
                    spices. We ensure all products are processed with certified safety and hygiene
                    standards. However, product availability may vary based on region and season.
                </p>

                {/* Eligibility */}
                <h2 className="text-[#7a5410] mt-6 mb-2">2. Eligibility</h2>
                <p className="mb-4 text-gray-700">
                    To use our services, you must be at least 18 years old and capable of entering
                    into a legally binding agreement. By using our platform, you represent that you
                    meet these requirements.
                </p>

                {/* Payments */}
                <h2 className="text-[#7a5410] mt-6 mb-2">3. Payments</h2>
                <p className="mb-4 text-gray-700">
                    Payments can be made via UPI, debit/credit cards, net banking, or cash on
                    delivery (where available). Any payment failure due to incorrect details or
                    insufficient funds is the responsibility of the user.
                </p>

                {/* Returns & Refunds */}
                <h2 className="text-[#7a5410] mt-6 mb-2">4. Returns & Refunds</h2>
                <p className="mb-4 text-gray-700">
                    Since our products are freshly ground and perishable, <strong>returns are not
                        accepted</strong>. Refunds are only applicable in cases of:
                </p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Wrong item delivered</li>
                    <li>Damaged product on arrival</li>
                    <li>Order not delivered due to our service issue</li>
                </ul>
                <p className="mb-4 text-gray-700">
                    All refund requests must be raised within 24 hours of delivery, along with
                    supporting evidence (photos/videos).
                </p>

                {/* Delivery */}
                <h2 className="text-[#7a5410] mt-6 mb-2">5. Delivery</h2>
                <p className="mb-4 text-gray-700">
                    We aim to deliver products within the estimated time frame. However, delivery
                    times may vary due to traffic, weather, or other unforeseen circumstances.
                    Mobile Chakki is not responsible for delays caused by factors beyond our
                    control.
                </p>

                {/* User Responsibilities */}
                <h2 className="text-[#7a5410] mt-6 mb-2">6. User Responsibilities</h2>
                <p className="mb-4 text-gray-700">
                    Users must provide accurate delivery details, ensure someone is available to
                    receive the order, and store products appropriately after delivery. Mobile
                    Chakki will not be liable for spoilage caused by mishandling after delivery.
                </p>

                {/* Prohibited Uses */}
                <h2 className="text-[#7a5410] mt-6 mb-2">7. Prohibited Uses</h2>
                <p className="mb-4 text-gray-700">
                    Users agree not to misuse our platform. Prohibited activities include, but are
                    not limited to:
                </p>
                <ul className="list-disc ml-6 mb-4 text-gray-700">
                    <li>Providing false information</li>
                    <li>Attempting to hack, damage, or disrupt services</li>
                    <li>Reselling products without authorization</li>
                </ul>

                {/* Intellectual Property */}
                <h2 className="text-[#7a5410] mt-6 mb-2">8. Intellectual Property</h2>
                <p className="mb-4 text-gray-700">
                    All content on this platform, including logos, text, images, and product
                    information, is the property of Mobile Chakki. Unauthorized use or duplication
                    of this content is strictly prohibited.
                </p>

                {/* Limitation of Liability */}
                <h2 className="text-[#7a5410] mt-6 mb-2">9. Limitation of Liability</h2>
                <p className="mb-4 text-gray-700">
                    Mobile Chakki shall not be held liable for indirect, incidental, or
                    consequential damages arising from the use of our services. Our liability in any
                    case will not exceed the total amount paid for the order.
                </p>

                {/* Changes to Terms */}
                <h2 className="text-[#7a5410] mt-6 mb-2">10. Changes to Terms</h2>
                <p className="mb-4 text-gray-700">
                    Mobile Chakki reserves the right to update or modify these terms at any time.
                    Continued use of the platform after changes indicates acceptance of the revised
                    terms.
                </p>

                {/* Contact */}
                <h2 className="text-[#7a5410] mt-6 mb-2">11. Contact</h2>
                <p className="text-gray-700">
                    For support, please reach out through our in-app helpline or email us at{" "}
                    <span className="text-[#7a5410] font-medium">support@mobilechakki.com</span>.
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;
