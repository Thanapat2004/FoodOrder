import React, { useState } from 'react';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import { Footer } from '@/Components/Footer';
import { Link } from '@inertiajs/inertia-react';
import { route } from 'ziggy-js';
import '@fontsource/noto-sans-thai';

export default function FoodsAdmin() {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <LoggedInNavbar className="fixed top-0 z-50 w-full bg-white shadow-md" />

      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">จัดการอาหาร</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหารายการอาหาร"
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="flex justify-end mb-4">
          <Link
            href={route('admin.foods.create')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md transition"
          >
            เพิ่มเมนูอาหาร
          </Link>
        </div>

        {/* Future implementation: Food list here */}

        <Footer />
      </div>
    </div>
  );
}

