<?php

namespace Database\Factories;

use App\Models\Food;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class FoodFactory extends Factory
{
    protected $model = Food::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'ข้าวผัด', 'ต้มยำกุ้ง', 'ผัดไทย', 'ส้มตำ', 'แกงเขียวหวาน', 'ไก่ทอด', 
                'ข้าวเหนียวมะม่วง', 'ชานมไข่มุก', 'น้ำผลไม้ปั่น',   'เค้กช็อกโกแลต'
            ]),
            'description' => fake()->randomElement([
                'รสชาติเผ็ดจัดจ้าน', 'หอมกลิ่นสมุนไพร', 'หวานมันกลมกล่อม', 'เนื้อเนียนนุ่มละมุนลิ้น', 
                'สดใหม่ทุกวัน', 'รสชาติแบบต้นตำรับไทยแท้', 'กรอบนอกนุ่มใน', 'รสชาติกลมกล่อม', 'หวานหอมละมุน'
            ]),
            'price' => fake()->randomFloat(2, 20, 500),
            'category_id' => Category::factory(),
        ];
    }
}
