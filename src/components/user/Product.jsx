import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useraddtocart, usergetcart } from "../../store/slices/CartSlice";
import { useraddwishlist, usergetwishlist, userremovewishlist } from "../../store/slices/WishlistSlice";
import { userproductbyid } from "../../store/slices/ProductSlice"; // Import the fetch action
import { toast } from "react-toastify";
import { checkAuth } from "../../utils/checkAuth";

const Product = ({
  id,
  imgUrl,
  description,
  quantity,
  rating,
  sellingPrice,
  actualPrice,
  variantId, // ✅ Accept variantId prop
  reviewCount = 0, // ✅ Accept reviewCount prop with default value
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const cartItems = cart?.items || [];

  // Track if this product is in cart
  const [isAdded, setIsAdded] = useState(false);
  const { items: wishlist } = useSelector((state) => state.wishlist);

  // const isWishlisted = wishlist?.some((item) => item?.productId?._id === id);
  // 🔄 Ensure cart data is fresh when component mounts
  useEffect(() => {


    dispatch(usergetcart());
    dispatch(usergetwishlist());
  }, [dispatch]);




  // Check if product exists in wishlist
  useEffect(() => {
    const alreadyInWishlist = wishlist?.some(
      (item) => item?.productId?._id === id
    );
    setIsWishlisted(alreadyInWishlist);
  }, [wishlist, id]);


  // 🧠 Check if product exists in cart (re-runs whenever cart updates)
  useEffect(() => {
    const alreadyInCart = cartItems?.some(
      (item) => {
        const productId = item?.product?._id || item?.product; // usage depends on populated vs unpopulated
        return productId === id;
      }
    );
    setIsAdded(alreadyInCart);
  }, [cartItems, id]);

  const handleAddToCart = async () => {
    if (!checkAuth(navigate)) return;

    if (isAdded) {
      navigate("/viewcart");
      return;
    }

    let targetVariantId = variantId;

    // 🛡️ Fail-safe: If variantId is missing, fetch the product to get the default variant
    if (!targetVariantId) {
      try {
        const res = await dispatch(userproductbyid(id)).unwrap();
        // Assuming response structure: { _id, variants: [...] }
        const defaultVariant = res?.variants?.[0]; // Get first variant
        if (defaultVariant?._id) {
          targetVariantId = defaultVariant._id;
          console.log("⚠️ Variant missing provided. Fetched default:", targetVariantId);
        } else {
          console.error("❌ No variants found for product during fetch-check.");
          toast.error("Cannot add to cart: Product has no options.");
          return;
        }
      } catch (err) {
        console.error("❌ Failed to fetch default variant:", err);
        toast.error("Failed to retrieve product options.");
        return;
      }
    }

    dispatch(useraddtocart({ productId: id, variantId: targetVariantId, quantity: 1 }))
      .unwrap()
      .then((updatedCart) => {
        console.log("✅ Cart updated:", updatedCart);
        toast.success("✅ Product added successfully!");
        setIsAdded(true);
        dispatch(usergetcart());
      })
      .catch((err) => {
        console.error("Add to cart failed:", err);
        // If error is "Variant not found" and we just fetched it... tricky.
        toast.error(err || "❌ Failed to add product to cart");
      });
  };

  const handleWishlistToggle = async () => {
    if (!checkAuth(navigate)) return;

    if (isWishlisted) {
      // Remove
      try {
        await dispatch(userremovewishlist({ productId: id })).unwrap();
        toast.info("Removed from wishlist 💔");
        setIsWishlisted(false);
      } catch (err) {
        toast.error("Failed to remove from wishlist");
      }
    } else {
      // Add
      try {
        await dispatch(useraddwishlist({ productId: id })).unwrap();
        toast.success("Added to wishlist ❤️");
        setIsWishlisted(true);
      } catch (err) {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const handleBuyNow = async () => {
    if (!checkAuth(navigate)) return;

    let targetVariantId = variantId;

    // 🛡️ Fail-safe for Buy Now too
    if (!targetVariantId) {
      try {
        const res = await dispatch(userproductbyid(id)).unwrap();
        const defaultVariant = res?.variants?.[0];
        if (defaultVariant?._id) {
          targetVariantId = defaultVariant._id;
        } else {
          toast.error("Cannot proceed: Product has no options.");
          return;
        }
      } catch (err) {
        toast.error("Failed to retrieve product options.");
        return;
      }
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

        console.log("🛒 Buy Now - Item Price:", itemPrice, "Quantity:", addedItem.quantity, "Total:", totalAmount);

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
        // Use the secured targetVariantId
        dispatch(useraddtocart({ productId: id, variantId: targetVariantId, quantity: 1 }))
          .unwrap()
          .then(() => {
            dispatch(usergetcart()).then((res2) => {
              const addedItem = res2.payload?.items?.find(
                (item) => item?.product?._id === id
              );
              if (!addedItem) {
                toast.error("⚠️ Product not found in cart!");
                return;
              }
              proceedToCheckout(addedItem);
            });
          })
          .catch(() => toast.error("❌ Failed to proceed to checkout"));
      }
    });
  };



  return (
    <div className="group relative w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 flex flex-col h-full">

      {/* 🏷️ Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Sale Badge */}
        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm tracking-wide">
          SALE
        </span>
      </div>

      {/* 💖 Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleWishlistToggle();
        }}
        className={`absolute top-2 right-2 md:top-3 md:right-3 z-10 p-1.5 md:p-2 rounded-full backdrop-blur-sm shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95 ${isWishlisted ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-400 hover:text-red-500 bg-white/80'}`}
      >
        <Heart
          size={18}
          className="md:w-5 md:h-5"
          fill={isWishlisted ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      {/* 🖼️ Image Section */}
      <div
        className="relative w-full h-40 md:h-56 p-4 md:p-6 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => navigate(`/products/${id}`)}
      >
        <img
          src={imgUrl}
          alt={description}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient on hover (optional) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* 📝 Content Section */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-100 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded text-green-700 text-[10px] md:text-xs font-bold">
            {rating > 0 ? rating.toFixed(1) : "New"} <Star size={10} className="ml-1 fill-green-700" />
          </div>
          <span className="text-[10px] md:text-xs text-gray-400">
            ({reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews'})
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-gray-800 font-bold text-sm md:text-lg leading-tight mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${id}`)}
        >
          {description}
        </h3>

        {/* Weight / Quantity */}
        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-4">{quantity}</p>

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1 md:gap-2 mb-3 md:mb-4">
            <span className="text-lg md:text-xl font-bold text-gray-900">₹{sellingPrice}</span>
            {actualPrice > sellingPrice && (
              <>
                <span className="text-xs md:text-sm text-gray-400 line-through">₹{actualPrice}</span>
                <span className="text-[10px] md:text-xs font-bold text-green-600">
                  {Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 py-2 cursor-pointer md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 ${isAdded
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                : 'bg-[#DA352D] text-white hover:bg-[#C82333] shadow-[#DA352D]'} shadow-md active:scale-95`}
            >
              <ShoppingCart size={18} className="lg:hidden" />
              <span className="hidden lg:inline">{isAdded ? "View Cart" : "Add to Cart"}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center py-2 md:py-2.5 cursor-pointer rounded-lg md:rounded-xl text-xs md:text-sm font-semibold border border-[#A98C43] text-[#A98C43] hover:bg-[#A98C43] hover:text-white shadow-[#A98C43] transition-all duration-300 active:scale-95"
            >
              <ShoppingBag size={18} className="lg:hidden" strokeWidth={2.5} />
              <span className="hidden lg:inline">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
