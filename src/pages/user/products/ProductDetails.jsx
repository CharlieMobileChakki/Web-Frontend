import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductDetailCard from "../../../components/user/ProductDetailCard";
import { userproductbyid } from "../../../store/slices/ProductSlice";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
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
                {/* Variant Selector */}
                {product.variants?.length > 1 && (
                    <div className="mb-6 bg-white rounded-2xl shadow-lg p-6 max-w-7xl mx-auto">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Select Variant:</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((variant, index) => (
                                <button
                                    key={variant._id || index}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedVariant?._id === variant._id ||
                                        (!selectedVariant && index === 0)
                                        ? "border-red-600 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg"
                                        : "border-gray-200 bg-white hover:border-red-400 hover:shadow-md"
                                        }`}
                                >
                                    <div className="text-base font-bold text-gray-900">
                                        {variant.nameSuffix || `${variant.quantity}g`}
                                    </div>
                                    <div className="text-lg font-bold text-red-600 mt-1">
                                        ₹{variant.sellingPrice}
                                    </div>
                                    {variant.stock > 0 ? (
                                        <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            In Stock
                                        </div>
                                    ) : (
                                        <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                            Out of Stock
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <ProductDetailCard
                    id={selectedProduct?._id}
                    images={variantImages}
                    name={`${selectedProduct?.name}${activeVariant?.nameSuffix ? ` - ${activeVariant.nameSuffix}` : ''}`}
                    description={activeVariant?.description || selectedProduct?.description || ''}
                    sellingPrice={sellingPrice}
                    actualPrice={actualPrice}
                    reviews={productReviews}
                    variantId={activeVariant?._id} // Pass variant ID for cart operations
                />
            </div>
        </div>
    );
};

export default ProductDetails;
