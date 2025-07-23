import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Footer } from "@/Components/Footer";
import '@fontsource/noto-sans-thai';
import { 
    ShoppingCartIcon, 
    TrashIcon, 
    PlusIcon, 
    MinusIcon,
    CreditCardIcon,
    TruckIcon,
    CheckCircleIcon,
    ShoppingBagIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Addtocart({ paymentMethods }) {
    const [cart, setCart] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [userAddress, setUserAddress] = useState({ name: '', phone: '', address: '', additionalDetails: '' });

    useEffect(() => {
        const loggedInUser = document.querySelector('meta[name="user-id"]')?.content;
        const currentUser = localStorage.getItem('currentUser');

        // ตรวจสอบว่าผู้ใช้เปลี่ยนหรือไม่ หรือไม่มีผู้ใช้ล็อกอิน
        if (!loggedInUser) {
            // ไม่มีผู้ใช้ล็อกอิน - ล้างข้อมูลทั้งหมด
            localStorage.removeItem('cart');
            localStorage.removeItem('userAddress');
            localStorage.removeItem('currentUser');
            setCart([]);
            setUserAddress({ name: '', phone: '', address: '', additionalDetails: '' });
        } else if (currentUser !== loggedInUser) {
            // ผู้ใช้เปลี่ยน - ล้างข้อมูลเก่าและตั้งผู้ใช้ใหม่
            localStorage.removeItem('cart');
            localStorage.removeItem('userAddress');
            localStorage.setItem('currentUser', loggedInUser);
            setCart([]);
            setUserAddress({ name: '', phone: '', address: '', additionalDetails: '' });
        } else {
            // ผู้ใช้เดิม - โหลดข้อมูลที่บันทึกไว้
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const storedAddress = JSON.parse(localStorage.getItem('userAddress')) || { name: '', phone: '', address: '', additionalDetails: '' };
            setCart(storedCart);
            setUserAddress(storedAddress);
        }
    }, []);

    const handleRemoveFromCart = (foodId) => {
        const updatedCart = cart.filter((food) => food.id !== foodId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleIncreaseQuantity = (foodId) => {
        const updatedCart = cart.map((food) =>
            food.id === foodId ? { ...food, quantity: (food.quantity || 1) + 1 } : food
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleDecreaseQuantity = (foodId) => {
        const updatedCart = cart.map((food) =>
            food.id === foodId && (food.quantity || 1) > 1
                ? { ...food, quantity: (food.quantity || 1) - 1 }
                : food
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = () => {
        if (!userAddress.name || !userAddress.phone || !userAddress.address) {
            alert("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
            return;
        }

        const orderData = {
            cart: cart.map(food => ({
                id: food.id,
                quantity: food.quantity || 1
            })),
            payment_method: selectedPayment,
            user_address: userAddress
        };

        Inertia.post(route('orders.store'), orderData, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                alert("สั่งซื้อสำเร็จ!");
                localStorage.removeItem('cart');
                localStorage.removeItem('userAddress');
                setCart([]);
                setSelectedPayment('');
                setUserAddress({ name: '', phone: '', address: '', additionalDetails: '' });
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const totalPrice = cart.reduce((total, food) => total + (food.price * (food.quantity || 1)), 0);
    const totalItems = cart.reduce((total, food) => total + (food.quantity || 1), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
                            <ShoppingCartIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">ตะกร้าสินค้าของคุณ</h1>
                        <p className="text-xl opacity-90">
                            {cart.length > 0 ? `${totalItems} รายการในตะกร้า` : 'ตะกร้าของคุณว่างเปล่า'}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                    <ShoppingBagIcon className="w-6 h-6 mr-2 text-indigo-600" />
                                    รายการสินค้า
                                </h2>
                                {cart.length > 0 && (
                                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {totalItems} รายการ
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {cart.length > 0 ? (
                                    <div className="space-y-4">
                                        {cart.map((food) => (
                                            <motion.div
                                                key={food.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="relative">
                                                        <img 
                                                            src={`/storage/${food.image}`} 
                                                            alt={food.name} 
                                                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-md" 
                                                        />
                                                        <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                                            {food.quantity || 1}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{food.name}</h3>
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-2xl font-bold text-indigo-600">
                                                                ฿{(food.price * (food.quantity || 1)).toLocaleString()}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ฿{food.price.toLocaleString()} × {food.quantity || 1}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-end gap-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                            <motion.button 
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleDecreaseQuantity(food.id)} 
                                                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <MinusIcon className="w-4 h-4" />
                                                            </motion.button>
                                                            <span className="px-4 py-2 font-semibold text-gray-800">{food.quantity || 1}</span>
                                                            <motion.button 
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleIncreaseQuantity(food.id)} 
                                                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                                            >
                                                                <PlusIcon className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                        
                                                        {/* Remove Button */}
                                                        <motion.button 
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleRemoveFromCart(food.id)} 
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                            ลบ
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16"
                                    >
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">ตะกร้าของคุณว่างเปล่า</h3>
                                        <p className="text-gray-600 mb-6">เริ่มเลือกอาหารอร่อยจากเมนูของเรา</p>
                                        <Link 
                                            href="/foods" 
                                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                        >
                                            <ShoppingBagIcon className="w-5 h-5" />
                                            เลือกเมนูอาหาร
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Order Summary & Checkout */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            
                            {/* Order Summary */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-xl p-6"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                                    สรุปคำสั่งซื้อ
                                </h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>รายการสินค้า ({totalItems})</span>
                                        <span>฿{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>ค่าจัดส่ง</span>
                                        <span className="text-green-600 font-medium">ฟรี</span>
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-xl font-bold text-gray-800">
                                            <span>ยอดรวมทั้งหมด</span>
                                            <span className="text-indigo-600">฿{totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {cart.length > 0 && (
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3 text-green-700">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span className="text-sm font-medium">คุณประหยัดได้ ฿49 จากค่าจัดส่งฟรี!</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Delivery Information */}
                            {cart.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <TruckIcon className="w-6 h-6 mr-2 text-blue-600" />
                                        ข้อมูลการจัดส่ง
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={userAddress.name} 
                                                onChange={handleAddressChange} 
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                                placeholder="กรอกชื่อ-นามสกุล"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                value={userAddress.phone} 
                                                onChange={handleAddressChange} 
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                                                placeholder="0xx-xxx-xxxx"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่จัดส่ง</label>
                                            <textarea 
                                                name="address" 
                                                value={userAddress.address} 
                                                onChange={handleAddressChange} 
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none" 
                                                placeholder="กรอกที่อยู่สำหรับจัดส่ง"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">หมายเหตุเพิ่มเติม</label>
                                            <textarea 
                                                name="additionalDetails" 
                                                value={userAddress.additionalDetails} 
                                                onChange={handleAddressChange} 
                                                rows={2}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none" 
                                                placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment Method */}
                            {cart.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white rounded-2xl shadow-xl p-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <CreditCardIcon className="w-6 h-6 mr-2 text-purple-600" />
                                        วิธีการชำระเงิน
                                    </h3>
                                    
                                    <select 
                                        value={selectedPayment} 
                                        onChange={handlePaymentChange} 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                                    >
                                        <option value="">-- เลือกวิธีการชำระเงิน --</option>
                                        {Array.isArray(paymentMethods) && paymentMethods.map((payment) => (
                                            <option key={payment.id} value={payment.id}>{payment.name}</option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <Link 
                                    href="/foods" 
                                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all font-medium"
                                >
                                    <ShoppingBagIcon className="w-5 h-5" />
                                    เลือกเมนูเพิ่มเติม
                                </Link>
                                
                                {cart.length > 0 && (
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmitOrder} 
                                        disabled={!selectedPayment || !userAddress.name || !userAddress.phone || !userAddress.address}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                            selectedPayment && userAddress.name && userAddress.phone && userAddress.address
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircleIcon className="w-6 h-6" />
                                            ยืนยันการสั่งซื้อ
                                        </div>
                                    </motion.button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-20">
                <Footer/>
            </div>
        </div>
    );
}
