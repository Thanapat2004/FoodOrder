import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/inertia-react";
import "@fontsource/noto-sans-thai";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Footer } from "@/Components/Footer";
import {
    ShoppingBagIcon,
    ShoppingCartIcon,
    MagnifyingGlassIcon,
    StarIcon,
    HeartIcon,
    PlusIcon,
    FunnelIcon,
    FireIcon,
    TrophyIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function Index({ foods }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderStatus =
        cart.length > 0
            ? "คำสั่งซื้อของคุณยังไม่ได้สั่งซื้อ"
            : "ไม่มีคำสั่งซื้อ";

    const handleAddToCart = (food) => {
        const loggedInUser = document.querySelector(
            'meta[name="user-id"]'
        )?.content;

        if (!loggedInUser) {
            alert("กรุณาล็อกอินก่อนเพิ่มสินค้าลงตะกร้า");
            return;
        }

        // ตรวจสอบและตั้งค่า currentUser หากยังไม่มี
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            localStorage.setItem("currentUser", loggedInUser);
        } else if (currentUser !== loggedInUser) {
            // ผู้ใช้เปลี่ยน - ล้างตะกร้าเก่า
            localStorage.removeItem("cart");
            localStorage.setItem("currentUser", loggedInUser);
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find((item) => item.id === food.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...food, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`);
    };

    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const topSellingFoods = [...foods]
        .sort((a, b) => b.sales_count - a.sales_count)
        .slice(0, 8);

    const allCategories = [
        "ทั้งหมด",
        ...Array.from(
            new Set(foods.map((food) => food.category?.name || "อื่น ๆ"))
        ),
    ];

    const filteredFoods = foods.filter(
        (food) =>
            food.name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedCategory === "ทั้งหมด" ||
                food.category?.name === selectedCategory)
    );

    const categorizedFoods = filteredFoods.reduce((acc, food) => {
        const category = food.category?.name || "อื่น ๆ";
        if (!acc[category]) acc[category] = [];
        acc[category].push(food);
        return acc;
    }, {});

    const toggleFavorite = (foodId) => {
        setFavorites(prev => 
            prev.includes(foodId) 
                ? prev.filter(id => id !== foodId)
                : [...prev, foodId]
        );
    };

    const getFoodStats = () => {
        const totalItems = foods.length;
        const totalSales = foods.reduce((sum, food) => sum + food.sales_count, 0);
        const avgPrice = foods.reduce((sum, food) => sum + food.price, 0) / totalItems;
        return { totalItems, totalSales, avgPrice };
    };

    const foodStats = getFoodStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-noto-sans-thai">
            <LoggedInNavbar/>
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 pt-32 pb-12">
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">เมนูอาหารอร่อย</h1>
                        <p className="text-xl opacity-90 mb-6">
                            เลือกจากอาหารหลากหลายสไตล์ {foodStats.totalItems} เมนู
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
                                <TrophyIcon className="w-5 h-5" />
                                <span className="font-semibold">ยอดขาย: {foodStats.totalSales.toLocaleString()} ครั้ง</span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
                                <StarIcon className="w-5 h-5" />
                                <span className="font-semibold">ราคาเฉลี่ย: ฿{Math.round(foodStats.avgPrice)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-10">
                {/* Search and Filter Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MagnifyingGlassIcon className="w-5 h-5 text-indigo-600" />
                        ค้นหาเมนู
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่ออาหาร..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>
                        <div className="relative md:w-1/3">
                            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all cursor-pointer appearance-none"
                            >
                                {allCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Best Selling Foods */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FireIcon className="w-6 h-6 text-red-500" />
                        <h2 className="text-2xl font-bold text-gray-800">เมนูขายดี</h2>
                        <div className="h-1 flex-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topSellingFoods.slice(0, 4).map((food, index) => (
                            <motion.div
                                key={food.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="relative">
                                    {food.image_url && (
                                        <img
                                            src={food.image_url}
                                            alt={food.name}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                            <TrophyIcon className="w-4 h-4" />
                                            #{index + 1}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleFavorite(food.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                                    >
                                        <HeartIcon className={`w-5 h-5 ${
                                            favorites.includes(food.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                                        }`} />
                                    </motion.button>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{food.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-indigo-600">฿{food.price.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <FireIcon className="w-4 h-4 text-orange-500" />
                                            {food.sales_count} ครั้ง
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/food/${food.id}`}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            ดูรายละเอียด
                                        </Link>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAddToCart(food)}
                                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center gap-1"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            เพิ่ม
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {Object.entries(categorizedFoods).map(([category, foods]) => (
                    <div key={category} className="mb-10" data-aos="fade-up">
                        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
                            {category}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {foods.map((food) => (
                                <div
                                    key={food.id}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-100 overflow-hidden"
                                    data-aos="fade-up"
                                >
                                    <div className="relative h-40">
                                        {food.image_url && (
                                            <img
                                                src={food.image_url}
                                                alt={food.name}
                                                className="w-full h-full object-cover rounded-t-lg"
                                            />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2">
                                            {food.name}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            {food.description}
                                        </p>
                                        <div className="text-green-500 font-bold mb-4">
                                            THB: {food.price} ฿
                                        </div>
                                        <div className="text-gray-400 text-sm font-bold mb-2">
                                            สั่งซื้อแล้ว {food.sales_count} ครั้ง
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <Link
                                                href={`/food/${food.id}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                ดูรายละเอียด
                                            </Link>
                                            <button
                                                onClick={() => handleAddToCart(food)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition-all hover:scale-110"
                                            >
                                                เพิ่มลงในตะกร้า
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}
