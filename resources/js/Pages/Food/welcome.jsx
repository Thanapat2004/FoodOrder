import React, { useEffect } from "react";
import { Carousel, Typography } from "@material-tailwind/react";
import { Link } from "@inertiajs/inertia-react";
import { GuestNavbar } from "@/Components/GuestNavbar";
import "@fontsource/noto-sans-thai";

import AOS from "aos";
import "aos/dist/aos.css"; // นำเข้า CSS ของ AOS

export default function Welcome({ foods }) {
    console.log("Foods:", foods);
    const topSellingFoods = [...foods]
        .sort((a, b) => b.sales_count - a.sales_count)
        .slice(0, 4);

    useEffect(() => {
        AOS.init({ duration: 1000 }); // กำหนดเวลาในการเคลื่อนไหว
    }, []);

    return (
        
        <div className="container mx-auto p-8 mt-12">
            <GuestNavbar />
            {/* Carousel Section */}
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

            {/* Best-Selling Menu */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-2 text-[#48B85C]">
                    เมนูขายดี
                </h2>
                <div className="space-y-6">
                    {topSellingFoods.map((food, index) => (
                        <div
                            key={food.id}
                            data-aos="fade-up" // ใช้เอฟเฟกต์ fade-up
                            className={`flex flex-col md:flex-row items-center gap-6 border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white ${
                                index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            <div className="w-full md:w-1/2 h-60">
                                <img
                                    src={food.image_url}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-6">
                                <Typography variant="h5" className="font-bold text-[#48B85C]">
                                    อันดับที่ {index + 1}
                                </Typography>
                                <Typography variant="h6" className="mt-2 mb-2 font-bold">
                                    {food.name}
                                </Typography>
                                <Typography className="text-gray-600 mb-2">
                                    {food.description}
                                </Typography>
                                <Typography className="text-[#48B85C] font-bold mb-4">
                                    THB: {food.price} ฿
                                </Typography>
                                <Link
                                    href={`/food/${food.id}`}
                                    className="text-[#3B82EB] hover:text-[#48B85C] hover:underline transition-all duration-300"
                                >
                                    ดูรายละเอียด
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
            
        </div>
        
    );
}
