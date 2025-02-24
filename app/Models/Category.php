<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    // อนุญาตให้กรอกข้อมูลในฟิลด์เหล่านี้ได้
    protected $fillable = ['name'];

    // ความสัมพันธ์: Category -> Food (One-to-Many)
    public function foods()
    {
        return $this->hasMany(Food::class);
    }
}
