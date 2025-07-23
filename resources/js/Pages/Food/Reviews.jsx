import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import { Footer } from '@/Components/Footer';
import StarRating from '@/Components/StarRating';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import '@fontsource/noto-sans-thai';

export default function Reviews({ food, reviews, averageRating, totalReviews, ratingCounts }) {
    const [selectedRating, setSelectedRating] = useState(null);

    const filteredReviews = selectedRating 
        ? reviews.data.filter(review => review.rating === selectedRating)
        : reviews.data;

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
            <Head title={`รีวิว ${food.name}`} />

            {/* Content Container */}
            <div className="container mx-auto p-8 pt-24">
                {/* Food Info Header */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6 flex items-center space-x-4">
                        <img 
                            src={food.image ? `/storage/${food.image}` : '/images/no-image.png'} 
                            alt={food.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{food.name}</h1>
                            <p className="text-gray-600">{food.description}</p>
                            <p className="text-2xl font-bold text-orange-600">฿{food.price}</p>
                        </div>
                    </div>
                </div>

                {/* Rating Summary */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">คะแนนและรีวิว</h2>
                        
                        <div className="flex items-center space-x-8">
                            {/* Overall Rating */}
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-600 mb-2">
                                    {averageRating || 0}
                                </div>
                                <div className="flex justify-center mb-2">
                                    <StarRating rating={Math.round(averageRating)} />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {totalReviews} รีวิว
                                </div>
                            </div>

                            {/* Rating Breakdown */}
                            <div className="flex-1">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className="flex items-center mb-2">
                                        <div className="flex items-center space-x-1 w-16">
                                            <span className="text-sm">{rating}</span>
                                            <StarIcon className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-orange-400 h-2 rounded-full"
                                                    style={{ 
                                                        width: `${totalReviews > 0 ? (ratingCounts[rating] / totalReviews) * 100 : 0}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 w-12">
                                            {ratingCounts[rating] || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="mt-6 flex space-x-2">
                            <button
                                onClick={() => setSelectedRating(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedRating === null
                                        ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                ทั้งหมด ({totalReviews})
                            </button>
                            {[5, 4, 3, 2, 1].map(rating => (
                                ratingCounts[rating] > 0 && (
                                    <button
                                        key={rating}
                                        onClick={() => setSelectedRating(rating)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedRating === rating
                                                ? 'bg-orange-100 text-orange-800 border-2 border-orange-300'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {rating} ดาว ({ratingCounts[rating]})
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            รีวิวจากลูกค้า {selectedRating && `(${selectedRating} ดาว)`}
                        </h3>

                        {filteredReviews.length > 0 ? (
                            <div className="space-y-6">
                                {filteredReviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        {/* Review Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <span className="text-orange-600 font-semibold">
                                                        {review.user.name.charAt(0).toUpperCase()}
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
                                            <StarRating rating={review.rating} size="w-4 h-4" />
                                        </div>

                                        {/* Review Content */}
                                        {review.comment && (
                                            <p className="text-gray-700 mb-3 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        )}

                                        {/* Review Images */}
                                        {review.images && review.images.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                                {review.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={`/storage/${image}`}
                                                        alt={`รีวิวรูปที่ ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                                                        onClick={() => window.open(`/storage/${image}`, '_blank')}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">
                                    <StarOutlineIcon className="w-12 h-12 mx-auto mb-4" />
                                </div>
                                <p className="text-gray-500">
                                    {selectedRating 
                                        ? `ไม่มีรีวิว ${selectedRating} ดาว`
                                        : 'ยังไม่มีรีวิวสำหรับสินค้านี้'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to Food */}
                <div className="mt-6 text-center">
                    <Link
                        href={`/food/${food.id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        กลับไปหน้าสินค้า
                    </Link>
                </div>
                
                <Footer />
            </div>
        </div>
    );
}
