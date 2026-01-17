import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductDetailCard from "../../../components/user/ProductDetailCard";
import { userproductbyid, userproduct } from "../../../store/slices/ProductSlice";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import BackButton from "../../../components/common/BackButton"; // Import BackButton

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const hasInitialized = useRef(false);

    const { selectedProduct, data: allProducts, loading, error } = useSelector(
        (state) => state.products
    );

    const { reviewsByProduct } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (id) {
            dispatch(userproductbyid(id));
            dispatch(userreviewsaccess(id));
            dispatch(userproduct()); // Fetch all products for related items
        }
    }, [dispatch, id]);

    // Reset variant selection when product ID changes
    useEffect(() => {
        hasInitialized.current = false;
        setSelectedVariant(null);
    }, [id]);

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

    // Filter related products (same category, exclude current)
    const relatedProducts = allProducts?.filter(
        (p) => p.category === product.category && p._id !== product._id
    ) || [];

    // Handler to update selected variant
    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="container mx-auto px-4">
                <BackButton />

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
                    setSelectedVariant={handleVariantChange}
                    relatedProducts={relatedProducts}
                />
            </div>
        </div>
    );
};

export default ProductDetails;
