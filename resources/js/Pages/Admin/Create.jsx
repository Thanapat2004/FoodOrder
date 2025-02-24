import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from '@inertiajs/react';
import '@fontsource/noto-sans-thai';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setData(name, files ? files[0] : value);
    };

    const handleSubmit = (e) => {
        console.log(data);
        e.preventDefault();
        post('/admin/foods', {
            onSuccess: () => alert('เพิ่มสินค้าเรียบร้อยแล้ว'),
            onError: () => alert('เกิดข้อผิดพลาด')
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
                <h1 className="text-4xl font-semibold text-center text-gray-900 mb-8 ">เพิ่มเมนูอาหารใหม่</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อเมนูอาหาร</label>
                        <input type="text" id="name" name="name" value={data.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <textarea id="description" name="description" value={data.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">ราคา</label>
                        <input type="number" id="price" name="price" value={data.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">หมวดหมู่</label>
                        <select id="category_id" name="category_id" value={data.category_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="">เลือกหมวดหมู่</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">รูปภาพ</label>
                        <input type="file" id="image" name="image" onChange={handleChange} className="mt-1 block w-full" />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    </div>

                    <div className="text-center">
                        <button type="submit" disabled={processing} className={`bg-green-600 text-white px-4 py-2 rounded-md ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}>
                            {processing ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
