import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userproduct } from "../../../store/slices/ProductSlice";
import Product from "../../../components/user/Product";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import { BannerSection } from "../../../components/user/BannerSection";
// import Bg from "../../assets/Banner/S1.png";
import Bg from "../../../assets/banner/S1.png";

const AllProducts = () => {
    const dispatch = useDispatch();
    const { data: products, loading, error } = useSelector((state) => state.products);
    const { reviewsByProduct } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(userproduct());
    }, [dispatch]);


    useEffect(() => {
        if (products?.length > 0) {
            products.forEach((product) => {
                dispatch(userreviewsaccess(product._id));
            });
        }
    }, [dispatch, products]);


    const getAverageRating = (productId) => {
        const productReviews = reviewsByProduct[productId] || [];
        if (productReviews.length === 0) return 0;

        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / productReviews.length;
        return Number(average.toFixed(1)); // 1 decimal, e.g., 4.4
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <BannerSection
                title="All Product's"
                subtitle="Doorstep grinding & organic food delivery for a healthier tomorrow"
                bgImage={Bg}
                className="bg-left-bottom"
            />


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-6">
                {products?.length > 0 ? (
                    products.map((item) => {
                        const avgRating = getAverageRating(item._id);

                        // Get pricing from first variant or show range
                        const firstVariant = item.variants?.[0];
                        const sellingPrice = firstVariant?.sellingPrice || 0;
                        const actualPrice = firstVariant?.price || 0;
                        const imgUrl = item.images?.[0] || firstVariant?.images?.[0] || "https://via.placeholder.com/150";

                        return (
                            <Product
                                key={item._id}
                                id={item._id}
                                imgUrl={imgUrl}
                                name={item.name}
                                description={item.name}
                                sellingPrice={sellingPrice}
                                actualPrice={actualPrice}
                                rating={avgRating}
                            />
                        );
                    })
                ) : (
                    !loading && <p>No products found</p>
                )}
            </div>
        </>
    );
};

export default AllProducts;
