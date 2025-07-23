import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import { Footer } from '@/Components/Footer';
import StarRating from '@/Components/StarRating';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import '@fontsource/noto-sans-thai';

export default function CreateReview({ orderItem }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        rating: 0,
        comment: '',
        images: []
    });

    const handleRatingClick = (star) => {
        setRating(star);
        setData('rating', star);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + selectedImages.length > 5) {
            alert('สามารถอัปโหลดรูปได้สูงสุด 5 รูป');
            return;
        }

        const newImages = [...selectedImages, ...files];
        const newPreviews = [...previewUrls];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                setPreviewUrls([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages(newImages);
        setData('images', newImages);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setPreviewUrls(newPreviews);
        setData('images', newImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('กรุณาให้คะแนน');
            return;
        }

        post(route('reviews.store', orderItem.id), {
            forceFormData: true
        });
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const star = index + 1;
            return (
                <button
                    key={index}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-colors"
                >
                    {(hoverRating || rating) >= star ? (
                        <StarIcon className="w-8 h-8 text-yellow-400 hover:text-yellow-500" />
                    ) : (
                        <StarOutlineIcon className="w-8 h-8 text-gray-300 hover:text-yellow-300" />
                    )}
                </button>
            );
        });
    };

    const getRatingText = (rating) => {
        const texts = {
            1: 'แย่มาก',
            2: 'ไม่ค่อยดี',
            3: 'ปานกลาง',
            4: 'ดี',
            5: 'ดีมาก'
        };
        return texts[rating] || '';
    };

    return (
        <div className="font-['Noto_Sans_Thai'] min-h-screen">
            <LoggedInNavbar />
            <Head title="เขียนรีวิว" />

            {/* Content Container */}
            <div className="container mx-auto p-8 pt-24">
                <div className="max-w-2xl mx-auto">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">เขียนรีวิว</h1>

                        {/* Product Info */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                            <img 
                                src={orderItem.food.image ? `/storage/${orderItem.food.image}` : '/images/no-image.png'}
                                alt={orderItem.food.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{orderItem.food.name}</h3>
                                <p className="text-sm text-gray-600">{orderItem.food.description}</p>
                                <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-sm text-gray-500">จำนวน: {orderItem.quantity}</span>
                                    <span className="text-sm font-medium text-orange-600">฿{orderItem.price}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    ให้คะแนนสินค้านี้ *
                                </label>
                                <div className="flex items-center space-x-2 mb-2">
                                    {renderStars()}
                                    {rating > 0 && (
                                        <span className="ml-4 text-lg font-medium text-orange-600">
                                            {getRatingText(rating)}
                                        </span>
                                    )}
                                </div>
                                {errors.rating && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                                )}
                            </div>

                            {/* Comment Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    แสดงความคิดเห็น (ไม่บังคับ)
                                </label>
                                <textarea
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 resize-none"
                                    placeholder="แบ่งปันประสบการณ์ของคุณเกี่ยวกับสินค้านี้..."
                                    maxLength={1000}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {data.comment.length}/1000
                                </div>
                                {errors.comment && (
                                    <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                                )}
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    เพิ่มรูปภาพ (ไม่บังคับ)
                                </label>
                                <p className="text-sm text-gray-500 mb-3">
                                    อัปโหลดได้สูงสุด 5 รูป (ขนาดไม่เกิน 2MB ต่อรูป)
                                </p>

                                {/* Image Previews */}
                                {previewUrls.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                {selectedImages.length < 5 && (
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">คลิกเพื่อเลือกรูปภาพ</p>
                                            <p className="text-xs text-gray-400">PNG, JPG, GIF (สูงสุด 2MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}

                                {errors.images && (
                                    <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || rating === 0}
                                    className="px-6 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'กำลังส่ง...' : 'ส่งรีวิว'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <Footer />
                </div>
            </div>
        </div>
    );
}
