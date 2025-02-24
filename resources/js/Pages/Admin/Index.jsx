import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/inertia-react";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import { Inertia } from "@inertiajs/inertia";
import { Carousel, Typography } from "@material-tailwind/react";
import{Footer} from "@/Components/Footer";
import { route } from "ziggy-js";

import "@fontsource/noto-sans-thai";

export default function Index({ foods = [], categories = [] }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleAddToCart = (food) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = [...cart, food];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`);
    };

    const handleDelete = (foodId) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            Inertia.delete(route("admin.foods.destroy", foodId));
        }
    };

    const filteredFoods = foods.filter(
        (food) =>
            food.name.includes(search) &&
            (selectedCategory === "" ||
                food.category?.id === parseInt(selectedCategory))
    );

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
            <LoggedInNavbar></LoggedInNavbar>
            <br />
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    ระบบการจัดการอาหาร
                </h1>
                <div className="flex gap-4">
                    <Link
                        href={route("admin.foods.create")}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition"
                    >
                        สร้างเมนูอาหาร
                    </Link>
                    <Link
                        href={route("admin.orders.index")}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition"
                    >
                        จัดการคำสั่งซื้อ
                    </Link>
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
                        className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden"
                    >
                        {food.image_url && (
                            <img
                                src={food.image_url}
                                alt={food.name}
                                className="w-full h-40 object-cover rounded-t-lg mb-3"
                            />
                        )}
                        <div className="p-3">
                            <h2 className="text-xl font-semibold mb-1 text-gray-900">
                                {food.name}
                            </h2>
                            <p className="text-gray-600 mb-1 line-clamp-2">
                                {food.description}
                            </p>
                            <p className="text-gray-500 mb-1">
                                หมวดหมู่:{" "}
                                {food.category?.name || "ไม่มีหมวดหมู่"}
                            </p>
                            <p className="text-green-500 font-bold mb-4">
                                THB: {food.price} ฿
                            </p>

                            <div className="flex justify-between items-center mb-2">
                                <Link
                                    href={`/food/${food.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    ดูรายละเอียด
                                </Link>
                                <button
                                    onClick={() => handleAddToCart(food)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md"
                                >
                                    เพิ่มลงในตะกร้า
                                </button>
                            </div>

                            <div className="flex justify-between items-center mt-4 border-t pt-3">
                                <Link
                                    href={`/admin/foods/${food.id}/edit`}
                                    className="text-yellow-500 border border-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-500 hover:text-white transition"
                                >
                                    แก้ไข
                                </Link>
                                <button
                                    onClick={() => handleDelete(food.id)}
                                    className="text-red-500 border border-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition"
                                >
                                    ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10">
            <Footer></Footer>
          </div>
        </div>
    );
}
