import React, { useState, useEffect } from "react";
import { Heart, Star, ShoppingCart, ShoppingBag } from "lucide-react";
import ProductRatings from "../../pages/user/products/ProductRatings";
import { useDispatch, useSelector } from "react-redux";
import { useraddtocart, usergetcart } from "../../store/slices/CartSlice";
import { useNavigate } from "react-router-dom";
import Product from "./Product"; // Import Product component
import { useraddwishlist, usergetwishlist, userremovewishlist } from "../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import { checkAuth } from "../../utils/checkAuth";
import MilletManImg from "../../assets/blog/10.jpeg";

const ProductDetailCard = ({
    id,
    images = ["https://via.placeholder.com/400"],
    name = "Sample Product",
    description = "This is a sample product description.",
    sellingPrice = 999,
    actualPrice = 1299,
    reviews = [],
    variantId, // ✅ Accept variantId prop
    variants = [],
    selectedVariant,
    setSelectedVariant,
    relatedProducts = [], // Receive related products
}) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false); // ✅ State for Read More
    const [showZoom, setShowZoom] = useState(false); // Zoom visibility
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 }); // Cursor position percentage


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { cart } = useSelector((state) => state.cart);
    const { items: wishlist } = useSelector((state) => state.wishlist);
    const cartItems = cart?.items || [];



    // 🟢 Check if product is already in cart
    useEffect(() => {
        const alreadyInCart = cartItems?.some((item) => {
            const productId = item.product?._id || item.product;
            return productId === id;
        });
        setIsAdded(alreadyInCart);
    }, [cartItems, id]);



    // 🟢 Load cart + wishlist on mount
    useEffect(() => {
        dispatch(usergetcart());
        dispatch(usergetwishlist());
    }, [dispatch]);


    // 💖 Check if product already in wishlist
    useEffect(() => {
        const alreadyInWishlist = wishlist?.some(
            (item) => item?.productId?._id === id
        );
        setIsWishlisted(alreadyInWishlist);
    }, [wishlist, id]);


    // ⭐ Average rating
    const avgRating =
        reviews.length > 0
            ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
            : 0;




    const handleAddToCart = () => {
        if (!checkAuth(navigate)) return;

        // 🔍 Priority: 1. Locally selected variant (UI state) -> 2. Passed variantId -> 3. First available variant
        let targetVariantId = selectedVariant?._id || variantId;

        // 🛡️ Auto-select first variant if none selected - REMOVED TO FORCE MANUAL SELECTION
        // if (!targetVariantId && variants?.length > 0) {
        //     console.log("⚠️ No variant selected. Defaulting to first variant:", variants[0]);
        //     targetVariantId = variants[0]._id;
        //     if (setSelectedVariant) setSelectedVariant(variants[0]); // Update UI
        // }

        if (!targetVariantId) {
            toast.error("Please select a pack size");
            return;
        }

        dispatch(useraddtocart({ productId: id, variantId: targetVariantId, quantity: 1 }))
            .unwrap()
            .then((updatedCart) => {
                console.log("✅ ProductDetail - Cart updated:", updatedCart);
                setIsAdded(true);
                toast.success("Successfully added to cart!");
                dispatch(usergetcart());
            })
            .catch((err) => {
                console.error("Add to cart failed:", err);
                toast.error("Failed to add product to cart");
            });
    };


    const handleBuyNow = () => {
        if (!checkAuth(navigate)) return;

        // 🔍 Priority: 1. Locally selected variant (UI state) -> 2. Passed variantId -> 3. First available variant
        let targetVariantId = selectedVariant?._id || variantId;

        // 🛡️ Auto-select first variant if none selected - REMOVED
        // if (!targetVariantId && variants?.length > 0) {
        //     console.log("⚠️ No variant selected (BuyNow). Defaulting to first variant:", variants[0]);
        //     targetVariantId = variants[0]._id;
        //     if (setSelectedVariant) setSelectedVariant(variants[0]);
        // }

        if (!targetVariantId) {
            toast.error("Please select a pack size");
            return;
        }

        dispatch(usergetcart()).then((res) => {
            const existingItem = res.payload?.items?.find(
                (item) => item?.product?._id === id
            );

            const proceedToCheckout = (addedItem) => {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const defaultAddress = storedUser?.addresses?.find((a) => a.isDefault);

                const userAddress = {
                    ...defaultAddress,
                    name: storedUser?.name,
                };

                const itemPrice = addedItem.sellingPrice ||
                    addedItem.product?.sellingPrice ||
                    addedItem.price ||
                    0;

                const totalAmount = itemPrice * (addedItem.quantity || 1);

                navigate("/checkout", {
                    state: {
                        selectedCartItems: [addedItem],
                        userAddress,
                        totalAmount,
                    },
                });
            };

            if (existingItem) {
                proceedToCheckout(existingItem);
            } else {
                dispatch(useraddtocart({ productId: id, variantId: targetVariantId, quantity: 1 }))
                    .unwrap()
                    .then(() => {
                        dispatch(usergetcart()).then((res2) => {
                            const addedItem = res2.payload?.items?.find(
                                (item) => item?.product?._id === id
                            );
                            if (!addedItem) {
                                alert("Product not found in cart!");
                                return;
                            }
                            proceedToCheckout(addedItem);
                        });
                    })
                    .catch((err) => {
                        console.error("Buy Now failed:", err);
                        alert("Failed to proceed to checkout");
                    });
            }
        });
    };


    // 💖 Wishlist toggle handler with real-time updates
    const handleWishlistToggle = async () => {
        if (!checkAuth(navigate)) return;

        const currentlyWishlisted = isWishlisted; // Capture current state
        setIsWishlisted((prev) => !prev); // Optimistic update

        try {
            if (!currentlyWishlisted) {
                await dispatch(useraddwishlist({ productId: id })).unwrap();
                toast.success("💖 Added to wishlist");
            } else {
                await dispatch(userremovewishlist({ productId: id })).unwrap();
                toast.info("💔 Removed from wishlist");
            }

            // ✅ Re-fetch wishlist to stay synced
            dispatch(usergetwishlist());
        } catch (err) {
            console.error("Wishlist toggle failed:", err);
            setIsWishlisted(currentlyWishlisted); // rollback
            toast.error("❌ Something went wrong");
        }
    };

    // 🔍 Handle Mouse Move for Zoom
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };


    return (
        <div className="  mx-auto  ">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-10">

                    {/* LEFT SIDE: IMAGE GALLERY */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* Main Image */}
                        <div className="relative bg-white border border-gray-100 rounded-3xl overflow-hidden p-6 md:p-10 group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleWishlistToggle();
                                }}
                                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur rounded-full p-2.5 shadow-sm border border-gray-100 hover:scale-110 transition-transform duration-300"
                            >
                                <Heart
                                    size={22}
                                    fill={isWishlisted ? "#ef4444" : "transparent"}
                                    stroke={isWishlisted ? "#ef4444" : "#9ca3af"}
                                    className="transition-colors duration-300"
                                />
                            </button>

                            {/* Previous Image Button (Main) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = images.indexOf(mainImage);
                                    const prevIndex = (currentIndex - 1 + images.length) % images.length;
                                    setMainImage(images[prevIndex]);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="m15 18-6-6 6-6" /></svg>
                            </button>

                            {/* Next Image Button (Main) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = images.indexOf(mainImage);
                                    const nextIndex = (currentIndex + 1) % images.length;
                                    setMainImage(images[nextIndex]);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="m9 18 6-6-6-6" /></svg>
                            </button>

                            <img
                                src={mainImage}
                                alt={name}
                                className="w-full h-64 md:h-[450px] object-contain transition-transform duration-700 ease-in-out hover:scale-105"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setShowZoom(true)}
                                onMouseLeave={() => setShowZoom(false)}
                            />
                            {/* Zoom Lens */}
                            {showZoom && (
                                <div
                                    className="absolute border border-blue-500/30 bg-blue-500/10 hidden md:block pointer-events-none backdrop-blur-[1px]"
                                    style={{
                                        left: `${zoomPosition.x}%`,
                                        top: `${zoomPosition.y}%`,
                                        width: "100px",
                                        height: "100px",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                />
                            )}

                            {/* Zoom Result Pane */}
                            {showZoom && (
                                <div
                                    className="absolute hidden md:block z-[60] overflow-hidden shadow-2xl border border-gray-200 bg-white"
                                    style={{
                                        position: "absolute",
                                        top: "-10%",
                                        left: "102%",
                                        width: "120%",
                                        height: "120%",
                                        minWidth: "500px",
                                        minHeight: "500px",
                                        backgroundImage: `url(${mainImage})`,
                                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        backgroundSize: "250%",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                />
                            )}
                        </div>

                        {/* Thumbnail Gallery Slider */}
                        <div className="relative group/thumbs">
                            {/* Scroll Left Button */}
                            <button
                                onClick={() => {
                                    document.getElementById('thumb-scroll').scrollBy({ left: -100, behavior: 'smooth' });
                                }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1.5 rounded-full shadow-md border border-gray-200 opacity-0 group-hover/thumbs:opacity-100 transition-opacity duration-300 hidden md:block"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>

                            {/* Thumbnails Container */}
                            <div
                                id="thumb-scroll"
                                className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-1"
                            >
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(img)}
                                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img
                                            ? "border-red-600 ring-2 ring-red-100 scale-105 opacity-100"
                                            : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${name} - ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Scroll Right Button */}
                            <button
                                onClick={() => {
                                    document.getElementById('thumb-scroll').scrollBy({ left: 100, behavior: 'smooth' });
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1.5 rounded-full shadow-md border border-gray-200 opacity-0 group-hover/thumbs:opacity-100 transition-opacity duration-300 hidden md:block"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>


                        {/* Spacer for fixed bottom buttons on mobile */}
                        <div className="h-16 md:hidden"></div>
                    </div>

                    {/* RIGHT SIDE: PRODUCT INFO */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* Product Title */}
                        <div>
                            <h1 className="text-2xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-2 md:mb-4">
                                {name}
                            </h1>

                            {/* Rating Badge */}
                            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                <div className="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg font-semibold text-sm md:text-base">
                                    <Star size={14} fill="white" className="md:w-4 md:h-4" />
                                    <span>{avgRating.toFixed(1)}</span>
                                </div>
                                <span className="text-sm md:text-base text-gray-600">
                                    {reviews.length} Ratings & {reviews.length} Reviews
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-2 md:gap-4 flex-wrap">
                            <span className="text-3xl md:text-4xl font-bold text-red-600">₹{sellingPrice}</span>
                            {actualPrice && (
                                <>
                                    <span className="text-xl md:text-2xl text-gray-400 line-through">₹{actualPrice}</span>
                                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-100 text-green-700 rounded-lg font-bold text-sm md:text-base">
                                        {Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="py-2">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">Description</h3>
                            <div className="text-gray-600 leading-relaxed text-base">
                                {description?.length > 250 ? (
                                    <>
                                        {showFullDesc ? description : `${description.slice(0, 250)}...`}
                                        <button
                                            onClick={() => setShowFullDesc(!showFullDesc)}
                                            className="ml-2 text-red-600 font-semibold hover:underline text-sm focus:outline-none"
                                        >
                                            {showFullDesc ? "Read Less" : "Read More"}
                                        </button>
                                    </>
                                ) : (
                                    description
                                )}
                            </div>
                        </div>

                        {/* Variant Selector */}
                        {variants?.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-900 mb-3 text-base">Select Pack Size:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {variants.map((variant, index) => {
                                        const isSelected = selectedVariant?._id === variant._id || (!selectedVariant && index === 0);
                                        return (
                                            <button
                                                key={variant._id || index}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`relative px-5 py-3 rounded-2xl border transition-all duration-300 flex flex-col items-center min-w-[0px] shadow-sm transform hover:-translate-y-1 ${isSelected
                                                    ? "border-[#A98C43] bg-orange-50/80 text-gray-900 ring-2 ring-[#A98C43] shadow-orange-100"
                                                    : "border-gray-100 bg-white text-gray-500 hover:border-[#A98C43]/50 hover:bg-orange-50/30 hover:shadow-md"
                                                    } `}
                                            >
                                                {isSelected && (
                                                    <div className="absolute -top-3 -right-2 bg-[#A98C43] text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-bold tracking-wide">
                                                        SELECTED
                                                    </div>
                                                )}
                                                <span className="text-base font-bold tracking-tight">
                                                    {variant.nameSuffix || `${variant.quantity}g`}
                                                </span>
                                                <span className={`text-sm mt-1 font-semibold ${isSelected ? "text-[#A98C43]" : "text-gray-400"} `}>
                                                    ₹{variant.sellingPrice}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 md:gap-4 fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 z-49">
                            <button
                                onClick={isAdded ? () => navigate("/viewcart") : handleAddToCart}
                                className={`flex-1 py-3 px-3 md:py-3.5 md:px-4 rounded-2xl font-bold cursor-pointer text-[10px] sm:text-xs md:text-base uppercase tracking-wide transition-all duration-300 transform active:scale-95 hover:shadow-xl flex items-center justify-center gap-1.5 md:gap-2 ${isAdded
                                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:to-green-600 text-white shadow-green-200"
                                    : "bg-gradient-to-r from-[#DA352D] to-[#FF4D4D] hover:to-[#DA352D] text-white shadow-red-200"
                                    } `}
                            >
                                {isAdded ? (
                                    <>
                                        <ShoppingCart size={16} className="md:w-5 md:h-5" strokeWidth={2.5} />
                                        <span>View Cart</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} className="md:w-5 md:h-5" strokeWidth={2.5} />
                                        <span>Add To Cart</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-3 px-3 md:py-3.5 md:px-4 cursor-pointer rounded-2xl font-bold text-[10px] sm:text-xs md:text-base uppercase tracking-wide bg-gradient-to-r from-[#A98C43] to-[#Ceb063] hover:to-[#A98C43] text-white shadow-lg shadow-orange-100 transition-all duration-300 transform active:scale-95 hover:shadow-xl flex items-center justify-center gap-1.5 md:gap-2"
                            >
                                <ShoppingBag size={16} className="md:w-5 md:h-5" strokeWidth={2.5} />
                                <span>Buy Now</span>
                            </button>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-2">
                            {[
                                { icon: "✓", title: "Quality", subtitle: "Certified" },
                                { icon: "🚚", title: "Fast", subtitle: "Delivery" },
                                { icon: "💳", title: "Secure", subtitle: "Payment" },
                                { icon: "⭐", title: "Top", subtitle: "Rated" },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-xl text-center shadow-sm">
                                    <div className="text-xl mb-1">{feature.icon}</div>
                                    <p className="font-semibold text-gray-900 text-xs">{feature.title}</p>
                                    <p className="text-[10px] text-gray-500">{feature.subtitle}</p>
                                </div>
                            ))}
                        </div>





                        {/* Compact Millet Man Section */}
                        <div className="mt-6 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex gap-4 items-center">
                            <img
                                src={MilletManImg}
                                alt="Dr. Khader Vali"
                                className="w-20 h-20 rounded-xl object-cover shrink-0"
                            />
                            <div>
                                <h3 className="text-sm font-bold text-[#A98C43] mb-1">
                                    Millets by Dr. Khader Vali
                                </h3>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                    Known as the Millet Man of India, highlighting the health benefits of organic millets.
                                </p>
                                <button
                                    onClick={() => navigate("/blog")}
                                    className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                    Read More →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-200 p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((product) => {
                                // Basic data extraction for display
                                const firstVariant = product.variants?.[0];
                                const sellingPrice = firstVariant?.sellingPrice || product.sellingPrice || 0;
                                const actualPrice = firstVariant?.price || product.price || 0;
                                const imgUrl = product.images?.[0] || firstVariant?.images?.[0] || "https://via.placeholder.com/200";

                                return (
                                    <Product
                                        key={product._id}
                                        id={product._id}
                                        imgUrl={imgUrl}
                                        description={product.name}
                                        sellingPrice={sellingPrice}
                                        actualPrice={actualPrice}
                                        rating={0} // You might want to fetch ratings if available
                                        variantId={firstVariant?._id}
                                        reviewCount={0}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="border-t border-gray-200 p-6 md:p-10">
                    <ProductRatings reviews={reviews} productId={id} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailCard;
