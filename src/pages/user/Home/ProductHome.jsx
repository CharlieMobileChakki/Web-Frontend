import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userproduct } from "../../../store/slices/ProductSlice";
import { Link } from "react-router-dom"; // ✅ use Link instead of <a>
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import Product from "../../../components/user/Product";


const ProductHome = () => {
  const dispatch = useDispatch();

  const { data: products = [], loading, error } =
    useSelector((state) => state.products) || {};

  const { reviewsByProduct, loading: reviewsLoading } =
    useSelector((state) => state.reviews) || {};


  useEffect(() => {
    dispatch(userproduct());
  }, [dispatch]);


  useEffect(() => {
    if (products.length > 0) {
      products.forEach((product) => {
        dispatch(userreviewsaccess(product._id));
      });
    }
  }, [dispatch, products]);

  // ✅ Sort featured first, then show first 4
  const sortedProducts = [...products].sort((a, b) => (b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1));
  const visibleProducts = sortedProducts.slice(0, 4);


  const getAverageRating = (productId) => {
    const productReviews = reviewsByProduct[productId] || [];
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / productReviews.length;
    return Number(average.toFixed(1)); // 1 decimal, e.g., 4.4
  };

  const getReviewCount = (productId) => {
    const productReviews = reviewsByProduct[productId] || [];
    return productReviews.length;
  };



  return (
    <div className="relative py-16 px-4 md:px-8 bg-[#F9FAFB] overflow-hidden">
      {/* Background Decorative Elements */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-[80px] opacity-40 mix-blend-multiply filter pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-full blur-[100px] opacity-40 mix-blend-multiply filter pointer-events-none"></div> */}

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our <span className="text-red-600 relative inline-block">
                Products
                {/* <svg className="absolute bottom-1 left-0 w-full h-2 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                   </svg> */}
              </span>
            </h2>
            <p className="text-gray-500 mt-3 text-lg font-medium">
              "Chuno Apni Pasand – Sab Kuch Ek Jagah"
            </p>
          </div>

          {/* ✅ Show 'See More' only if products > 4 */}
          {products.length > 4 && (
            <Link
              to="/allproducts"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group"
            >
              See More <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4  gap-4 md:gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600 font-medium">Error loading products: {error}</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-400 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            visibleProducts.map((item) => {
              const avgRating = getAverageRating(item._id);
              const reviewCount = getReviewCount(item._id);

              // Get pricing from first variant
              const firstVariant = item.variants?.[0];
              const sellingPrice = firstVariant?.sellingPrice || item.sellingPrice || 0;
              const actualPrice = firstVariant?.price || item.price || 0;
              const imgUrl = item.images?.[0] || firstVariant?.images?.[0] || "/placeholder.jpg";

              return (
                <Product
                  key={item._id}
                  id={item._id}
                  imgUrl={imgUrl}
                  description={item.name}
                  quantity={firstVariant?.weight || item.quantity || "1 kg"} // Pass weight/quantity
                  rating={avgRating}
                  reviewCount={reviewCount}
                  sellingPrice={sellingPrice}
                  actualPrice={actualPrice}
                  variantId={firstVariant?._id} // ✅ Pass variantId
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHome;
