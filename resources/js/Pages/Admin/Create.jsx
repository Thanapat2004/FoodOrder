import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { router } from '@inertiajs/react';
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
            <Head title="เพิ่มเมนูอาหารใหม่" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Back navigation */}
                            <div className="mb-6">
                                <SecondaryButton onClick={() => router.visit('/admin/foods')}>
                                    ← กลับไปยังรายการอาหาร
                                </SecondaryButton>
                            </div>
                            
                            <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-6">เพิ่มเมนูอาหารใหม่</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="ชื่อเมนูอาหาร" />
                                    <TextInput type="text" id="name" name="name" value={data.name} onChange={handleChange} required className="mt-1 block w-full" />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="คำอธิบาย" />
                                    <textarea id="description" name="description" value={data.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3"></textarea>
                                    <InputError message={errors.description} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="price" value="ราคา" />
                                    <TextInput type="number" id="price" name="price" value={data.price} onChange={handleChange} required className="mt-1 block w-full" />
                                    <InputError message={errors.price} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category_id" value="หมวดหมู่" />
                                    <select id="category_id" name="category_id" value={data.category_id} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                        <option value="">เลือกหมวดหมู่</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="image" value="รูปภาพ" />
                                    <input type="file" id="image" name="image" onChange={handleChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    <InputError message={errors.image} className="mt-1" />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
       
    );
}
