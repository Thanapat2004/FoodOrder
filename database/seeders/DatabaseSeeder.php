<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Food;
use Faker\Factory as Faker;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Category::factory(5)->create()->each(function ($category) {
        //     Food::factory(10)->create(['category_id' => $category->id]);
        // });
        // Seed admin user and test users
        $this->call(AdminUserSeeder::class);
        
        Food::all()->each(function ($food) {
            static $faker = null;
            $faker = $faker ?? Faker::create(); // ใช้ static เพื่อให้สร้าง Faker แค่ครั้งเดียว
            $food->update(['sales_count' => $faker->numberBetween(1, 600)]);
        });
        
    }
}
