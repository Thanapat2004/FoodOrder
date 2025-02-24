import React from "react";
import { Link, useForm } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from '@inertiajs/inertia';
import { route } from 'ziggy-js';

import '@fontsource/noto-sans-thai';

export default function Index({ foods }) {
    const { delete: destroy } = useForm();

    const handleAddToCart = (food) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = [...cart, food];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`);
    };

    const handleDelete = (foodId) => {
        if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
            Inertia.delete(route('admin.foods.destroy', foodId));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">ระบบการจัดการ</h1>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                    {foods.map((food) => (
                        <div key={food.id} className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow bg-white">
                            <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
                            <p className="text-gray-600 mb-2">{food.description}</p>
                            <p className="text-gray-600 mb-2">หมวดหมู่: {food.category?.name || 'ไม่มีหมวดหมู่'}</p>
                            <p className="text-green-500 font-bold mb-4">THB: {food.price} ฿</p>

                            <div className="flex justify-between items-center mb-2">
                                <Link href={`/food/${food.id}`} className="text-blue-500 hover:underline">
                                    ดูรายละเอียด
                                </Link>
                                <button 
                                    onClick={() => handleAddToCart(food)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    เพิ่มลงในตะกร้า
                                </button>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <Link 
                                    href={`/admin/foods/${food.id}/edit`} 
                                    className="text-yellow-500 border border-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-500 hover:text-white"
                                >
                                    แก้ไข
                                </Link>
                                <button 
                                    onClick={() => handleDelete(food.id)}
                                    className="text-red-500 border border-red-500 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white"
                                >
                                    ลบ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
