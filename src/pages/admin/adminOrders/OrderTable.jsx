import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminUpdateOrderStatus, adminGetOrderLabel, adminGetAllOrders } from "../../../store/slices/adminSlice/AdminOrderSlice";
import { toast } from "react-toastify";
import { Eye, X, Package, User, MapPin, CreditCard, Calendar, Phone, Mail, Download, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Pagination from "../../../components/admin/Pagination";

const OrderTable = ({ orders }) => {
    const dispatch = useDispatch();
    const { updateLoading, label, labelLoading } = useSelector((state) => state.adminOrder);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [downloadingLabelId, setDownloadingLabelId] = useState(null);
    const [downloadedLabels, setDownloadedLabels] = useState(() => {
        // Load downloaded labels from localStorage
        const saved = localStorage.getItem('downloadedLabels');
        return saved ? JSON.parse(saved) : [];
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);


    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Order status options (matching complete API specification)
    const statusOptions = [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Payment Failed"
    ];

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        // Confirm cancellation
        if (newStatus === 'Cancelled') {
            const confirmed = window.confirm(
                'Are you sure you want to cancel this order? This action may not be reversible.'
            );
            if (!confirmed) return;
        }

        setUpdatingOrderId(orderId);
        try {
            const result = await dispatch(adminUpdateOrderStatus({ orderId, status: newStatus })).unwrap();
            toast.success(result.message || "Order status updated successfully!");
            dispatch(adminGetAllOrders());
        } catch (error) {
            toast.error(error || "Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "bg-blue-100 text-blue-700";
            case "Shipped":
                return "bg-purple-100 text-purple-700";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            case "Payment Failed":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Open order details modal
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedOrder(null);
    };

    // Handle download label
    const handleDownloadLabel = async (order) => {
        setDownloadingLabelId(order._id);
        try {
            const result = await dispatch(adminGetOrderLabel(order._id)).unwrap();
            const labelData = result.label || result;

            // Create printable HTML label - Dense Thermal Style
            const labelHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Label ${order.orderId || order._id}</title>
    <style>
        @page { size: auto; margin: 0mm; }
        body { font-family: 'Arial Narrow', Arial, sans-serif; margin: 0; padding: 10px; background: #fff; color: #000; }
        .label-container { 
            width: 100%; 
            max-width: 400px; /* Thermal label width */
            margin: 0 auto; 
            border: 2px solid #000; 
            font-size: 11px; 
            line-height: 1.3;
        }
        .header { text-align: center; border-bottom: 2px solid #000; padding: 5px; background: #000; color: #fff; }
        .header h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
        .header p { margin: 2px 0 0; font-size: 10px; }
        
        .row { display: flex; border-bottom: 1px solid #000; }
        .col { flex: 1; padding: 4px; border-right: 1px solid #000; }
        .col:last-child { border-right: none; }
        
        .section-title { font-weight: bold; font-size: 10px; text-transform: uppercase; margin-bottom: 2px; text-decoration: underline; }
        .strong { font-weight: bold; }
        
        .address-box { padding: 4px; border-bottom: 1px solid #000; }
        
        .barcode-box { text-align: center; padding: 5px; border-bottom: 1px solid #000; }
        .barcode-img { max-width: 90%; height: 50px; }
        
        .items-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .items-table th { text-align: left; border-bottom: 1px solid #000; padding: 2px; font-weight: bold; }
        .items-table td { padding: 2px; vertical-align: top; }
        .text-right { text-align: right; }
        
        .totals { border-top: 1px solid #000; padding: 4px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .grand-total { font-weight: bold; font-size: 14px; border-top: 1px dashed #000; margin-top: 2px; padding-top: 2px; }
        
        .footer { text-align: center; font-size: 9px; padding: 2px; font-style: italic; }
        
        .noprint { margin-top: 10px; text-align: center; }
        .btn { padding: 5px 10px; cursor: pointer; background: #000; color: #fff; border: none; margin: 0 5px; font-size: 12px; }
        
        @media print {
            .noprint { display: none; }
            body { padding: 0; }
            .label-container { border: none; max-width: 100%; }
        }
    </style>
</head>
<body>
    <div class="label-container">
        <div class="header">
            <h2>Shipping Label</h2>
            <p>Order #${order.orderId || order._id}</p>
        </div>
        
        <div class="row">
            <div class="col">
                <div class="section-title">Sold By</div>
                <div class="strong">${labelData.soldBy || 'MobileChakki'}</div>
                ${labelData.gstin ? `<div>GSTIN: ${labelData.gstin}</div>` : ''}
            </div>
            <div class="col">
                <div class="section-title">Date</div>
                <div>${new Date(labelData.orderDate || order.createdAt).toLocaleDateString()}</div>
                <div>${new Date(labelData.orderDate || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div>

        <div class="address-box">
            <div class="section-title">Ship To</div>
            <div class="strong">${labelData.deliveryAddress?.name || order.shippingAddress?.name || 'N/A'}</div>
            <div>Ph: ${labelData.deliveryAddress?.phone || order.shippingAddress?.phone || 'N/A'}</div>
            <div style="margin-top: 2px;">
                ${labelData.deliveryAddress?.house || ''} ${labelData.deliveryAddress?.street || order.shippingAddress?.address || ''}, 
                ${labelData.deliveryAddress?.city || order.shippingAddress?.city || ''}, 
                ${labelData.deliveryAddress?.state || order.shippingAddress?.state || ''} - 
                <span class="strong">${labelData.deliveryAddress?.pincode || order.shippingAddress?.postalCode || ''}</span>
            </div>
        </div>

        ${labelData.barcodeImage ? `
        <div class="barcode-box">
            <img src="data:image/png;base64,${labelData.barcodeImage}" alt="Barcode" class="barcode-img" />
            <div style="font-size: 9px; letter-spacing: 2px; margin-top: 2px;">${labelData.barcodeNumber || ''}</div>
        </div>
        ` : ''}

        <div style="padding: 4px; border-bottom: 1px solid #000;">
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 55%;">Item</th>
                        <th style="width: 15%; text-align: center;">Qty</th>
                        <th style="width: 30%; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${(labelData.products || order.orderItems || []).map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td style="text-align: center;">${item.quantity}</td>
                            <td class="text-right">₹${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${labelData.itemsPrice || order.itemsPrice || (labelData.totalPrice || order.totalPrice)}</span>
            </div>
            ${(labelData.taxPrice || order.taxPrice) > 0 ? `
            <div class="total-row">
                <span>Tax:</span>
                <span>₹${labelData.taxPrice || order.taxPrice}</span>
            </div>` : ''}
            <div class="total-row grand-total">
                <span>TOTAL AMOUNT:</span>
                <span>₹${labelData.totalPrice || order.totalPrice}</span>
            </div>
            <div class="total-row" style="margin-top: 4px; font-size: 10px;">
                <span>Payment: ${labelData.payment?.method || order.paymentGateway || 'Prepaid'}</span>
                <span style="font-weight: bold; text-transform: uppercase;">${labelData.payment?.status || order.paymentStatus || 'PENDING'}</span>
            </div>
        </div>

        <div class="footer">
            Thank you for shopping with MobileChakki!
        </div>
    </div>

    <div class="noprint">
        <button onclick="window.print()" class="btn">Print Label</button>
        <button onclick="window.close()" class="btn">Close</button>
    </div>
</body>
</html>
            `;

            // Open label in new window
            const labelWindow = window.open('', '_blank');
            labelWindow.document.write(labelHTML);
            labelWindow.document.close();

            // Mark this order as downloaded
            const updatedDownloaded = [...downloadedLabels, order._id];
            setDownloadedLabels(updatedDownloaded);
            localStorage.setItem('downloadedLabels', JSON.stringify(updatedDownloaded));

            toast.success("Label opened in new window");
        } catch (error) {
            console.error("Error downloading label:", error);
            toast.error(error || "Failed to download label");
        } finally {
            setDownloadingLabelId(null);
        }
    };

    return (
        <>
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full whitespace-nowrap text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SR No.</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {currentOrders?.map((order, index) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition duration-150">
                                    {/* SR No. */}
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>

                                    {/* Order ID */}
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                                            #{order._id.slice(-8)}
                                        </div>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{order.user?.name || 'N/A'}</div>
                                            {order.user?.phone && (
                                                <div className="text-xs text-gray-500 mt-0.5">{order.user.phone}</div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Items */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                                            {order.orderItems?.length || 0} item(s)
                                        </span>
                                    </td>

                                    {/* Payment Method */}
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${order.paymentStatus === 'SUCCESS'
                                                ? 'bg-green-100 text-green-700'
                                                : order.paymentStatus === "PENDING"
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : order.paymentStatus === "FAILED"
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>

                                    {/* Total */}
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        ₹{order.totalPrice}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            disabled={updateLoading && updatingOrderId === order._id}
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${getStatusColor(order.orderStatus)} ${updateLoading && updatingOrderId === order._id ? 'opacity-50' : ''
                                                }`}
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(order.createdAt)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            {order.paymentStatus === "SUCCESS" && (
                                                <button
                                                    onClick={() => handleDownloadLabel(order)}
                                                    disabled={downloadingLabelId === order._id}
                                                    className={`p-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${downloadedLabels.includes(order._id)
                                                        ? "text-green-600 hover:bg-green-50"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                    title={
                                                        downloadedLabels.includes(order._id)
                                                            ? "Downloaded"
                                                            : "Download Label"
                                                    }
                                                >
                                                    {downloadingLabelId === order._id ? (
                                                        <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-green-600"></div>
                                                    ) : downloadedLabels.includes(order._id) ? (
                                                        <CheckCircle size={18} className="fill-green-600" />
                                                    ) : (
                                                        <Download size={18} />
                                                    )}
                                                </button>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders?.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Package size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No orders found</p>
                    </div>
                )}
            </div>


            {/* ✅ Pagination UI */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={orders.length}
                itemsPerPage={itemsPerPage}
            />


            {/* Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00000080] backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#2c3e50] text-white p-4 sm:p-6 z-10 flex justify-between items-center rounded-t-xl">
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold">Order Details</h2>
                                <p className="text-blue-100 text-xs sm:text-sm mt-1">Order ID: <span className="font-mono">{selectedOrder._id}</span></p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-300 hover:text-white text-3xl font-light leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
                            {/* Order Status & Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Calendar size={16} className="sm:w-[18px]" />
                                        <span className="font-semibold text-sm sm:text-base">Order Date</span>
                                    </div>
                                    <p className="text-gray-800 text-sm sm:text-base font-medium">{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <Package size={16} className="sm:w-[18px]" />
                                        <span className="font-semibold text-sm sm:text-base">Order Status</span>
                                    </div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(selectedOrder.orderStatus)}`}>
                                        {selectedOrder.orderStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="border-t pt-4 sm:pt-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <User className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Customer Information</h3>
                                </div>
                                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg space-y-2 border border-blue-100">
                                    <p className="text-gray-800 text-sm sm:text-base"><span className="font-semibold">Name:</span> {selectedOrder.user?.name || 'N/A'}</p>
                                    {selectedOrder.user?.phone && (
                                        <p className="text-gray-800 text-sm sm:text-base flex items-center gap-2">
                                            <Phone size={14} className="sm:w-4" />
                                            <span className="font-semibold">Phone:</span> {selectedOrder.user.phone}
                                        </p>
                                    )}
                                    {selectedOrder.user?.email && (
                                        <p className="text-gray-800 text-sm sm:text-base flex items-center gap-2">
                                            <Mail size={14} className="sm:w-4" />
                                            <span className="font-semibold">Email:</span> {selectedOrder.user.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="border-t pt-4 sm:pt-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <MapPin className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Shipping Address</h3>
                                </div>
                                <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
                                    {selectedOrder.shippingAddress ? (
                                        <div className="space-y-1 text-gray-800 text-sm sm:text-base">
                                            <p className="font-medium">{selectedOrder.shippingAddress.street}</p>
                                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - <span className="font-semibold">{selectedOrder.shippingAddress.zipCode}</span></p>
                                            <p>{selectedOrder.shippingAddress.country}</p>
                                            {(selectedOrder.shippingAddress.phone || selectedOrder.user?.phone) && (
                                                <p className="mt-2 text-xs sm:text-sm text-green-800"><span className="font-semibold">Contact:</span> {selectedOrder.shippingAddress.phone || selectedOrder.user?.phone}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">No shipping address available</p>
                                    )}
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="border-t pt-4 sm:pt-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <CreditCard className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Payment Information</h3>
                                </div>
                                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg space-y-2 border border-purple-100">
                                    <p className="text-gray-800 text-sm sm:text-base">
                                        <span className="font-semibold">Method:</span>{' '}
                                        <span className={`px-2 py-0.5 rounded text-xs sm:text-sm font-medium ${selectedOrder.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {selectedOrder.paymentMethod}
                                        </span>
                                    </p>
                                    <p className="text-gray-800 text-sm sm:text-base"><span className="font-semibold">Status:</span> {selectedOrder.paymentStatus || 'Pending'}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t pt-4 sm:pt-6">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <Package className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6" />
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800">Order Items</h3>
                                </div>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <div key={index} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border border-gray-200 shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate" title={item.name}>{item.name || 'Product'}</h4>
                                                <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                                                    <p className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-0.5 rounded border">Qty: {item.quantity}</p>
                                                    <p className="font-bold text-gray-800 text-sm sm:text-base">₹{item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4 sm:pt-6">
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Order Summary</h3>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100 space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                        <span>Subtotal</span>
                                        <span className="font-medium">₹{selectedOrder.itemsPrice || selectedOrder.totalPrice}</span>
                                    </div>
                                    {selectedOrder.shippingPrice > 0 && (
                                        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                            <span>Shipping</span>
                                            <span className="font-medium">₹{selectedOrder.shippingPrice}</span>
                                        </div>
                                    )}
                                    {selectedOrder.taxPrice > 0 && (
                                        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                                            <span>Tax</span>
                                            <span className="font-medium">₹{selectedOrder.taxPrice}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-blue-200/50 pt-3 mt-2 flex justify-between items-center text-lg sm:text-xl font-bold text-gray-900">
                                        <span>Total Amount</span>
                                        <span className="text-blue-700">₹{selectedOrder.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6 flex justify-end rounded-b-xl z-10">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 bg-gray-800 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTable;
