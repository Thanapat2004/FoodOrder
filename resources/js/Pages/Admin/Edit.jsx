import React, { useState } from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { route } from "ziggy-js";
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";


import "@fontsource/noto-sans-thai";

export default function Edit({ food, categories }) {
    const { data, setData, post, errors } = useForm({
        name: food.name,
        description: food.description,
        price: food.price,
        category_id: food.category_id,
        image: null, //  เพิ่ม image
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category_id", data.category_id);
        if (data.image) formData.append("image", data.image);
    
        //  ใช้ POST พร้อม _method PUT
        formData.append("_method", "PUT");
    
        Inertia.post(route('admin.foods.update', { food: food.id }), formData, {
            onSuccess: () => reset(),
        });
    };
    
    return (
            <div className="mt-2" >
                <LoggedInNavbar></LoggedInNavbar>
            
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl mt-10">
               
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">แก้ไขเมนูอาหาร</h1>
                
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">ชื่ออาหาร</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-2">{errors.name}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">รายละเอียด</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">ราคา</label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.price && <div className="text-red-500 text-sm mt-2">{errors.price}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">หมวดหมู่</label>
                        <select
                            value={data.category_id}
                            onChange={(e) => setData("category_id", e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <div className="text-red-500 text-sm mt-2">{errors.category_id}</div>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-medium text-gray-700 mb-2">อัปโหลดรูปภาพใหม่</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData("image", e.target.files[0])} // ✅ บันทึกไฟล์ใน state
                            className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.image && <div className="text-red-500 text-sm mt-2">{errors.image}</div>}
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            บันทึกการแก้ไข
                        </button>
                    </div>
                </form>
            </div>
            </div>
    );
}
