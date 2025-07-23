<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
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
    Route::get('/food/{food}', [FoodController::class, 'show'])->name('food.show');
    Route::get('/Food/Addtocart', [FoodController::class, 'create'])->name('food.addtocart');
    Route::post('/orders', [FoodController::class, 'storeOrder'])->name('orders.store');
    Route::get('/status', [FoodController::class, 'orderStatus'])->name('order.status');
    Route::get('/status/{order}', [FoodController::class, 'orderStatus'])->name('order.status.show');
    
    // Review routes
    Route::get('/foods/{food}/reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('/order-items/{orderItem}/reviews/create', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('/order-items/{orderItem}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/reviews/reviewable', [ReviewController::class, 'reviewableItems'])->name('reviews.reviewable');
    Route::get('/reviews/my-reviews', [ReviewController::class, 'myReviews'])->name('reviews.my');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
    
});
Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    // Food management routes
    Route::get('/admin/foods', [FoodController::class, 'adminIndex'])->name('admin.foods.index');
    Route::get('/admin/foods/Create', [FoodController::class, 'adminCreate'])->name('admin.foods.create');
    Route::post('/admin/foods', [FoodController::class, 'store'])->name('admin.foods.store'); 
    Route::get('/admin/foods/{food}/edit', [FoodController::class, 'edit'])->name('admin.foods.edit');
    Route::put('/admin/foods/{food}', [FoodController::class, 'update'])->name('admin.foods.update');
    Route::delete('/admin/foods/{food}', [FoodController::class, 'destroy'])->name('admin.foods.destroy');
    
    // Order management routes
    Route::get('/admin/OrderStatus', [FoodController::class, 'adminOrderStatus'])->name('admin.orders.index');
    Route::put('/admin/OrderStatus/{order}', [FoodController::class, 'updateOrderStatus'])->name('admin.orders.update');
    
    // User management routes
    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/admin/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/admin/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::patch('/admin/users/{user}/toggle-role', [UserController::class, 'toggleRole'])->name('admin.users.toggle-role');
    Route::patch('/admin/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('admin.users.reset-password');
});


require __DIR__.'/auth.php';
