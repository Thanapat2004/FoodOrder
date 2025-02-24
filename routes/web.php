<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\CartController;
use App\Http\Middleware\AdminMiddleware;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/welcome', [FoodController::class, 'welcome'])->name('wellcome');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/foods', [FoodController::class, 'index'])->name('foods');
    Route::get('/food/{food}', [FoodController::class, 'show']);
    Route::get('/Food/Addtocart', [FoodController::class, 'create'])->name('food.addtocart');
    Route::post('/orders', [FoodController::class, 'storeOrder'])->name('orders.store');
    Route::get('/status', [FoodController::class, 'orderStatus'])->name('order.status');
    Route::get('/status{order}', [FoodController::class, 'orderStatus'])->name('order.status');
    Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');
    
});
Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/admin/foods', [FoodController::class, 'adminIndex'])->name('admin.foods.index');
    Route::put('/foods/{food}', [FoodController::class, 'update'])->name('foods.update');
    Route::get('/foods/{food}', [FoodController::class, 'show'])->name('foods.show');
    Route::get('/admin/foods/Create', [FoodController::class, 'adminCreate'])->name('admin.foods.create');
    Route::post('/admin/foods', [FoodController::class, 'store'])->name('admin.foods.store'); 
    Route::get('/admin/foods/{food}/edit', [FoodController::class, 'edit'])->name('admin.foods.edit');
    Route::put('/admin/foods/{food}', [FoodController::class, 'update'])->name('admin.foods.update');
    Route::get('/admin/OrderStatus', [FoodController::class, 'adminOrderStatus'])->name('admin.orders.index');
    Route::put('/admin/OrderStatus/{order}', [FoodController::class, 'updateOrderStatus'])->name('admin.orders.update');
    Route::delete('/admin/foods/{food}', [FoodController::class, 'destroy'])->name('admin.foods.destroy');
});


require __DIR__.'/auth.php';
