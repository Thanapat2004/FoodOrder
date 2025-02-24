import React from 'react';
import '@fontsource/noto-sans-thai';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Status({ orders }) {
    return (
        <AuthenticatedLayout>
            <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
                <h1 className="text-4xl font-semibold text-center text-gray-900 mb-8">สถานะการสั่งซื้อทั้งหมด</h1>

                {/* ถ้าไม่มีคำสั่งซื้อ */}
                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">คุณยังไม่มีคำสั่งซื้อ</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {orders.map((order, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-medium text-gray-800 mb-2">คำสั่งซื้อที่ {order.id}</h2>
                                <p className="text-gray-600 mb-4">สถานะ: <span className="font-semibold">{order?.status || 'N/A'}</span></p>
                                <p className="text-red-500 text-lg mb-4">ยอดรวม: ฿{order?.total_price || 0}</p>

                                {/* ข้อมูลการชำระเงิน */}
                                {order?.payment ? (
                                    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                                        <p className="text-gray-700">วิธีชำระเงิน: <span className="font-semibold">{order.payment?.payment_method || 'N/A'}</span></p>
                                        <p className="text-gray-700">จำนวนเงิน: <span className="font-semibold">฿{order.payment?.amount || 0}</span></p>
                                    </div>
                                ) : (
                                    <p className="text-red-500 mt-2">ไม่มีข้อมูลการชำระเงิน</p>
                                )}

                                {/* รายการอาหาร */}
                                <ul className="mt-4 space-y-2">
                                    {order?.order_items?.map((item, idx) => (
                                        <li key={idx} className="flex justify-between py-2 text-gray-700 border-b border-gray-200">
                                            <span>{item.food?.name || 'ไม่ทราบชื่ออาหาร'}</span>
                                            <span>{item.quantity || 0} x ฿{item.food?.price || 0}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
