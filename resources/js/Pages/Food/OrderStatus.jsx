import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/inertia-react';
import '@fontsource/noto-sans-thai';
import { LoggedInNavbar } from "@/Components/LoggedInNavbar";

export default function OrderStatus({ orders }) {
  const [orderStatus, setOrderStatus] = useState('กำลังโหลดข้อมูล...');
  
  useEffect(() => {
    if (orders.length > 0) {
      setOrderStatus('คำสั่งซื้อของคุณ');
    } else {
      setOrderStatus('ยังไม่มีคำสั่งซื้อ');
    }
  }, [orders]);

  return (
   
      <div style={{ fontFamily: 'Noto Sans Thai, sans-serif' }} className="container mx-auto p-8">
         <div >
    <LoggedInNavbar/>
    </div>
        <h1 className="text-3xl font-bold mb-4">สถานะการสั่งซื้อ</h1>
        
        <div className="mb-8">
          <p className="text-xl">{orderStatus}</p>
        </div>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => {
              console.log(order.foods); // ย้ายที่นี่เพื่อดูข้อมูล foods ของแต่ละคำสั่งซื้อ
              return (
                <div key={order.id} className="border rounded-lg p-4 shadow-lg">
                  <h2 className="text-2xl font-semibold">คำสั่งซื้อที่ #{order.id}</h2>
                  <p className="text-gray-600">สถานะ: {order.status}</p>

                  <div className="mt-4">
                    <h3 className="text-xl">รายการอาหารที่สั่ง:</h3>
                    <ul>
                      {order.foods.map((food) => (
                        <li key={food.id} className="flex justify-between">
                          <span>{food.name}</span>
                          <span>จำนวน: {food.pivot.quantity} x {food.price} ฿</span>
                          <span className="font-bold">
                            {food.pivot.quantity * food.price} ฿
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="text-lg font-semibold">
                      รวม: {order.foods.reduce((total, food) => total + (food.pivot.quantity * food.price), 0)} ฿
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>ยังไม่มีคำสั่งซื้อ</p>
          )}
        </div>

        <Link href="/Food/Addtocart" className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 mt-8 inline-block">
          กลับไปยังเมนูอาหาร
        </Link>
      </div>
  
  );
}
