import React from "react";
import { Link } from "@inertiajs/inertia-react";
import '@fontsource/noto-sans-thai'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


export default function Show({ food }) {
    return (
        <AuthenticatedLayout>
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{food.name}</h1>
                <Link href="/foods" className="text-white bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600">
                    กลับไปที่เมนู
                </Link>
            </div>
            <div className="border rounded-lg p-4 shadow-lg">
                <p className="text-gray-600 mb-2">{food.description}</p>
                <p className="text-gray-600 mb-2">หมวดหมู่: {food.category.name}</p>
                <p className="text-green-500 font-bold mb-4">ราคา: {food.price} ฿</p>
                <button 
                    onClick={() => alert(`${food.name} ถูกเพิ่มในตะกร้าแล้ว!`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    เพิ่มลงในตะกร้า
                </button>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
