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
            console.log("🔄 Auto-selecting first variant:", selectedProduct.variants[0]);
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
