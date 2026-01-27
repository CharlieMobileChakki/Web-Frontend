import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { userorderbyid } from "../../../store/slices/OrderSlice";
import BackButton from "../../../components/common/BackButton";
import { Package, MapPin, CreditCard, Calendar, User, Phone, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const OrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { orderDetails, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        console.log("Dispatching order id:", id);
        if (id) dispatch(userorderbyid(id));
    }, [id, dispatch]);

    if (loading) return <p className="p-6 text-center">Loading order...</p>;
    if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
    if (!orderDetails) return <p className="p-6 text-center">Order not found.</p>;

    const {
        _id,
        orderId,
        user,
        seller,
        shippingAddress,
        orderItems = [],
        paymentMethod,
        paymentGateway,
        paymentStatus,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        orderDate,
        createdAt,
        paidAt,
    } = orderDetails;

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status icon and color
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Processing':
                return { icon: Clock, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
            case 'Shipped':
                return { icon: Truck, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
            case 'Delivered':
                return { icon: CheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
            case 'Cancelled':
                return { icon: XCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
            default:
                return { icon: Package, color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
        }
    };

    const statusConfig = getStatusConfig(orderStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <BackButton />

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Details</h1>
                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono font-semibold text-blue-600">{orderId || _id}</span></p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            <StatusIcon size={20} />
                            <span className="font-semibold">{orderStatus}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="text-orange-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
                            </div>
                            <div className="space-y-4">
                                {orderItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            {item.weight && <p className="text-sm text-gray-500">Weight: {item.weight}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="text-lg font-bold text-gray-800">₹{item.price}</p>
                                            <p className="text-sm text-gray-600">Total: ₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {shippingAddress && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-green-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800">Shipping Address</h2>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <p className="font-semibold text-gray-800 mb-2">{shippingAddress.name}</p>
                                    <p className="text-gray-600 text-sm">{shippingAddress.phone}</p>
                                    {shippingAddress.address && <p className="text-gray-600 text-sm mt-2">{shippingAddress.address}</p>}
                                    {shippingAddress.street && <p className="text-gray-600 text-sm">{shippingAddress.street}</p>}
                                    <p className="text-gray-600 text-sm">
                                        {shippingAddress.city}
                                        {shippingAddress.state && `, ${shippingAddress.state}`}
                                        {shippingAddress.zipCode && ` - ${shippingAddress.zipCode}`}
                                        {shippingAddress.postalCode && ` - ${shippingAddress.postalCode}`}
                                    </p>
                                    <p className="text-gray-600 text-sm">{shippingAddress.country || 'India'}</p>
                                </div>
                            </div>
                        )}

                        {/* Payment Information */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="text-purple-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
                            </div>

                            <div className="space-y-3">
                                {/* Payment Status */}
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Payment Status</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentStatus === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                                            paymentStatus === 'FAILED' ? 'bg-red-100 text-red-700' :
                                                paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {paymentStatus}
                                    </span>
                                </div>

                                {/* Payment Gateway */}
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Payment Gateway</span>
                                    <span className="font-semibold text-gray-800">{paymentGateway || paymentMethod || 'N/A'}</span>
                                </div>

                                {/* Payment Method */}
                                {paymentInfo?.payment_method && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Payment Method</span>
                                        <span className="font-semibold text-gray-800 uppercase">{paymentInfo.payment_method}</span>
                                    </div>
                                )}

                                {/* Cashfree Payment ID */}
                                {paymentInfo?.cf_payment_id && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Payment ID</span>
                                        <span className="font-mono text-sm text-gray-800">{paymentInfo.cf_payment_id}</span>
                                    </div>
                                )}

                                {/* Bank Reference */}
                                {paymentInfo?.bank_reference && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Bank Reference</span>
                                        <span className="font-mono text-sm text-gray-800">{paymentInfo.bank_reference}</span>
                                    </div>
                                )}

                                {/* Status Message */}
                                {paymentInfo?.status_message && (
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <p className="text-sm text-green-700 font-medium">{paymentInfo.status_message}</p>
                                    </div>
                                )}

                                {/* Paid At */}
                                {paidAt && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium">Paid At</span>
                                        <span className="text-sm text-gray-800">{formatDate(paidAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Info */}
                    <div className="space-y-6">

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items Price</span>
                                    <span className="font-semibold">₹{itemsPrice || 0}</span>
                                </div>
                                {shippingPrice > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold">₹{shippingPrice}</span>
                                    </div>
                                )}
                                {taxPrice > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-semibold">₹{taxPrice}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                    <span className="text-2xl font-bold text-orange-600">₹{totalPrice}</span>
                                </div>
                            </div>

                            {/* Seller Info */}
                            {seller && (
                                <div className="mt-6 pt-6 border-t">
                                    <h3 className="font-semibold text-gray-800 mb-3">Seller Information</h3>
                                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                        <p className="text-sm"><span className="text-gray-600">Name:</span> <span className="font-semibold text-gray-800">{seller.name}</span></p>
                                        {seller.gstin && <p className="text-sm"><span className="text-gray-600">GSTIN:</span> <span className="font-mono text-xs text-gray-800">{seller.gstin}</span></p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customer Info */}
                        {user && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="text-blue-600" size={24} />
                                    <h2 className="text-xl font-bold text-gray-800">Customer</h2>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                    <p className="font-semibold text-gray-800 mb-2">{user.name}</p>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone size={16} />
                                        <span className="text-sm">{user.mobile || user.phone}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="text-indigo-600" size={24} />
                                <h2 className="text-xl font-bold text-gray-800">Timeline</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Order Placed</p>
                                        <p className="text-xs text-gray-500">{formatDate(orderDate || createdAt)}</p>
                                    </div>
                                </div>
                                {paidAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Payment Confirmed</p>
                                            <p className="text-xs text-gray-500">{formatDate(paidAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
