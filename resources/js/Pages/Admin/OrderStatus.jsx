import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import "@fontsource/noto-sans-thai";
import { Footer } from '@/Components/Footer';
import { 
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    XCircleIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    ArrowPathIcon,
    StarIcon,
    ChartBarIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Status({ orders, statusUpdateSuccess }) {
    const [orderStatuses, setOrderStatuses] = useState({});
    const [loading, setLoading] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});

    useEffect(() => {
        const initialStatuses = orders.reduce((acc, order) => {
            acc[order.id] = order.status || 'pending';
            return acc;
        }, {});
        setOrderStatuses(initialStatuses);
    }, [orders]);

    const handleStatusChange = (newStatus, orderId) => {
        setOrderStatuses({
            ...orderStatuses,
            [orderId]: newStatus,
        });
        setOpenDropdowns({
            ...openDropdowns,
            [orderId]: false
        });
    };

    const toggleDropdown = (orderId) => {
        setOpenDropdowns({
            ...openDropdowns,
            [orderId]: !openDropdowns[orderId]
        });
    };

    const getStatusOptions = () => [
        { value: 'pending', label: 'รอดำเนินการ', icon: ClockIcon, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100' },
        { value: 'shipped', label: 'จัดส่งแล้ว', icon: TruckIcon, color: 'text-blue-600', bgColor: 'bg-blue-50 hover:bg-blue-100' },
        { value: 'delivered', label: 'ส่งถึงแล้ว', icon: CheckCircleIcon, color: 'text-green-600', bgColor: 'bg-green-50 hover:bg-green-100' },
        { value: 'canceled', label: 'ยกเลิก', icon: XCircleIcon, color: 'text-red-600', bgColor: 'bg-red-50 hover:bg-red-100' }
    ];

    const handleUpdateStatus = (orderId) => {
        const newStatus = orderStatuses[orderId];
        const currentOrder = orders.find(order => order.id === orderId);

        if (!newStatus || newStatus === currentOrder.status) {
            alert('กรุณาเลือกสถานะใหม่หรือสถานะเดิม');
            return;
        }

        setLoading({ ...loading, [orderId]: true });

        Inertia.put(route('admin.orders.update', orderId), { status: newStatus })
            .then(response => {
                console.log('สถานะอัปเดตสำเร็จ:', response);
                setOrderStatuses({
                    ...orderStatuses,
                    [orderId]: newStatus,
                });
                setLoading({ ...loading, [orderId]: false });
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ:', error);
                setLoading({ ...loading, [orderId]: false });
            });
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return {
                color: 'bg-amber-100 text-amber-800 border-amber-200',
                icon: ClockIcon,
                gradient: 'from-amber-500 to-yellow-500',
                label: 'รอดำเนินการ'
            };
            case 'shipped': return {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: TruckIcon,
                gradient: 'from-blue-500 to-indigo-500',
                label: 'จัดส่งแล้ว'
            };
            case 'delivered': return {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircleIcon,
                gradient: 'from-green-500 to-emerald-500',
                label: 'ส่งถึงแล้ว'
            };
            case 'canceled': return {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: XCircleIcon,
                gradient: 'from-red-500 to-pink-500',
                label: 'ยกเลิก'
            };
            default: return {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: ClockIcon,
                gradient: 'from-gray-500 to-slate-500',
                label: 'ไม่ทราบสถานะ'
            };
        }
    };

    const getOrderStats = () => {
        const stats = orders.reduce((acc, order) => {
            const status = order.status || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            acc.totalRevenue = (acc.totalRevenue || 0) + (order.total_price || 0);
            return acc;
        }, {});
        return stats;
    };

    const orderStats = getOrderStats();

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-noto-sans-thai">
            <LoggedInNavbar/>
            
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
                            <ClipboardDocumentListIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">จัดการคำสั่งซื้อ</h1>
                        <p className="text-xl opacity-90 mb-6">
                            {orderStats.total > 0 ? `ทั้งหมด ${orderStats.total} คำสั่งซื้อ` : 'ยังไม่มีคำสั่งซื้อ'}
                        </p>
                        {orderStats.totalRevenue > 0 && (
                            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
                                <CurrencyDollarIcon className="w-5 h-5" />
                                <span className="font-semibold">รายได้รวม: ฿{orderStats.totalRevenue.toLocaleString()}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-10">
                {/* Success Message */}
                <AnimatePresence>
                    {statusUpdateSuccess && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-center shadow-lg"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircleIcon className="w-5 h-5" />
                                <span className="font-medium">{statusUpdateSuccess}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Cards */}
                {orderStats.total > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { key: 'pending', label: 'รอดำเนินการ', icon: ClockIcon, color: 'bg-amber-500' },
                            { key: 'shipped', label: 'จัดส่งแล้ว', icon: TruckIcon, color: 'bg-blue-500' },
                            { key: 'delivered', label: 'ส่งถึงแล้ว', icon: CheckCircleIcon, color: 'bg-green-500' },
                            { key: 'canceled', label: 'ยกเลิก', icon: XCircleIcon, color: 'bg-red-500' }
                        ].map((stat) => {
                            const StatIcon = stat.icon;
                            const count = orderStats[stat.key] || 0;
                            return (
                                <div key={stat.key} className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${stat.color} rounded-lg`}>
                                            <StatIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-800">{count}</div>
                                            <div className="text-sm text-gray-600">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Orders Grid */}
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">ยังไม่มีคำสั่งซื้อ</h3>
                        <p className="text-gray-500">เมื่อมีคำสั่งซื้อใหม่ คุณจะเห็นรายการที่นี่</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {orders.map((order) => {
                            const currentStatus = orderStatuses[order.id] || 'pending';
                            const statusConfig = getStatusConfig(currentStatus);
                            const StatusIcon = statusConfig.icon;
                            return (
                                <div key={order.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">คำสั่งซื้อ #{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                                <StatusIcon className="w-4 h-4 inline mr-1" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        
                                        {/* Order Details */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">ยอดรวม:</span>
                                                <span className="text-2xl font-bold text-green-600">฿{order.total_price?.toLocaleString() || 0}</span>
                                            </div>
                                            {order.created_at && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">วันที่สั่ง:</span>
                                                    <span className="text-sm text-gray-700">{formatDate(order.created_at)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Update Section */}
                                    <div className="p-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            อัปเดตสถานะคำสั่งซื้อ
                                        </label>
                                        
                                        {/* Custom Dropdown */}
                                        <div className="relative">
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => toggleDropdown(order.id)}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon className={`w-5 h-5 ${statusConfig.color.split(' ')[1]}`} />
                                                    <span className="font-medium text-gray-800">{statusConfig.label}</span>
                                                </div>
                                                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                                    openDropdowns[order.id] ? 'rotate-180' : ''
                                                }`} />
                                            </motion.button>
                                            
                                            <AnimatePresence>
                                                {openDropdowns[order.id] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                                                    >
                                                        {getStatusOptions().map((option) => {
                                                            const OptionIcon = option.icon;
                                                            return (
                                                                <motion.button
                                                                    key={option.value}
                                                                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                                                                    onClick={() => handleStatusChange(option.value, order.id)}
                                                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 ${
                                                                        currentStatus === option.value 
                                                                            ? 'bg-indigo-50 border-r-4 border-indigo-500' 
                                                                            : 'hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    <div className={`p-2 rounded-lg ${option.bgColor.split(' ')[0]}`}>
                                                                        <OptionIcon className={`w-4 h-4 ${option.color}`} />
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium text-gray-800">{option.label}</span>
                                                                        {currentStatus === option.value && (
                                                                            <div className="text-xs text-indigo-600 font-medium">ปัจจุบัน</div>
                                                                        )}
                                                                    </div>
                                                                    {currentStatus === option.value && (
                                                                        <div className="ml-auto">
                                                                            <CheckCircleIcon className="w-4 h-4 text-indigo-600" />
                                                                        </div>
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleUpdateStatus(order.id)}
                                            disabled={loading[order.id]}
                                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                        >
                                            {loading[order.id] ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    กำลังอัปเดต...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    อัปเดตสถานะ
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Navigation */}
                <div className="text-center mt-12">
                    <a 
                        href="/foods" 
                        className="inline-flex items-center bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปหน้าแรก
                    </a>
                </div>
            </div>
            <Footer className="mt-20"></Footer>
        </div>
    );
}
