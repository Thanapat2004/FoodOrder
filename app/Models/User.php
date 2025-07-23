<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // เพิ่ม role เพื่อแยก Admin และ Customer
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [ // เปลี่ยนจากฟังก์ชันเป็น property
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * ความสัมพันธ์กับ Order (One-to-Many)
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * ตรวจสอบว่า User เป็น Admin หรือไม่
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * ตรวจสอบว่า User เป็น Customer ธรรมดาหรือไม่
     */
    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    /**
     * ตรวจสอบว่า User เป็น User ธรรมดาหรือไม่ (เพื่อ backward compatibility)
     */
    public function isUser()
    {
        return $this->role === 'customer' || $this->role === 'user';
    }
}
