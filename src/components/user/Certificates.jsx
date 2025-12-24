import React from "react";
import { FileCheck } from "lucide-react";

// Import PDFs
import QRO1 from "../../assets/certificate/3050250728102q_aatawala_technologies_private limited _iso_9001_2015.pdf";
import QRO2 from "../../assets/certificate/3050250728103hs_aatawala_technologies_private_limited_iso_45001-2018.pdf";
import QRO3 from "../../assets/certificate/3050250728104f_aatawala_technologies_private_limited_iso_22000-2018.pdf"
import FDA from "../../assets/certificate/FINAL_Aatawala_Technologies_FDA.pdf"
import HALAL from "../../assets/certificate/FINAL _Aatawala_Technologies_HALAL.pdf"
import GMP from "../../assets/certificate/GMP_07BC_25_SOFT_COPY_OF_AATAWALA_TECHNOLOGIES_PVT_LTD.pdf"
import HACCP from "../../assets/certificate/HACCP_07BD_25_SOFT_COPY_OF_AATAWALA_TECHNOLOGIES_PVT_LTD.pdf"




// Import Logos (you’ll need to place PNG/SVG logos inside assets/certLogos folder)
import iso9001Logo from "../../assets/certificate/iso9001Logo.png";
import iso45001Logo from "../../assets/certificate/iso-45001.png";
import iso22000Logo from "../../assets/certificate/iso-22000.png";
import fdaLogo from "../../assets/certificate/FDA.jpg";
import halalLogo from "../../assets/certificate/HALAL.jpg";
import gmpLogo from "../../assets/certificate/GMP.png";
import haccpLogo from "../../assets/certificate/HACCP.png";

// cretificates



const Certificates = () => {


    const certificatesData = [
        {
            title: "ISO 9001:2015",
            description: "Quality Management System Certification.",
            file: QRO1,
            logo: iso9001Logo,
        },
        {
            title: "ISO 45001:2018",
            description: "Occupational Health & Safety Management Certification.",
            file: QRO2,
            logo: iso45001Logo,
        },
        {
            title: "ISO 22000:2018",
            description: "Food Safety Management Systems Certification.",
            file: QRO3,
            logo: iso22000Logo,
        },
        {
            title: "FDA",
            description: "Food and Drug Administration Compliance Certification.",
            file: FDA,
            logo: fdaLogo,
        },
        {
            title: "HALAL",
            description: "Halal Compliance Certification.",
            file: HALAL,
            logo: halalLogo,
        },
        {
            title: "GMP",
            description: "Good Manufacturing Practice Certification.",
            file: GMP,
            logo: gmpLogo,
        },
        {
            title: "HACCP",
            description: "Hazard Analysis & Critical Control Points Certification.",
            file: HACCP,
            logo: haccpLogo,
        },
    ];



    return (
        <section className="max-w-5xl mx-auto py-12 text-center">
            <h2 className="text-3xl font-bold text-[#7a5410] mb-6 flex items-center justify-center gap-2">
                <FileCheck className="text-[#b08943]" size={32} />
                Our Certifications
            </h2>
            <p className="text-gray-700 mb-8">
                Mobile Chakki is ISO certified and complies with all required quality &
                safety standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificatesData.map((cert, index) => (

                    <div
                        key={index}
                        className="bg-white border border-[#e6d9b5] rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
                    >
                        <img
                            src={cert.logo}
                            alt={cert.title}
                            className="w-16 h-16 object-contain mb-4"
                        />

                        <h3 className="text-lg font-semibold text-[#7a5410] mb-2">
                            {cert.title}
                        </h3>
                        <p className="text-sm text-gray-600">{cert.description}</p>

                        {/* Only button inside anchor */}
                        <a
                            href={cert.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 cursor-pointer"
                        >
                            <button className="px-4 py-2 cursor-pointer bg-[#DA352D] text-white rounded-full hover:bg-[#b02a23] transition">
                                View Certificate
                            </button>
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Certificates;
