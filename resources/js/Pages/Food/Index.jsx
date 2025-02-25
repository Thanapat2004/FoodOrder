import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Carousel,
} from "@material-tailwind/react";

import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/inertia-react";
import "@fontsource/noto-sans-thai";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import {Footer} from "@/Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Index({ foods }) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderStatus = cart.length > 0 
        ? 'คำสั่งซื้อของคุณยังไม่ได้สั่งซื้อ'
        : 'ไม่มีคำสั่งซื้อ';

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

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const topSellingFoods = [...foods]
        .sort((a, b) => b.sales_count - a.sales_count)
        .slice(0, 4);

    const allCategories = [
        "ทั้งหมด",
        ...Array.from(new Set(foods.map(food => food.category?.name || "อื่น ๆ")))
    ];

    const filteredFoods = foods.filter(food => 
        food.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "ทั้งหมด" || food.category?.name === selectedCategory)
    );

    const categorizedFoods = filteredFoods.reduce((acc, food) => {
        const category = food.category?.name || "อื่น ๆ";
        if (!acc[category]) acc[category] = [];
        acc[category].push(food);
        return acc;
    }, {});

    return (
        <div 
            
            className="container mx-auto p-8 min-h-screen"
        >
            <LoggedInNavbar />
            <br />
            <Carousel className="rounded-xl mb-10" data-aos="fade-up">
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

            <div className="flex justify-between items-center mb-10" data-aos="fade-up">
                <h1 className="text-2xl font-bold mb-auto mt-[-10px]">เมนูอาหาร</h1>
                <div className="flex gap-4">
                    <Link
                        href="/Food/Addtocart"
                        className="text-white bg-green-500 px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transform transition-all hover:scale-105"
                    >
                        ไปที่ตะกร้าสินค้า
                    </Link>
                    <Link
                        href="/status"
                        className="text-white bg-red-500 px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transform transition-all hover:scale-105"
                    >
                        {orderStatus}
                    </Link>
                </div>
            </div>

            <div className="mb-8" data-aos="fade-up">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">สินค้าขายดี 4 อันดับ</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {topSellingFoods.map((food, index) => (
                        <Card 
                            key={food.id} 
                            className="shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 bg-white"
                            data-aos="zoom-in"
                        >
                            <CardHeader floated={false} className="relative h-40">
                                {food.image_url && (
                                    <img
                                        src={food.image_url}
                                        alt={food.name}
                                        className="w-full h-full object-cover rounded-t-lg"
                                    />
                                )}
                            </CardHeader>
                            <CardBody>
                                <div className="flex justify-between items-center mb-2">
                                    <Typography variant="h6" className="font-bold">
                                        {index + 1}. {food.name}
                                    </Typography>
                                    <Typography variant="small" className="bg-red-500 text-white px-2 py-1 rounded-lg">
                                        ขายดี!
                                    </Typography>
                                </div>
                                <Typography className="text-gray-600 mb-2">
                                    {food.description}
                                </Typography>
                                <Typography className="text-green-500 font-bold mb-4">
                                    THB: {food.price} ฿
                                </Typography>
                                <Typography className="text-gray-400 text-sm font-bold mb-6">
                                    สั่งซื้อแล้ว {food.sales_count}  ครั้ง
                                </Typography>
                            </CardBody>
                            <CardFooter className="flex justify-between items-center">
                                <Link href={`/food/${food.id}`} className="text-blue-500 hover:underline">
                                    ดูรายละเอียด
                                </Link>
                                <Button
                                    color="blue"
                                    onClick={() => handleAddToCart(food)}
                                    className="transform transition-all hover:scale-110"
                                >
                                    เพิ่มลงในตะกร้า
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-6" data-aos="fade-up">
                <input
                    type="text"
                    placeholder="ค้นหาชื่ออาหาร..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-1/3 p-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                >
                    {allCategories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {Object.entries(categorizedFoods).map(([category, foods]) => (
                <div key={category} className="mb-10" data-aos="fade-up">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">{category}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {foods.map((food) => (
                            <Card 
                                key={food.id} 
                                className="shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 bg-white"
                                data-aos="fade-up"
                            >
                                <CardHeader floated={false} className="relative h-40">
                                    {food.image_url && (
                                        <img
                                            src={food.image_url}
                                            alt={food.name}
                                            className="w-full h-full object-cover rounded-t-lg"
                                        />
                                    )}
                                </CardHeader>
                                <CardBody>
                                    <Typography variant="h6" className="mb-2">
                                        {food.name}
                                    </Typography>
                                    <Typography className="text-gray-600 mb-2">
                                        {food.description}
                                    </Typography>
                                    <Typography className="text-green-500 font-bold mb-4">
                                        THB: {food.price} ฿
                                    </Typography>
                                    <Typography className="text-gray-400 text-sm font-bold mb-2">
                                    สั่งซื้อแล้ว {food.sales_count}  ครั้ง
                                </Typography>
                                </CardBody>
                                <CardFooter className="flex justify-between items-center">
                                    <Link href={`/food/${food.id}`} className="text-blue-500 hover:underline">
                                        ดูรายละเอียด
                                    </Link>
                                    <Button
                                        color="blue"
                                        onClick={() => handleAddToCart(food)}
                                        className="transform transition-all hover:scale-110"
                                    >
                                        เพิ่มลงในตะกร้า
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    
                </div>
            ))}
            <Footer />
        </div>
    );
}
