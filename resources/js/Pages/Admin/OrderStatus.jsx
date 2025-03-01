import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { LoggedInNavbar } from '@/Components/LoggedInNavbar';
import "@fontsource/noto-sans-thai";
import { Footer } from '@/Components/Footer';

export default function Status({ orders, statusUpdateSuccess }) {
    const [orderStatuses, setOrderStatuses] = useState({});

    useEffect(() => {
        const initialStatuses = orders.reduce((acc, order) => {
            acc[order.id] = order.status || 'pending';
            return acc;
        }, {});
        setOrderStatuses(initialStatuses);
    }, [orders]);

    const handleStatusChange = (event, orderId) => {
        setOrderStatuses({
            ...orderStatuses,
            [orderId]: event.target.value,
        });
    };

    const handleUpdateStatus = (orderId) => {
        const newStatus = orderStatuses[orderId];
        const currentOrder = orders.find(order => order.id === orderId);

        if (!newStatus || newStatus === currentOrder.status) {
            alert('กรุณาเลือกสถานะใหม่หรือสถานะเดิม');
            return;
        }

        Inertia.put(route('admin.orders.update', orderId), { status: newStatus })
            .then(response => {
                console.log('สถานะอัปเดตสำเร็จ:', response);
                setOrderStatuses({
                    ...orderStatuses,
                    [orderId]: newStatus,
                });
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ:', error);
            });
    };

    return (
            <div className='container mx-auto p-8'>
                <LoggedInNavbar></LoggedInNavbar>
            <div className="max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
                
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 ">สถานะการสั่งซื้อทั้งหมด</h1>

                {/* แสดงข้อความสำเร็จถ้ามีการอัปเดตสถานะ */}
                {statusUpdateSuccess && (
                    <div className="mb-6 p-4 bg-green-200 text-green-800 rounded-md text-center">
                        {statusUpdateSuccess}
                    </div>
                )}

                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center">คุณยังไม่มีคำสั่งซื้อ</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <h2 className="text-xl font-medium text-gray-800 mb-4">คำสั่งซื้อที่ {order.id}</h2>
                                <p className="text-gray-600">สถานะ: <span className="font-semibold">{orderStatuses[order.id] || 'N/A'}</span></p>
                                <p className="text-red-500 mt-2">ยอดรวม: ฿{order.total_price || 0}</p>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700">เปลี่ยนสถานะคำสั่งซื้อ</label>
                                    <select
                                        className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={orderStatuses[order.id] || 'pending'}
                                        onChange={(e) => handleStatusChange(e, order.id)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="canceled">Canceled</option>
                                    </select>
                                    <button
                                        onClick={() => handleUpdateStatus(order.id)}
                                        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-200 ease-in-out"
                                    >
                                        อัปเดตสถานะ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <a href="/foods" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-200 ease-in-out">
                        กลับไปหน้าแรก
                    </a>
                </div>
            </div>
            <div className='mt-10'>
<Footer></Footer>
</div>

            </div>
    );
}
