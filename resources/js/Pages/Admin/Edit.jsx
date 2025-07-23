import React from "react";
import { useForm, Head, router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import "@fontsource/noto-sans-thai";

export default function Edit({ food, categories }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: food.name,
        description: food.description,
        price: food.price,
        category_id: food.category_id,
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category_id", data.category_id);
        if (data.image) formData.append("image", data.image);
        formData.append("_method", "PUT");
    
        router.post(route('admin.foods.update', { food: food.id }), formData, {
            onSuccess: () => reset(),
        });
    };
    
    return (
<AuthenticatedLayout>
        <Head title="Edit Food" />

           <div className="min-h-screen bg-gray-50 py-8">
               <div className="max-w-2xl mx-auto">
                   {/* Back link */}
                   <div className="mb-6">
                       <Link
                           href={route('admin.foods.index')}
                           className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                       >
                           <ArrowLeftIcon className="w-4 h-4 mr-2" />
                           กลับไปหน้าจัดการอาหาร
                       </Link>
                   </div>

                   <div className="bg-white shadow-sm rounded-lg p-6">
                       <h1 className="text-2xl font-bold text-gray-900 mb-6">แก้ไขเมนูอาหาร</h1>
                       
                       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                           <div>
                               <InputLabel htmlFor="name" value="ชื่ออาหาร" />
                               <TextInput
                                   id="name"
                                   type="text"
                                   className="mt-1 block w-full"
                                   value={data.name}
                                   onChange={(e) => setData('name', e.target.value)}
                                   required
                                   isFocused
                                   autoComplete="name"
                               />
                               <InputError message={errors.name} className="mt-2" />
                           </div>

                           <div>
                               <InputLabel htmlFor="description" value="รายละเอียด" />
                               <textarea
                                   id="description"
                                   value={data.description}
                                   onChange={(e) => setData('description', e.target.value)}
                                   className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                   rows="4"
                               />
                               <InputError message={errors.description} className="mt-2" />
                           </div>

                           <div>
                               <InputLabel htmlFor="price" value="ราคา (บาท)" />
                               <TextInput
                                   id="price"
                                   type="number"
                                   step="0.01"
                                   className="mt-1 block w-full"
                                   value={data.price}
                                   onChange={(e) => setData('price', e.target.value)}
                                   required
                               />
                               <InputError message={errors.price} className="mt-2" />
                           </div>

                           <div>
                               <InputLabel htmlFor="category_id" value="หมวดหมู่" />
                               <select
                                   id="category_id"
                                   value={data.category_id}
                                   onChange={(e) => setData('category_id', e.target.value)}
                                   className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                   required
                               >
                                   {categories.map((category) => (
                                       <option key={category.id} value={category.id}>
                                           {category.name}
                                       </option>
                                   ))}
                               </select>
                               <InputError message={errors.category_id} className="mt-2" />
                           </div>

                           <div>
                               <InputLabel htmlFor="image" value="อัปโหลดรูปภาพใหม่ (ไม่จำเป็น)" />
                               <input
                                   id="image"
                                   type="file"
                                   accept="image/*"
                                   onChange={(e) => setData('image', e.target.files[0])}
                                   className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                               />
                               <InputError message={errors.image} className="mt-2" />
                               <p className="mt-1 text-sm text-gray-500">
                                   หากไม่ต้องการเปลี่ยนรูปภาพ ให้เว้นว่างไว้
                               </p>
                           </div>

                           <div className="flex items-center justify-end space-x-4">
                               <SecondaryButton type="button" onClick={() => window.history.back()}>
                                   ยกเลิก
                               </SecondaryButton>
                               <PrimaryButton disabled={processing}>
                                   {processing ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                               </PrimaryButton>
                           </div>
                       </form>
                   </div>
               </div>
           </div>
       </AuthenticatedLayout>
            
    );
}
