import React from "react";
import { Link } from "@inertiajs/inertia-react";
import '@fontsource/noto-sans-thai';
import { Footer } from "@/Components/Footer";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";

export default function Show({ food }) {
    return (
        <div className="container mx-auto p-8 font-['Noto_Sans_Thai']  min-h-screen">
            <LoggedInNavbar />
            <div className="flex justify-between items-center mb-8 mt-10">
                <h1 className="text-2xl font-extrabold text-gray-800">{food.name}</h1>
                <Link 
                    href="/foods" 
                    className="text-white bg-gray-700 px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300 shadow-md"
                >
                    กลับไปที่เมนู
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border rounded-xl p-8 shadow-2xl bg-white">
                {/* รูปอาหาร */}
                <div className="flex justify-center items-center">
                    <img 
                        src={`/storage/${food.image}`} 
                        alt={food.name} 
                        className="w-full h-[500px] object-cover rounded-xl shadow-xl border"
                    />
                </div>

                {/* รายละเอียดอาหาร */}
                <div className="flex flex-col justify-center space-y-8">
                    <p className="text-gray-700 text-xl leading-relaxed">{food.description}</p>
                    <p className="text-gray-600 text-lg">
                        หมวดหมู่: <span className="font-semibold text-gray-800">{food.category.name}</span>
                    </p>
                    <p className="text-green-500 text-4xl font-bold">฿{food.price}</p>
                </div>
            </div>
            <div className="mt-10">
            <Footer />
            </div>
        </div>
    );
}
