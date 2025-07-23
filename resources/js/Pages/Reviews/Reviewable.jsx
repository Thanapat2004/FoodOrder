import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { StarIcon, PencilIcon } from '@heroicons/react/24/outline';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import { Footer } from '@/Components/Footer';
import '@fontsource/noto-sans-thai';

export default function ReviewableItems({ orderItems }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="font-['Noto_Sans_Thai'] min-h-screen">
            <LoggedInNavbar />
            <Head title="รีวิวสินค้า" />

            {/* Content Container */}
            <div className="container mx-auto p-8 pt-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">เขียนรีวิว</h1>
                <div className="text-lg text-gray-600">
                    สินค้าที่รอรีวิว <span className="text-orange-600 font-semibold">{orderItems.data.length}</span> รายการ
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-6 shadow-xl mb-10">
                {orderItems.data.length > 0 ? (
                    <div className="space-y-6">
                        {orderItems.data.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gray-50">
                                <div className="flex items-center space-x-6">
                                    {/* Food Image */}
                                    <img
                                        src={item.food.image ? `/storage/${item.food.image}` : '/images/no-image.png'}
                                        alt={item.food.name}
                                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                                    />

                                    {/* Food Details */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-xl mb-2">
                                            {item.food.name}
                                        </h3>
                                        <p className="text-gray-600 text-base mb-3 leading-relaxed">
                                            {item.food.description}
                                        </p>
                                        
                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                จำนวน: {item.quantity} ชิ้น
                                            </span>
                                            <span className="font-bold text-green-600 text-lg">
                                                ฿{item.price}
                                            </span>
                                            <span>สั่งเมื่อ: {formatDate(item.created_at)}</span>
                                        </div>

                                        {/* Order Details */}
                                        <div className="text-sm text-gray-500">
                                            Order #{item.order.id} • 
                                            <span className="ml-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                                ✓ ส่งมอบแล้ว
                                            </span>
                                        </div>
                                    </div>

                                    {/* Review Button */}
                                    <div className="flex flex-col items-center">
                                        <Link
                                            href={`/order-items/${item.id}/reviews/create`}
                                            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                            <span>เขียนรีวิว</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {orderItems.links && (
                            <div className="mt-8">
                                <div className="flex justify-center space-x-2">
                                    {orderItems.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-orange-600 text-white shadow-md'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <StarIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">
                            ไม่มีสินค้าที่ต้องรีวิว
                        </h3>
                        <p className="text-gray-500 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                            คุณได้รีวิวสินค้าที่สั่งซื้อหมดแล้ว หรือยังไม่มีสินค้าที่ส่งมอบแล้ว
                        </p>
                        <Link
                            href="/foods"
                            className="inline-flex items-center px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            <StarIcon className="w-5 h-5 mr-2" />
                            สั่งอาหารเลย
                        </Link>
                    </div>
                )}
            </div>

                <Footer />
            </div>
        </div>
    );
}
