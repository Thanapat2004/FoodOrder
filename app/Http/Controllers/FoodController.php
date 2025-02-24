<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\User;
use App\Models\Category;
use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class FoodController extends Controller
{

    // หน้า wellcome
    public function welcome()
    {
        $foods = Food::with('category')->get()->map(function ($food) {
            $food->image_url = $food->image ? asset('storage/' . $food->image) : null;
            return $food;
        });
        return Inertia::render('Food/welcome', ['foods' => $foods]);
    }




    // แสดงเมนูอาหารทั้งหมดสำหรับผู้ใช้ทั่วไป
    public function index()
    {

        $foods = Food::with('category')->get()->map(function ($food) {
            $food->image_url = $food->image ? asset('storage/' . $food->image) : null;
            return $food;
        });
    
        return Inertia::render('Food/Index', ['foods' => $foods]);
    }

    // แสดงหน้าตะกร้าสินค้า
    public function create()
    {
        $foods = Food::with('category')->get();

    // ประกาศ array ของ payment_method
    $paymentMethods = [
        ['id' => 1, 'name' => 'โอนเงินผ่านธนาคาร'],
        ['id' => 2, 'name' => 'ชำระเงินปลายทาง'],
        ['id' => 3, 'name' => 'บัตรเครดิต/เดบิต'],
    ];

    return Inertia::render('Food/Addtocart', [
        'foods' => $foods,
        'paymentMethods' => $paymentMethods // ส่งไปยัง Frontend
    ]);
    }

    // บันทึกคำสั่งซื้อ
    public function storeOrder(Request $request)
    {
        
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:foods,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string'
        ]);
        // รวมสินค้าที่ id ซ้ำกัน
        $cart = collect($validated['cart'])->groupBy('id')->map(function ($group) {
            return [
                'id' => $group->first()['id'],
                'quantity' => $group->sum('quantity')
            ];
        })->values()->all();
        // สร้างคำสั่งซื้อ
        $order = Order::create([
            'user_id' => auth()->id(),
            'total_price' => collect($cart)->sum(function ($item) {
                return Food::find($item['id'])->price * $item['quantity'];
            }),
            'status' => 'pending'
        ]);
        //  บันทึกรายการอาหารในคำสั่งซื้อ (เพิ่ม food_id)
        $order->orderItems()->createMany(
            collect($cart)->map(function ($item) {
                return [
                    'food_id' => $item['id'], //  เพิ่มฟิลด์ food_id
                    'quantity' => $item['quantity'],
                    'price' => Food::find($item['id'])->price
                ];
            })->toArray()
        );
        // บันทึกการชำระเงิน
        $order->payment()->create([
            'amount' => $order->total_price,
            'payment_method' => $validated['payment_method'],
            'status' => 'pending'
        ]);
        return redirect()->route('order.status', $order->id);
    }

    // แสดงรายละเอียดคำสั่งซื้อ
    public function orderStatus(Order $order)
{
    // ตรวจสอบว่า user ที่ล็อกอินเป็น admin หรือไม่
    if (auth()->user()->role === 'admin') {
        // ดึงคำสั่งซื้อทั้งหมดพร้อมข้อมูลอาหารและรูปภาพ
        $orders = Order::with(['orderItems.food:id,name,price,image', 'payment', 'user'])
            ->get();
    } else {
        // ดึงเฉพาะคำสั่งซื้อของผู้ใช้ที่ล็อกอินพร้อมข้อมูลอาหารและรูปภาพ
        $orders = Order::with(['orderItems.food:id,name,price,image', 'payment', 'user'])
            ->where('user_id', auth()->id())
            ->get();
    }

    // ส่งข้อมูลคำสั่งซื้อทั้งหมดไปยัง frontend
    return Inertia::render('Food/Status', [
        'orders' => $orders
    ]);
}

    // แสดงรายละเอียดอาหาร
    public function show(Food $food)
{
    return inertia('Food/Show', [
        'food' => $food->load('category'),
        'user' => auth()->user() // ส่งข้อมูลผู้ใช้ไปด้วย
    ]);
}



    // Admin - บันทึกข้อมูลอาหารใหม่
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $food = Food::create($request->all());
        return redirect()->route('admin.foods.index')->with('success', 'เพิ่มสินค้าเรียบร้อยแล้ว');
    }

    // Admin - อัปเดตสถานะคำสั่งซื้อ
    public function updateOrderStatus(Request $request, Order $order)
    {
        
    // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการอัปเดตสถานะหรือไม่
        if (auth()->user()->role !== 'admin') {
        abort(403);
    }
    // ตรวจสอบค่าของสถานะที่ผู้ใช้ส่งเข้ามา
    $request->validate(['status' => 'required|in:pending,shipped,delivered,canceled',]);
    // อัปเดตสถานะของคำสั่งซื้อ
    $order->update(['status' => $request->status,]);
    // ส่งข้อมูลกลับไปยังหน้าแสดงสถานะคำสั่งซื้อ
    
    return redirect()->route('admin.orders.index', $order->id)->with('success', 'สถานะคำสั่งซื้ออัปเดตเรียบร้อยแล้ว');
}

// แสดงคำสั่งซื้อทั้งหมดสำหรับ Admin
public function adminOrderStatus()
{
    if (auth()->user()->role === 'admin') {
        // ถ้าเป็น admin, ดึงคำสั่งซื้อทั้งหมด
        $orders = Order::with(['orderItems.food', 'payment', 'user'])
            ->get();
    } else {
        // ถ้าเป็นผู้ใช้ทั่วไป, ดึงเฉพาะคำสั่งซื้อของผู้ใช้ที่ล็อกอิน
        $orders = Order::with(['orderItems.food', 'payment', 'user'])
            ->where('user_id', auth()->id())
            ->get();
    }

    // ส่งข้อมูลคำสั่งซื้อทั้งหมดไปยัง frontend
    return Inertia::render('Admin/OrderStatus', [
        'orders' => $orders // ส่งคำสั่งซื้อทั้งหมด
    ]);
}
     // Admin - แสดงหน้าแก้ไขข้อมูลอาหาร
     public function adminIndex()
{
    $foods = Food::with('category')->get()->map(function ($food) {
        $food->image_url = $food->image ? asset('storage/' . $food->image) : null;
        return $food;
    });

    $categories = Category::all(); // ตรวจสอบว่ามีการดึง categories หรือไม่

    return inertia('Admin/Index', [
        'foods' => $foods ?? [],           // ป้องกันกรณี undefined
        'categories' => $categories ?? []  // ป้องกันกรณี undefined
    ]);
}

    // Admin - แก้ไขข้อมูลอาหาร
    public function edit(Food $food)
    {
        $categories = Category::all();
        return Inertia::render('Admin/Edit', ['food' => $food, 'categories' => $categories]);
    }

    public function adminCreate()
{
    $categories = Category::all();
    return Inertia::render('Admin/Create', [
        'categories' => $categories
    ]);
}


    public function update(Request $request, Food $food)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // อัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public'); // เก็บใน storage/app/public/images
            $validated['image'] = $path;
        }
    
        $food->update($validated);
    
        return redirect()->route('admin.foods.index')->with('success', 'อัปเดตเมนูอาหารสำเร็จ');
    }
    
    // Admin - ลบข้อมูลอาหาร
    public function destroy(Food $food)
    {
        $food->delete();
        return redirect()->back()->with('success', 'ลบสินค้าเรียบร้อยแล้ว');
    }


    public function logout()
    {
        Auth::logout(); // ทำการออกจากระบบ
        return redirect('/'); // หรือ redirect ไปที่หน้าอื่น ๆ ที่ต้องการ
    }
}
