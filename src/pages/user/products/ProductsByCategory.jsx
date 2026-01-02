import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { userproduct } from "../../../store/slices/ProductSlice"; // 👈 create this thunk 
import Product from "../../../components/user/Product";
import { userreviewsaccess } from "../../../store/slices/ReviewSlice";
import { usercategory } from "../../../store/slices/CategorySlice";
import CategoryCard from "../../../components/user/CategoryCard";
import { BannerSection } from '../../../components/user/BannerSection';
import Bg from "../../../assets/Banner/S1.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



export const ProductsByCategory = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const categoryName = location.state?.categoryName;

    // console.log(categoryName,"kjghdjf")

    const { data: products = [], loading, error } =
        useSelector((state) => state.products) || {};
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { reviewsByProduct, loading: reviewsLoading } =
        useSelector((state) => state.reviews) || {};
    const { data: categories = [], loading: catLoading, error: catError } =
        useSelector((state) => state.categories) || {};

    useEffect(() => {
        if (products.length > 0) {
            products.forEach((product) => {
                dispatch(userreviewsaccess(product._id));
            });
        }
    }, [dispatch, products]);

    useEffect(() => {
        dispatch(userproduct());
        dispatch(usercategory())
    }, [dispatch]);


    useEffect(() => {
        if (id && products.length > 0) {
            const matched = products.filter((product) => product.category === id);
            setFilteredProducts(matched);
        }
    }, [id, products]);







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


    // dynamic slidesToShow based on actual window width — more robust than relying only on slick breakpoints
    const [slidesToShow, setSlidesToShow] = useState(5);
    const sliderRef = useRef(null);


    useEffect(() => {
        const calc = () => {
            const w = window.innerWidth;
            // tweak thresholds to match Tailwind breakpoints
            if (w < 640) setSlidesToShow(1); // mobile
            else if (w < 768) setSlidesToShow(2); // small tablet
            else if (w < 1024) setSlidesToShow(3); // tablet / small laptop
            else if (w < 1280) setSlidesToShow(4); // large laptop
            else setSlidesToShow(5); // desktop
        };
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, []);

    // settings will use the slidesToShow state, and tweak behavior on mobile
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2500,
        speed: 600,
        arrows: false,
        slidesToShow,
        slidesToScroll: 1,
        pauseOnHover: true,
        // allow touch swipe; disable autoplay on very small screens for better UX
        swipe: true,
        responsive: [
            // keep responsive as fallback (Slick still uses breakpoints internally)
            { breakpoint: 1280, settings: { slidesToShow: Math.min(4, slidesToShow) } },
            { breakpoint: 1024, settings: { slidesToShow: Math.min(3, slidesToShow) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(2, slidesToShow) } },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false,
                },
            },
        ],
    };


    // Stop autoplay on small devices (optional but often desired)
    useEffect(() => {
        if (!sliderRef.current) return;
        if (slidesToShow === 1) {
            // when only one slide visible, pause autoplay for UX
            sliderRef.current.slickPause();
        } else {
            sliderRef.current.slickPlay();
        }
    }, [slidesToShow]);

    return (
        <>

            <BannerSection
                title="Products By Category"
                subtitle="Doorstep grinding & organic food delivery for a healthier tomorrow"
                bgImage={Bg}
                className="bg-left-bottom"
            />
            <section className="  bg-gray-50 py-10 px-4">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                        Products in this Category
                    </h1>

                    {loading && <p className="text-center text-gray-500">Loading products...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}


                    <div className="my-4">



                        {!loading && !error && categories?.length > 0 && (
                            <div className="max-w-full mx-auto">
                                <Slider {...settings} ref={sliderRef} className="category-slider">
                                    {categories.map((category, index) => (

                                        <div
                                            key={index}
                                            className={`!flex !justify-center px-2 ${id === category._id ? "scale-105" : ""
                                                }`}
                                        >
                                            <div
                                                className={`w-full max-w-[300px] sm:max-w-[260px] md:max-w-[220px] transition-all duration-300 rounded-xl border-2 ${id === category._id
                                                    ? "border-[#A98C43]  shadow-lg bg-blue-50"
                                                    : "border-transparent bg-white"
                                                    }`}
                                            >
                                                <CategoryCard
                                                    id={category._id}
                                                    title={category.name}
                                                    subtitle={category.title}
                                                    icon={category.image}
                                                    state={{
                                                        categoryName: category.name,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>




                    {!loading && !error && products?.length === 0 && (
                        <p className="text-gray-500 text-center">No products found.</p>
                    )}


                    <div>
                        <h3 className="py-3">{categoryName || "Not name"}</h3>
                        {filteredProducts.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                {filteredProducts.map((product) => {
                                    const avgRating = getAverageRating(product._id);
                                    const reviewCount = getReviewCount(product._id);

                                    // Get pricing from first variant
                                    const firstVariant = product.variants?.[0];
                                    const sellingPrice = firstVariant?.sellingPrice || product.sellingPrice || 0;
                                    const actualPrice = firstVariant?.price || product.price || 0;
                                    const imgUrl = product.images?.[0] || firstVariant?.images?.[0] || "/placeholder.jpg";

                                    return (
                                        <Product
                                            key={product._id}
                                            id={product._id}
                                            imgUrl={imgUrl}
                                            description={product.name}
                                            sellingPrice={sellingPrice}
                                            actualPrice={actualPrice}
                                            rating={avgRating}
                                            variantId={firstVariant?._id}
                                            reviewCount={reviewCount}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </section>


        </>
    );
};
