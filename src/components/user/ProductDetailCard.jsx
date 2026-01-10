import React, { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import ProductRatings from "../../pages/user/products/ProductRatings";
import { useDispatch, useSelector } from "react-redux";
import { useraddtocart, usergetcart } from "../../store/slices/CartSlice";
import { useNavigate } from "react-router-dom";
import { useraddwishlist, usergetwishlist, userremovewishlist } from "../../store/slices/WishlistSlice";
import { toast } from "react-toastify";
import { checkAuth } from "../../utils/checkAuth";

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
}) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [isAdded, setIsAdded] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false); // ✅ State for Read More


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

        dispatch(useraddtocart({ productId: id, variantId, quantity: 1 })) // ✅ call API with variantId
            .unwrap()
            .then((updatedCart) => {
                console.log("✅ ProductDetail - Cart updated:", updatedCart);
                setIsAdded(true);
                toast.success("Successfully added to cart!");
                dispatch(usergetcart()); // 🔄 Synced cart data to populate full product details
            })
            .catch((err) => {
                console.error("Add to cart failed:", err);
                toast.error("Failed to add product to cart");
            });
    };


    const handleBuyNow = () => {
        if (!checkAuth(navigate)) return;

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

                // ✅ Safe price extraction with fallbacks to prevent NaN
                const itemPrice = addedItem.sellingPrice ||
                    addedItem.product?.sellingPrice ||
                    addedItem.price ||
                    0;

                const totalAmount = itemPrice * (addedItem.quantity || 1);

                console.log("🛒 Buy Now - Item Price:", itemPrice, "Quantity:", addedItem.quantity, "Total:", totalAmount);

                navigate("/checkout", {
                    state: {
                        selectedCartItems: [addedItem],
                        userAddress,
                        totalAmount,
                    },
                });
            };

            // ✅ If already in cart → just checkout
            if (existingItem) {
                proceedToCheckout(existingItem);
            } else {
                // ✅ Otherwise, add first then checkout
                dispatch(useraddtocart({ productId: id, variantId, quantity: 1 }))
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


    return (
        <div className="max-w-7xl mx-auto p-2 md:p-8">
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
                                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-2.5 shadow-sm border border-gray-100 hover:scale-110 transition-transform duration-300"
                            >
                                <Heart
                                    size={22}
                                    fill={isWishlisted ? "#ef4444" : "transparent"}
                                    stroke={isWishlisted ? "#ef4444" : "#9ca3af"}
                                    className="transition-colors duration-300"
                                />
                            </button>

                            <img
                                src={mainImage}
                                alt={name}
                                className="w-full h-64 md:h-[450px] object-contain transition-transform duration-700 ease-in-out group-hover:scale-110"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${mainImage === img
                                        ? "border-red-600 ring-2 ring-red-200 scale-105"
                                        : "border-gray-200 hover:border-red-400"
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${name}-${idx}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 md:gap-4 fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:static md:bg-transparent md:shadow-none md:p-0 z-49">
                            <button
                                onClick={isAdded ? () => navigate("/viewcart") : handleAddToCart}
                                className={`flex-1 py-3 px-4 md:py-4 md:px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-lg ${isAdded
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
                                    : "bg-gray-900 hover:bg-black text-white shadow-gray-200"
                                    }`}
                            >
                                {isAdded ? "View Cart" : "Add To Cart"}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-3 px-4 md:py-4 md:px-6 rounded-xl font-bold text-base md:text-lg bg-[#A98C43] hover:bg-[#8c7335] text-white shadow-lg shadow-orange-100 transition-all duration-300 transform active:scale-95 hover:scale-105"
                            >
                                Buy Now
                            </button>
                        </div>
                        {/* Spacer for fixed bottom buttons on mobile */}
                        <div className="h-16 md:hidden"></div>
                    </div>

                    {/* RIGHT SIDE: PRODUCT INFO */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* Product Title */}
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 md:mb-4">
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
                        {variants?.length > 1 && (
                            <div className="mb-4">
                                <h3 className="font-bold text-gray-900 mb-3 text-base">Select Pack Size:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {variants.map((variant, index) => {
                                        const isSelected = selectedVariant?._id === variant._id || (!selectedVariant && index === 0);
                                        return (
                                            <button
                                                key={variant._id || index}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`relative px-4 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center min-w-[100px] ${isSelected
                                                    ? "border-[#A98C43] bg-orange-50/50 text-gray-900 ring-1 ring-[#A98C43]"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span className="text-sm font-semibold">
                                                    {variant.nameSuffix || `${variant.quantity}g`}
                                                </span>
                                                <span className={`text-xs mt-1 font-medium ${isSelected ? "text-[#A98C43]" : "text-gray-500"}`}>
                                                    ₹{variant.sellingPrice}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-gray-200 p-6 md:p-10">
                    <ProductRatings reviews={reviews} productId={id} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailCard;
