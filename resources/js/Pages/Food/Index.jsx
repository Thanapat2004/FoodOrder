import React, { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import "@fontsource/noto-sans-thai";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ foods }) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderStatus = cart.length > 0 
        ? 'คำสั่งซื้อของคุณยังไม่ได้สั่งซื้อ'
        : 'ไม่มีคำสั่งซื้อ'; // คำนวณสถานะจากจำนวนสินค้าในตะกร้า

    const handleAddToCart = (food) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === food.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...food, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`);
    };

    const handleOrder = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            alert('สั่งซื้อเรียบร้อย!');
            localStorage.removeItem('cart');
        } else {
            alert('กรุณาเพิ่มสินค้าในตะกร้าก่อนทำการสั่งซื้อ');
        }
    };

    return (
        <AuthenticatedLayout>
            <div style={{ fontFamily: "Noto Sans Thai, sans-serif" }} className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Food Menu</h1>
                    <hr className="border-t border-gray-300 mt-4 mb-4" />
                    <div className="flex gap-4">
                        <Link href="/Food/Addtocart" className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
                            ไปที่ตะกร้าสินค้า
                        </Link>
                        {/* เปลี่ยนปุ่มสถานะการสั่งซื้อให้ไปหน้า OrderStatus */}
                        <Link 
                            href="/status"  // เปลี่ยนเป็น route ของหน้าสถานะการสั่งซื้อ
                            className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
                            {orderStatus}
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {foods.map((food) => (
                        <div key={food.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white">
                            <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
                            <p className="text-gray-600 mb-2">{food.description}</p>
                            <p className="text-gray-600 mb-2">หมวดหมู่: {food.category.name}</p>
                            <p className="text-green-500 font-bold mb-4">THB: {food.price} ฿</p>
                            <div className="flex justify-between items-center">
                                <Link href={`/food/${food.id}`} className="text-blue-500 hover:underline">ดูรายละเอียด</Link>
                                <button
                                    onClick={() => handleAddToCart(food)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    เพิ่มลงในตะกร้า
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
