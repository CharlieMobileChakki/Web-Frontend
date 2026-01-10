import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailCard from "../../../components/user/ProductDetailCard";
import { userproductbyid } from "../../../store/slices/ProductSlice";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import MilletManImg from "../../../assets/blog/10.jpeg";

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedVariant, setSelectedVariant] = useState(null);

    const { selectedProduct, loading, error } = useSelector(
        (state) => state.products
    );

    const { reviewsByProduct } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (id) {
            dispatch(userproductbyid(id));
            dispatch(userreviewsaccess(id));
        }
    }, [dispatch, id]);

    // Set first variant as default when product loads
    useEffect(() => {
        if (selectedProduct?.variants?.length > 0 && !selectedVariant) {
            setSelectedVariant(selectedProduct.variants[0]);
        }
    }, [selectedProduct, selectedVariant]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;
    if (!selectedProduct) return <p className="p-4">No product found</p>;

    const product = selectedProduct;
    const productReviews = reviewsByProduct[id] || [];

    // Use selected variant data or fallback to first variant
    const activeVariant = selectedVariant || product.variants?.[0];
    const variantImages = product.images?.length > 0 ? product.images : (activeVariant?.images || []);
    const sellingPrice = activeVariant?.sellingPrice || 0;
    const actualPrice = activeVariant?.price || 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4">
                {/* Millet Man Section - Moved to Top */}
                <div className="mb-8 bg-white rounded-3xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2">
                            <img
                                src={MilletManImg}
                                alt="Millet Man - Dr. Khader Vali"
                                className="w-full h-64 md:h-full object-cover"
                            />
                        </div>
                        <div className="w-full md:w-1/2 p-6 md:p-10">
                            <p className="text-sm text-gray-500 mb-2 font-medium">August 25, 2025 • Mobile Chakki Team</p>
                            <h3 className="text-2xl font-bold text-[#A98C43] mb-4">
                                Millets by : Khader Vali
                            </h3>
                            <div className="w-16 h-1 bg-red-600 rounded-full mb-4"></div>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Known as the Millet Man of India, Dr. Khader Vali highlighted the health benefits of organic millets.
                                His insights encouraged families to embrace nutrition and wellness in daily life.
                            </p>
                            <button
                                onClick={() => navigate("/blog")}
                                className="text-red-600 font-bold hover:text-red-700 transition-colors flex items-center gap-2 group cursor-pointer"
                            >
                                Read More
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                <ProductDetailCard
                    id={selectedProduct?._id}
                    images={variantImages}
                    name={`${selectedProduct?.name}${activeVariant?.nameSuffix ? ` - ${activeVariant.nameSuffix}` : ''}`}
                    description={activeVariant?.description || selectedProduct?.description || ''}
                    sellingPrice={sellingPrice}
                    actualPrice={actualPrice}
                    reviews={productReviews}
                    variantId={activeVariant?._id} // Pass variant ID for cart operations
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    setSelectedVariant={setSelectedVariant}
                />
            </div>
        </div>
    );
};

export default ProductDetails;
