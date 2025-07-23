<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'food_id',
        'order_item_id',
        'rating',
        'comment',
        'images',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
    ];

    /**
     * รีวิวนี้เป็นของผู้ใช้คนไหน
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * รีวิวนี้เป็นของอาหารอะไร
     */
    public function food()
    {
        return $this->belongsTo(Food::class);
    }

    /**
     * รีวิวนี้เป็นของ order item ไหน
     */
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * ดึงข้อมูล order ผ่าน order_item
     */
    public function order()
    {
        return $this->hasOneThrough(Order::class, OrderItem::class, 'id', 'id', 'order_item_id', 'order_id');
    }
}
