// Categories.jsx
import React, { useEffect, useState, useRef } from "react";
import CategoryCard from "../../../components/user/CategoryCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from "react-redux";
import { usercategory } from "../../../store/slices/CategorySlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { data: categories, loading, error } = useSelector(
    (state) => state.categories
  );

  // dynamic slidesToShow based on actual window width — more robust than relying only on slick breakpoints
  const [slidesToShow, setSlidesToShow] = useState(5);
  const sliderRef = useRef(null);

  useEffect(() => {
    dispatch(usercategory());
  }, [dispatch]);

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
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-[#F3F4F6] overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-red-200 to-orange-200 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center mb-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shop by <span className="text-[#DA352D]">Categories</span>
        </h2>
        <div className="mt-4 flex justify-center">
          <div className="h-1 w-24 rounded bg-gradient-to-r from-[#DA352D] to-orange-500"></div>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          "Chuno Apni Pasand – Sab Kuch Ek Jagah"
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#DA352D]"></div>
        </div>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && categories?.length > 0 && (
        <div className="relative z-10 mx-auto w-full">
          <Slider {...settings} ref={sliderRef} className="category-slider !pb-10">
            {categories.map((category, index) => (
              <div key={index} className="px-3 py-2">
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
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default Categories;

