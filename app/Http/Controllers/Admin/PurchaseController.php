<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display all purchases with user and food information
     */
    public function index(Request $request)
    {
        $query = OrderItem::with(['order.user', 'food', 'review'])
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'completed')
            ->select('order_items.*');

        // Filter by user if specified
        if ($request->has('user_id') && $request->user_id) {
            $query->where('orders.user_id', $request->user_id);
        }

        // Filter by food if specified
        if ($request->has('food_id') && $request->food_id) {
            $query->where('order_items.food_id', $request->food_id);
        }

        // Search by user name or food name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('order.user', function($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhereHas('food', function($foodQuery) use ($search) {
                    $foodQuery->where('name', 'like', "%{$search}%");
                });
            });
        }

        $purchases = $query->orderBy('order_items.created_at', 'desc')
                          ->paginate(20);

        return Inertia::render('Admin/Purchases/Index', [
            'purchases' => $purchases,
            'filters' => $request->only(['user_id', 'food_id', 'search'])
        ]);
    }

    /**
     * Show detailed purchase information
     */
    public function show(OrderItem $orderItem)
    {
        $orderItem->load(['order.user', 'food', 'review']);
        
        return Inertia::render('Admin/Purchases/Show', [
            'purchase' => $orderItem
        ]);
    }

    /**
     * Create or update a review for a purchase
     */
    public function storeReview(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Check if review already exists
        $review = Review::where('order_item_id', $orderItem->id)->first();

        if ($review) {
            // Update existing review
            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment
            ]);
        } else {
            // Create new review
            Review::create([
                'user_id' => $orderItem->order->user_id,
                'food_id' => $orderItem->food_id,
                'order_item_id' => $orderItem->id,
                'rating' => $request->rating,
                'comment' => $request->comment
            ]);
        }

        return redirect()->back()->with('success', 'Review saved successfully!');
    }

    /**
     * Delete a review
     */
    public function destroyReview(OrderItem $orderItem)
    {
        $review = Review::where('order_item_id', $orderItem->id)->first();
        
        if ($review) {
            $review->delete();
            return redirect()->back()->with('success', 'Review deleted successfully!');
        }

        return redirect()->back()->with('error', 'Review not found!');
    }

    /**
     * Get statistics about purchases and reviews
     */
    public function statistics()
    {
        $stats = [
            'total_purchases' => OrderItem::whereHas('order', function($q) {
                $q->where('status', 'completed');
            })->count(),
            'total_reviews' => Review::count(),
            'average_rating' => Review::avg('rating'),
            'top_rated_foods' => Review::selectRaw('food_id, AVG(rating) as avg_rating, COUNT(*) as review_count')
                ->with('food')
                ->groupBy('food_id')
                ->having('review_count', '>=', 3)
                ->orderBy('avg_rating', 'desc')
                ->limit(10)
                ->get(),
            'recent_reviews' => Review::with(['user', 'food', 'orderItem'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
        ];

        return Inertia::render('Admin/Purchases/Statistics', [
            'statistics' => $stats
        ]);
    }
}
