<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Food;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * แสดงรายการรีวิวของอาหาร
     */
    public function index(Food $food)
    {
        $reviews = Review::with(['user', 'food'])
            ->where('food_id', $food->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->total();
        
        // คำนวณจำนวนดาวแต่ละระดับ
        $ratingCounts = [];
        for ($i = 1; $i <= 5; $i++) {
            $ratingCounts[$i] = Review::where('food_id', $food->id)
                ->where('rating', $i)
                ->count();
        }

        return Inertia::render('Food/Reviews', [
            'food' => $food,
            'reviews' => $reviews,
            'averageRating' => round($averageRating, 1),
            'totalReviews' => $totalReviews,
            'ratingCounts' => $ratingCounts
        ]);
    }

    /**
     * แสดงฟอร์มสร้างรีวิว
     */
    public function create(OrderItem $orderItem)
    {
        // ตรวจสอบว่าผู้ใช้เป็นเจ้าของ order item นี้
        if ($orderItem->order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // ตรวจสอบว่าได้รีวิวแล้วหรือยัง
        $existingReview = Review::where('order_item_id', $orderItem->id)->first();
        if ($existingReview) {
            return redirect()->route('reviews.reviewable')->with('error', 'คุณได้รีวิวสินค้านี้แล้ว');
        }

        return Inertia::render('Reviews/Create', [
            'orderItem' => $orderItem->load(['food', 'order'])
        ]);
    }

    /**
     * บันทึกรีวิวใหม่
     */
    public function store(Request $request, OrderItem $orderItem)
    {
        // ตรวจสอบสิทธิ์
        if ($orderItem->order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // ตรวจสอบว่าได้รีวิวแล้วหรือยัง
        $existingReview = Review::where('order_item_id', $orderItem->id)->first();
        if ($existingReview) {
            return redirect()->back()->with('error', 'คุณได้รีวิวสินค้านี้แล้ว');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = $path;
            }
        }

        Review::create([
            'user_id' => Auth::id(),
            'food_id' => $orderItem->food_id,
            'order_item_id' => $orderItem->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'images' => $imagePaths
        ]);

        return redirect()->route('reviews.reviewable')->with('success', 'ขอบคุณสำหรับรีวิว!');
    }

    /**
     * แสดงรีวิวที่สามารถเขียนได้
     */
    public function reviewableItems()
    {
        $orderItems = OrderItem::with(['food', 'order'])
            ->whereHas('order', function($query) {
                $query->where('user_id', Auth::id())
                      ->where('status', 'delivered'); // เฉพาะออเดอร์ที่ส่งแล้ว
            })
            ->whereDoesntHave('review') // ที่ยังไม่ได้รีวิว
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Reviews/Reviewable', [
            'orderItems' => $orderItems
        ]);
    }

    /**
     * แสดงรีวิวของผู้ใช้
     */
    public function myReviews()
    {
        $reviews = Review::with(['food', 'orderItem.order'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Reviews/MyReviews', [
            'reviews' => $reviews
        ]);
    }

    /**
     * อัปเดตรีวิว
     */
    public function update(Request $request, Review $review)
    {
        // ตรวจสอบสิทธิ์
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = $review->images ?? [];
        
        if ($request->hasFile('images')) {
            // ลบรูปเก่า
            foreach ($review->images ?? [] as $oldPath) {
                Storage::disk('public')->delete($oldPath);
            }
            
            // อัปโหลดรูปใหม่
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $imagePaths[] = $path;
            }
        }

        $review->update([
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'images' => $imagePaths
        ]);

        return redirect()->back()->with('success', 'อัปเดตรีวิวเรียบร้อยแล้ว!');
    }

    /**
     * ลบรีวิว
     */
    public function destroy(Review $review)
    {
        // ตรวจสอบสิทธิ์
        if ($review->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        // ลบรูปภาพ
        foreach ($review->images ?? [] as $imagePath) {
            Storage::disk('public')->delete($imagePath);
        }

        $review->delete();

        return redirect()->back()->with('success', 'ลบรีวิวเรียบร้อยแล้ว');
    }
}
