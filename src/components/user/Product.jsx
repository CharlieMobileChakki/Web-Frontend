import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useraddtocart, usergetcart } from "../../store/slices/CartSlice";
import { useraddwishlist, usergetwishlist, userremovewishlist } from "../../store/slices/WishlistSlice";
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

  const handleAddToCart = () => {

    if (!checkAuth(navigate)) return;

    if (isAdded) {
      navigate("/viewcart");
      return;
    }


    dispatch(useraddtocart({ productId: id, variantId, quantity: 1 }))
      .unwrap()
      .then((updatedCart) => {
        console.log("✅ Cart updated:", updatedCart);
        toast.success("✅ Product added successfully!");
        setIsAdded(true);
        dispatch(usergetcart()); // 🔄 Synced cart data to populate full product details
      })
      .catch((err) => {
        console.error("Add to cart failed:", err);
        toast.error("❌ Failed to add product to cart");
      });
  };





  // 💖 Wishlist toggle handler with real-time updates
  const handleWishlistToggle = async () => {
    // Optimistic UI update

    if (!checkAuth(navigate)) return;

    setIsWishlisted((prev) => !prev);

    try {
      if (!isWishlisted) {
        // 👉 Add to wishlist
        await dispatch(useraddwishlist({ productId: id })).unwrap();
        toast.success("💖 Added to wishlist");
      } else {
        // 👉 Remove from wishlist
        await dispatch(userremovewishlist({ productId: id })).unwrap();
        toast.info("💔 Removed from wishlist");
      }

      // ✅ Re-fetch wishlist once after success to stay synced
      dispatch(usergetwishlist());
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      // ❌ Rollback UI state on error
      setIsWishlisted((prev) => !prev);
      toast.error("❌ Something went wrong");
    }
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

        const totalAmount = addedItem.product.sellingPrice * addedItem.quantity;

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
        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
          SALE
        </span>
      </div>

      {/* 💖 Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleWishlistToggle();
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95 ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
      >
        <Heart
          size={20}
          fill={isWishlisted ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      {/* 🖼️ Image Section */}
      <div
        className="relative w-full h-56 p-6 bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
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
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-green-700 text-xs font-bold">
            {rating > 0 ? rating.toFixed(1) : "New"} <Star size={10} className="ml-1 fill-green-700" />
          </div>
          <span className="text-xs text-gray-400">({Math.floor(Math.random() * 50) + 10} reviews)</span>
        </div>

        {/* Title */}
        <h3
          className="text-gray-800 font-bold text-lg leading-tight mb-1 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${id}`)}
        >
          {description}
        </h3>

        {/* Weight / Quantity */}
        <p className="text-sm text-gray-500 mb-4">{quantity}</p>

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">₹{sellingPrice}</span>
            {actualPrice > sellingPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">₹{actualPrice}</span>
                <span className="text-xs font-bold text-green-600">
                  {Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isAdded
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-200'} shadow-md active:scale-95`}
            >
              {isAdded ? "View Cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 active:scale-95"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
