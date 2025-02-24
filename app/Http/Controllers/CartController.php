<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

class CartController extends Controller
{
    public function store(Request $request)
    {
        
        // Logic สำหรับเพิ่มสินค้าในตะกร้า
        return back()->with('success', 'Added to cart successfully');
    }
}
