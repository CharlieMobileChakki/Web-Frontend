import React from "react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove, onSelect, selected }) => {
    // Cart API returns data directly on item, with product details nested
    const quantity = item.quantity;

    return (
        <div className="flex gap-4 p-4  border-x-sky-100 items-start">
            {/* ✅ Checkbox */}
            <input
                type="checkbox"
                checked={selected}
                onChange={() => onSelect(item._id)}
                className="mt-2 accent-[oklch(0.49_0.1_53.12)] cursor-pointer"
            />

            {/* 🖼️ Product Image */}
            {/* <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 object-contain"
            /> */}

            <img
                src={item?.image || item?.product?.images?.[0] || "/placeholder.png"}
                alt={item?.name || item?.product?.name || "Product"}
                className="w-24 h-24 object-contain"
            />

            {/* 📦 Product Details */}
            <div className="flex-1">
                <h3 className="font-medium text-sm">{item?.name || item?.product?.name || "Unnamed Product"}</h3>
                {item?.nameSuffix && (
                    <p className="text-xs text-gray-500">{item.nameSuffix}</p>
                )}

                {/* 💰 Price Section */}
                <div className="mt-1 text-sm">
                    <span className="text-black font-semibold">
                        ₹{item?.sellingPrice || item?.product?.sellingPrice || 0}
                    </span>{" "}
                    <span className="line-through text-gray-400">₹{item?.price || item?.product?.price || 0}</span>
                </div>

                {/* 🔢 Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                    <button
                        onClick={() => onDecrease(item)}
                        className="w-6 h-6 border rounded-full cursor-pointer text-center text-sm"
                    >
                        -
                    </button>
                    <span>{quantity}</span>
                    <button
                        onClick={() => onIncrease(item)}
                        className="w-6 h-6 border rounded-full cursor-pointer text-center text-sm"
                    >
                        +
                    </button>
                </div>

                {/* ❌ Remove */}
                <span
                    onClick={() => onRemove(item)}
                    className="mt-2 text-blue-600 text-xs font-semibold cursor-pointer"
                >
                    REMOVE
                </span>
            </div>
        </div>
    );
};

export default CartItem;
