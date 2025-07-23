import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Carousel, Typography } from "@material-tailwind/react";
import { Footer } from "@/Components/Footer";
import { route } from "ziggy-js";

import "@fontsource/noto-sans-thai";

export default function Index({ foods = [], categories = [], orders = [], users = [] }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Statistics calculation
    const statistics = {
        totalFoods: foods.length,
        totalOrders: orders?.length || 0,
        totalCategories: categories.length,
        totalUsers: users?.length || 0,
        todaySales: 0, // Placeholder for future implementation
    };

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
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...food, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`);
    };

    const handleDelete = (foodId) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            router.delete(route("admin.foods.destroy", foodId));
        }
    };

    const filteredFoods = foods.filter(
        (food) =>
            food.name.includes(search) &&
            (selectedCategory === "" ||
                food.category?.id === parseInt(selectedCategory))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <LoggedInNavbar className="fixed top-0 z-50 w-full bg-white shadow-md"></LoggedInNavbar>
            <div className="container mx-auto px-6 pt-24 pb-12">
                {/* Admin Dashboard Statistics */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        แดชบอร์ดผู้ดูแลระบบ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        จำนวนอาหารทั้งหมด
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {statistics.totalFoods}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        คำสั่งซื้อทั้งหมด
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {statistics.totalOrders}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        หมวดหมู่ทั้งหมด
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {statistics.totalCategories}
                                    </p>
                                </div>
                                <div className="bg-yellow-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        ผู้ใช้ทั้งหมด
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {statistics.totalUsers}
                                    </p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        ยอดขายวันนี้
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ฿{statistics.todaySales}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        การจัดการด่วน
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <Link
                            href={route("admin.foods.create")}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            <p className="font-medium">เพิ่มเมนูใหม่</p>
                        </Link>

                        <Link
                            href={route("admin.orders.index")}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <p className="font-medium">จัดการคำสั่งซื้อ</p>
                        </Link>

                        <button
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                            onClick={() =>
                                alert("ฟีเจอร์จัดการหมวดหมู่กำลังพัฒนา")
                            }
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                            <p className="font-medium">จัดการหมวดหมู่</p>
                        </button>

                        <button
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                            onClick={() => alert("ฟีเจอร์รายงานกำลังพัฒนา")}
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <p className="font-medium">รายงาน</p>
                        </button>

                        <Link
                            href={route("admin.users.index")}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                            <p className="font-medium">จัดการผู้ใช้</p>
                        </Link>
                    </div>
                </div>
                <Carousel className="rounded-xl mb-10">
                    {foods.slice(0, 5).map((food) => (
                        <div key={food.id} className="relative h-96">
                            <img
                                src={food.image_url}
                                alt={food.name}
                                className="w-full h-full object-cover rounded-xl transition-transform duration-500 transform hover:scale-105"
                            />
                            <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white p-4 rounded-b-xl">
                                <Typography variant="h4" className="font-bold">
                                    {food.name}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </Carousel>
                {/* Food Management Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        จัดการเมนูอาหาร
                    </h1>
                    <div className="flex gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            ทั้งหมด {filteredFoods.length} รายการ
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="ค้นหารายการอาหาร"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border border-gray-300 p-3 rounded-lg shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
                    >
                        <option value="">ทุกหมวดหมู่</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {filteredFoods.map((food) => (
                        <div
                            key={food.id}
                            className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
                        >
                            {food.image_url && (
                                <img
                                    src={food.image_url}
                                    alt={food.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                                    {food.name}
                                </h2>
                                <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                                    {food.description}
                                </p>
                                <p className="text-sm text-gray-500 mb-3">
                                    หมวดหมู่: {food.category?.name || "ไม่มีหมวดหมู่"}
                                </p>
                                <p className="text-green-500 font-bold text-lg mb-4">
                                    ฿{food.price.toLocaleString()}
                                </p>

                                <div className="flex justify-between items-center mb-4">
                                    <Link
                                        href={`/food/${food.id}`}
                                        className="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium transition-colors"
                                    >
                                        ดูรายละเอียด
                                    </Link>
                                    <button
                                        onClick={() => handleAddToCart(food)}
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all text-sm font-medium"
                                    >
                                        เพิ่มลงตะกร้า
                                    </button>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                    <Link
                                        href={`/admin/foods/${food.id}/edit`}
                                        className="flex items-center gap-1 text-yellow-600 border border-yellow-600 px-3 py-1.5 rounded-lg hover:bg-yellow-600 hover:text-white transition-all text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        แก้ไข
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(food.id)}
                                        className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        ลบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-10">
                <Footer></Footer>
            </div>
        </div>
    );
}
