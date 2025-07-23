import React, { useState } from "react";
import "@fontsource/noto-sans-thai";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Footer } from "@/Components/Footer";
import { Link } from "@inertiajs/inertia-react";
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBagIcon,
    ClockIcon,
    CheckCircleIcon,
    TruckIcon,
    CreditCardIcon,
    CalendarIcon,
    EyeIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
        case 'รอดำเนินการ':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'confirmed':
        case 'ยืนยันแล้ว':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'preparing':
        case 'กำลังเตรียม':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'ready':
        case 'พร้อมส่ง':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'delivered':
        case 'ส่งแล้ว':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
        case 'ยกเลิก':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
        case 'รอดำเนินการ':
            return <ClockIcon className="w-5 h-5" />;
        case 'confirmed':
        case 'ยืนยันแล้ว':
            return <CheckCircleIcon className="w-5 h-5" />;
        case 'preparing':
        case 'กำลังเตรียม':
            return <ClockIcon className="w-5 h-5" />;
        case 'ready':
        case 'พร้อมส่ง':
            return <TruckIcon className="w-5 h-5" />;
        case 'delivered':
        case 'ส่งแล้ว':
            return <CheckCircleIcon className="w-5 h-5" />;
        case 'cancelled':
        case 'ยกเลิก':
            return <XMarkIcon className="w-5 h-5" />;
        default:
            return <ClockIcon className="w-5 h-5" />;
    }
};

const OrderCard = ({ order, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <ShoppingBagIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">คำสั่งซื้อ #{order.id}</h3>
                            <p className="text-indigo-100 text-sm">วันที่สั่ง: {new Date(order.created_at).toLocaleDateString('th-TH')}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-semibold text-sm">{order.status || 'รอดำเนินการ'}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <ShoppingBagIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">รายการ</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {order?.order_items?.length || 0} รายการ
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                            <CreditCardIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">ยอดรวม</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700">
                            ฿{(order?.total_price || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Payment Info */}
                {order?.payment && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <CreditCardIcon className="w-5 h-5" />
                            <span className="font-semibold">ข้อมูลการชำระเงิน</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">วิธีชำระเงิน:</span>
                                <p className="font-semibold text-gray-900">
                                    {order.payment?.payment_method || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">จำนวนเงิน:</span>
                                <p className="font-semibold text-green-600">
                                    ฿{(order.payment?.amount || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Items Preview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5 text-gray-600" />
                            รายการอาหาร
                        </h4>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            <span className="text-sm font-medium">
                                {isExpanded ? 'ซ่อน' : 'ดูทั้งหมด'}
                            </span>
                            {isExpanded ? 
                                <ChevronUpIcon className="w-4 h-4" /> : 
                                <ChevronDownIcon className="w-4 h-4" />
                            }
                        </button>
                    </div>

                    {/* Items List */}
                    <AnimatePresence>
                        <div className={`space-y-3 ${!isExpanded ? 'max-h-32 overflow-hidden' : ''}`}>
                            {order?.order_items?.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="relative">
                                        <img
                                            src={`/storage/${item.food?.image}`}
                                            alt={item.food?.name || 'ไม่ทราบชื่ออาหาร'}
                                            className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                                        />
                                        <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                            {item.quantity || 0}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-gray-900 truncate">
                                            {item.food?.name || 'ไม่ทราบชื่ออาหาร'}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity || 0} × ฿{(item.food?.price || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            ฿{((item.quantity || 0) * (item.food?.price || 0)).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setShowDetails(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                    >
                        <EyeIcon className="w-5 h-5" />
                        ดูรายละเอียด
                    </button>
                    <Link
                        href="/foods"
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                        <ShoppingBagIcon className="w-5 h-5" />
                        สั่งอีกครั้ง
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default function Status({ orders }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <LoggedInNavbar />
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 pt-32 pb-12">
                <div className="container mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-white"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <ShoppingBagIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">สถานะคำสั่งซื้อ</h1>
                        <p className="text-xl opacity-90">
                            {orders.length > 0 ? `คุณมี ${orders.length} คำสั่งซื้อ` : 'ยังไม่มีคำสั่งซื้อ'}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-10 pb-12">
                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">ยังไม่มีคำสั่งซื้อ</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            คุณยังไม่มีประวัติการสั่งซื้อ เริ่มเลือกอาหารอร่อยจากเมนูของเราเลย!
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link 
                                href="/foods" 
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                            >
                                <ShoppingBagIcon className="w-5 h-5" />
                                เลือกเมนูอาหาร
                            </Link>
                            <Link 
                                href="/welcome" 
                                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                            >
                                กลับหน้าหลัก
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {orders.map((order, index) => (
                            <OrderCard key={order.id} order={order} index={index} />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}
