import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import "@fontsource/noto-sans-thai";
import { Footer } from "@/Components/Footer";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";
import StarRating from "@/Components/StarRating";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import {
    PencilIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function Show({
    food,
    user,
    recentReviews,
    averageRating,
    totalReviews,
    ratingCounts,
    canReview,
    reviewableOrderItems,
}) {
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        comment: "",
        images: [],
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!selectedOrderItem) return;

        const formData = new FormData();
        formData.append("rating", data.rating);
        formData.append("comment", data.comment);

        if (data.images && data.images.length > 0) {
            Array.from(data.images).forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
        }

        post(`/order-items/${selectedOrderItem.id}/reviews`, {
            data: formData,
            onSuccess: () => {
                setShowWriteReview(false);
                setSelectedOrderItem(null);
                reset();
            },
        });
    };

    const startWriteReview = (orderItem) => {
        setSelectedOrderItem(orderItem);
        setShowWriteReview(true);
    };

    return (
        <div className="font-['Noto_Sans_Thai'] min-h-screen">
            <LoggedInNavbar />

            {/* Content Container */}
            <div className="container mx-auto p-6 pt-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    {food.name}
                </h1>
                <Link
                    href="/foods"
                    className="text-white bg-gray-700 px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300 shadow-md"
                >
                    กลับไปที่เมนู
                </Link>
            </div>

            {/* Food Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                <div className="bg-white rounded-xl p-8 shadow-2xl">
                    <img
                        src={`/storage/${food.image}`}
                        alt={food.name}
                        className="w-full h-[400px] object-cover rounded-xl shadow-xl border"
                    />
                </div>

                <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col justify-center space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            รายละเอียดสินค้า
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            {food.description}
                        </p>
                        <p className="text-gray-600 text-lg mb-4">
                            หมวดหมู่:{" "}
                            <span className="font-semibold text-gray-800">
                                {food.category.name}
                            </span>
                        </p>
                        <p className="text-green-500 text-4xl font-bold mb-6">
                            ฿{food.price}
                        </p>
                    </div>

                    {/* Rating Summary */}
                    <div className="border-t pt-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <StarRating
                                    rating={Math.round(averageRating)}
                                />
                                <span className="text-2xl font-bold text-orange-600">
                                    {averageRating}
                                </span>
                                <span className="text-gray-600">
                                    ({totalReviews} รีวิว)
                                </span>
                            </div>
                        </div>

                        {totalReviews > 0 && (
                            <Link
                                href={`/foods/${food.id}/reviews`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-1" />
                                ดูรีวิวทั้งหมด
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Actions */}
            {user && canReview && (
                <div className="bg-white rounded-xl p-6 shadow-xl mb-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        เขียนรีวิว
                    </h3>
                    <p className="text-gray-600 mb-4">
                        คุณสามารถเขียนรีวิวสำหรับสินค้าที่ได้รับแล้ว
                    </p>
                    <div className="space-y-2">
                        {reviewableOrderItems.map((orderItem) => (
                            <button
                                key={orderItem.id}
                                onClick={() => startWriteReview(orderItem)}
                                className="flex items-center space-x-2 bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg transition-colors"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span>
                                    เขียนรีวิวสำหรับออเดอร์ #
                                    {orderItem.order.id}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Write Review Modal */}
            {showWriteReview && selectedOrderItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">เขียนรีวิว</h3>
                        <form onSubmit={handleSubmitReview}>
                            {/* Rating */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    คะแนน
                                </label>
                                <div className="flex space-x-1">
                                    <StarRating
                                        rating={data.rating}
                                        size="w-8 h-8"
                                        interactive={true}
                                        onStarClick={(rating) =>
                                            setData("rating", rating)
                                        }
                                    />
                                </div>
                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.rating}
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ความคิดเห็น
                                </label>
                                <textarea
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData("comment", e.target.value)
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="แบ่งปันประสบการณ์ของคุณ..."
                                />
                                {errors.comment && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>

                            {/* Images */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    รูปภาพ (ไม่บังคับ)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("images", e.target.files)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    สามารถเลือกได้สูงสุด 5 รูป
                                </p>
                                {errors.images && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.images}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? "กำลังส่ง..." : "ส่งรีวิว"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowWriteReview(false);
                                        setSelectedOrderItem(null);
                                        reset();
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Recent Reviews */}
            {recentReviews.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-xl mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            รีวิวล่าสุด
                        </h3>
                        {totalReviews > 5 && (
                            <Link
                                href={`/foods/${food.id}/reviews`}
                                className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                            >
                                ดูทั้งหมด ({totalReviews} รีวิว)
                            </Link>
                        )}
                    </div>

                    <div className="space-y-6">
                        {recentReviews.map((review) => (
                            <div
                                key={review.id}
                                className="border-b border-gray-200 pb-6 last:border-b-0"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <span className="text-orange-600 font-semibold">
                                                {review.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {review.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(review.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <StarRating
                                        rating={review.rating}
                                        size="w-4 h-4"
                                    />
                                </div>

                                {review.comment && (
                                    <p className="text-gray-700 mb-3 leading-relaxed">
                                        {review.comment}
                                    </p>
                                )}

                                {review.images && review.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {review.images
                                            .slice(0, 4)
                                            .map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`/storage/${image}`}
                                                    alt={`รีวิวรูปที่ ${
                                                        index + 1
                                                    }`}
                                                    className="w-full h-20 object-cover rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                                                    onClick={() =>
                                                        window.open(
                                                            `/storage/${image}`,
                                                            "_blank"
                                                        )
                                                    }
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Reviews State */}
            {totalReviews === 0 && (
                <div className="bg-white rounded-xl p-8 shadow-xl mb-10 text-center">
                    <StarOutlineIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        ยังไม่มีรีวิว
                    </h3>
                    <p className="text-gray-500">เป็นคนแรกที่รีวิวสินค้านี้</p>
                </div>
            )}

                <Footer />
            </div>
        </div>
    );
}
